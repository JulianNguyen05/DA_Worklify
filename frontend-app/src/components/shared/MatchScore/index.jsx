import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

// Mức điểm -> màu và nhãn, dùng chung cho badge và thẻ chi tiết
export const getMatchLevel = (score) => {
  if (score >= 75) return { label: 'Phù hợp cao', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500', ring: '#10b981' };
  if (score >= 50) return { label: 'Phù hợp trung bình', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500', ring: '#f59e0b' };
  return { label: 'Phù hợp thấp', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', bar: 'bg-rose-500', ring: '#f43f5e' };
};

/** Nhãn điểm nhỏ gọn, dùng trong bảng danh sách. */
export function MatchScoreBadge({ score, onClick, title }) {
  const level = getMatchLevel(score);
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border tabular-nums ${level.bg} ${level.text} ${level.border} ${onClick ? 'hover:brightness-95 cursor-pointer' : ''}`}
    >
      {Math.round(score)}<span className="font-medium opacity-70">/100</span>
    </Tag>
  );
}

function ScoreRing({ score, size = 88 }) {
  const level = getMatchLevel(score);
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(100, score)) / 100);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} stroke={level.ring} strokeWidth={stroke} fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-gray-900 tabular-nums leading-none">{Math.round(score)}</span>
        <span className="text-[11px] text-gray-500">/100</span>
      </div>
    </div>
  );
}

const BREAKDOWN_LABELS = [
  ['semantic', 'Nội dung tương đồng'],
  ['skills', 'Kỹ năng yêu cầu'],
  ['experience', 'Kinh nghiệm'],
];

/** Thẻ chi tiết: điểm tổng, điểm thành phần, kỹ năng khớp/còn thiếu, giải thích. */
export function MatchScoreCard({ match, compact = false }) {
  if (!match) return null;
  const level = getMatchLevel(match.score);
  const matched = match.matchedSkills || [];
  const missing = match.missingSkills || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ScoreRing score={match.score} size={compact ? 72 : 88} />
        <div className="min-w-0">
          <p className={`font-bold ${level.text}`}>{level.label}</p>
          <p className="text-sm text-gray-600 leading-snug mt-1">{match.explanation}</p>
        </div>
      </div>

      <div className="space-y-2">
        {BREAKDOWN_LABELS.map(([key, label]) => {
          const value = match.breakdown?.[key];
          return (
            <div key={key}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold text-gray-800 tabular-nums">
                  {value == null ? 'Không áp dụng' : `${Math.round(value)}%`}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${value == null ? '' : getMatchLevel(value).bar}`} style={{ width: `${value ?? 0}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {(matched.length > 0 || missing.length > 0) && (
        <div className="space-y-2">
          {matched.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {matched.map((skill) => (
                <span key={`m-${skill}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3" /> {skill}
                </span>
              ))}
            </div>
          )}
          {missing.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {missing.map((skill) => (
                <span key={`x-${skill}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-xs font-medium border border-rose-100">
                  <XCircle className="w-3 h-3" /> {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-[11px] text-gray-400">
        Điểm do AI ước lượng từ hồ sơ online, chỉ mang tính tham khảo.
      </p>
    </div>
  );
}
