import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, Lightbulb, Loader2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

import matchingService, { getMatchingErrorMessage } from '../../../features/matching/matchingService';
import Button from '../../common/Button';
import { getMatchLevel } from '../MatchScore';

const SECTION_LABELS = { summary: 'Giới thiệu bản thân', experience: 'Kinh nghiệm', project: 'Dự án' };

const suggestionKey = (s) => `${s.sectionType}:${s.sectionId ?? ''}`;

/**
 * Nội dung modal "Trợ lý AI sửa hồ sơ": gọi agent ngay khi mở, hiển thị điểm hiện tại -> dự kiến,
 * từng gợi ý (bản gốc / bản đề xuất / lý do) với nút Áp dụng, và lời khuyên về kỹ năng còn thiếu.
 */
export default function CvAdvicePanel({ jobId, onApplied }) {
  const [advice, setAdvice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState({});      // key -> true
  const [applyingKey, setApplyingKey] = useState(null);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await matchingService.getAdviceForJob(jobId);
        if (!cancelled) setAdvice(res.data);
      } catch (err) {
        if (!cancelled) setError(getMatchingErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [jobId]);

  const handleApply = async (s) => {
    const key = suggestionKey(s);
    setApplyingKey(key);
    setApplyError('');
    try {
      await matchingService.applySuggestion({ sectionType: s.sectionType, sectionId: s.sectionId, text: s.suggested });
      setApplied((prev) => ({ ...prev, [key]: true }));
      onApplied?.();
    } catch (err) {
      setApplyError(getMatchingErrorMessage(err));
    } finally {
      setApplyingKey(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 px-8 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="font-semibold text-gray-800">AI đang đọc hồ sơ và soạn gợi ý...</p>
        <p className="text-sm text-gray-500 mt-1">Mô hình ngôn ngữ chạy trên máy chủ nội bộ nên có thể mất 1–2 phút.</p>
      </div>
    );
  }

  if (error) {
    return <div className="m-6 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg p-4">{error}</div>;
  }

  const current = getMatchLevel(advice.currentScore);
  const projected = getMatchLevel(advice.projectedScore);

  return (
    <div className="p-6 space-y-6">
      {/* Điểm hiện tại -> dự kiến */}
      <div className="flex flex-wrap items-center gap-4 bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
        <TrendingUp className="w-6 h-6 text-indigo-600 shrink-0" />
        <div className="flex items-center gap-3 text-2xl font-extrabold tabular-nums">
          <span className={current.text}>{Math.round(advice.currentScore)}</span>
          <ArrowRight className="w-5 h-5 text-gray-400" />
          <span className={projected.text}>{Math.round(advice.projectedScore)}</span>
        </div>
        <p className="text-sm text-gray-600 flex-1 min-w-[200px]">
          Điểm phù hợp dự kiến nếu áp dụng mọi gợi ý bên dưới (đã được chấm lại bằng mô hình AI của Worklify).
        </p>
      </div>

      {/* Gợi ý viết lại */}
      <div className="space-y-4">
        <h4 className="font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" /> Gợi ý viết lại ({advice.suggestions.length})
        </h4>

        {advice.suggestions.length === 0 && (
          <p className="text-sm text-gray-500">Hồ sơ của bạn đã khá sát yêu cầu, AI không có gợi ý viết lại nào đáng tin cậy.</p>
        )}
        {applyError && <p className="text-sm text-rose-600">{applyError}</p>}

        {advice.suggestions.map((s) => {
          const key = suggestionKey(s);
          const isApplied = applied[key];
          return (
            <div key={key} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                <div className="min-w-0">
                  <span className="text-xs font-semibold uppercase text-indigo-600">{SECTION_LABELS[s.sectionType]}</span>
                  <p className="text-sm font-semibold text-gray-800 truncate">{s.title}</p>
                </div>
                {s.scoreGain > 0 && (
                  <span className="shrink-0 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 tabular-nums">
                    +{s.scoreGain} điểm
                  </span>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-0 md:divide-x divide-gray-100">
                <div className="p-4">
                  <p className="text-xs font-semibold text-gray-400 mb-1">Hiện tại</p>
                  <p className="text-sm text-gray-500 whitespace-pre-line">{s.original?.trim() || '(đang để trống)'}</p>
                </div>
                <div className="p-4 bg-emerald-50/40">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">AI đề xuất</p>
                  <p className="text-sm text-gray-800 whitespace-pre-line">{s.suggested}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 flex items-start gap-1.5 flex-1 min-w-[200px]">
                  <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" /> {s.reason}
                </p>
                <Button
                  onClick={() => handleApply(s)}
                  isLoading={applyingKey === key}
                  disabled={isApplied || (applyingKey && applyingKey !== key)}
                  variant={isApplied ? 'secondary' : 'primary'}
                  className={`px-4 py-2 text-xs rounded-lg ${isApplied ? '' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {isApplied ? <><Check className="w-3.5 h-3.5" /> Đã áp dụng</> : 'Áp dụng vào hồ sơ'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lời khuyên kỹ năng */}
      {advice.skillAdvice?.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-bold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" /> Về kỹ năng còn thiếu
          </h4>
          <ul className="space-y-1.5">
            {advice.skillAdvice.map((tip) => (
              <li key={tip} className="text-sm text-gray-700 flex gap-2">
                <span className="text-amber-500">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[11px] text-gray-400 flex items-start gap-1.5 border-t border-gray-100 pt-4">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
        <span>
          AI chỉ được diễn đạt lại thông tin có sẵn trong hồ sơ. Gợi ý tự thêm kỹ năng bạn chưa khai báo hoặc làm giảm điểm đã bị loại
          {advice.discardedSuggestions > 0 ? ` (${advice.discardedSuggestions} gợi ý)` : ''}. Hãy đọc kỹ trước khi áp dụng.
          Mô hình: {advice.llmModel}.
        </span>
      </p>
    </div>
  );
}
