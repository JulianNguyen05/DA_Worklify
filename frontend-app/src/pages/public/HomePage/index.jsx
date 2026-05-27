import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// ─── Animated counter ────────────────────────────────────────────────────────
function CountUp({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(ease * end));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString('vi-VN')}{suffix}</span>;
}

// ─── Job Category Card ────────────────────────────────────────────────────────
function CategoryCard({ icon, label, count, color }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? color.bg : '#fff',
        border: `1.5px solid ${hovered ? color.border : '#E2E8F0'}`,
        borderRadius: 14,
        padding: '20px 18px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? `0 8px 24px ${color.shadow}` : '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{label}</div>
        <div style={{ fontSize: 12, color: '#64748B', marginTop: 3, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{count} vị trí</div>
      </div>
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ title, company, location, salary, type, logo, tags, isNew }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1.5px solid ${hovered ? '#BFDBFE' : '#E2E8F0'}`,
        borderRadius: 14,
        padding: '20px 22px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 28px rgba(37,99,235,0.10)' : '0 1px 4px rgba(0,0,0,0.05)',
        position: 'relative',
      }}
    >
      {isNew && (
        <span style={{
          position: 'absolute', top: 14, right: 14,
          background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
          color: '#fff', fontSize: 10, fontWeight: 700,
          padding: '2px 8px', borderRadius: 20,
          fontFamily: "'Be Vietnam Pro', sans-serif",
          letterSpacing: '0.04em',
        }}>MỚI</span>
      )}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{
          width: 46, height: 46, borderRadius: 10, border: '1px solid #E2E8F0',
          background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0,
        }}>{logo}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', fontFamily: "'Be Vietnam Pro', sans-serif", marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 40 }}>{title}</div>
          <div style={{ fontSize: 13, color: '#64748B', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{company} · {location}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
        {tags.map((t) => (
          <span key={t} style={{
            background: '#F1F5F9', color: '#475569',
            fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 20,
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}>{t}</span>
        ))}
        <span style={{
          background: '#ECFDF5', color: '#065F46',
          fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
          fontFamily: "'Be Vietnam Pro', sans-serif", marginLeft: 'auto',
        }}>{salary}</span>
      </div>
    </div>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({ keyword: '', location: '' });
  const [activeTab, setActiveTab] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(searchParams).toString();
    navigate(`/jobs?${query}`);
  };

  const popularKeywords = ['Frontend Developer', 'Marketing', 'Product Designer', 'Data Analyst', 'Kế toán', 'HR'];

  const categories = [
    { icon: '💻', label: 'Công nghệ thông tin', count: '3.240', color: { bg: '#EFF6FF', border: '#BFDBFE', shadow: 'rgba(37,99,235,0.12)' } },
    { icon: '📊', label: 'Marketing & Truyền thông', count: '1.820', color: { bg: '#F0FDF4', border: '#BBF7D0', shadow: 'rgba(22,163,74,0.10)' } },
    { icon: '🎨', label: 'Thiết kế & Sáng tạo', count: '940', color: { bg: '#FDF4FF', border: '#E9D5FF', shadow: 'rgba(147,51,234,0.10)' } },
    { icon: '💰', label: 'Tài chính & Kế toán', count: '1.560', color: { bg: '#FFFBEB', border: '#FDE68A', shadow: 'rgba(245,158,11,0.10)' } },
    { icon: '🏗️', label: 'Kinh doanh & Bán hàng', count: '2.100', color: { bg: '#FFF1F2', border: '#FECDD3', shadow: 'rgba(244,63,94,0.10)' } },
    { icon: '⚙️', label: 'Kỹ thuật & Sản xuất', count: '870', color: { bg: '#F0FDFA', border: '#99F6E4', shadow: 'rgba(20,184,166,0.10)' } },
    { icon: '🏥', label: 'Y tế & Chăm sóc sức khỏe', count: '620', color: { bg: '#EFF6FF', border: '#BAE6FD', shadow: 'rgba(14,165,233,0.10)' } },
    { icon: '📚', label: 'Giáo dục & Đào tạo', count: '750', color: { bg: '#FFF7ED', border: '#FED7AA', shadow: 'rgba(249,115,22,0.10)' } },
  ];

  const jobs = [
    { title: 'Senior Frontend Developer', company: 'Tiki Corporation', location: 'TP. HCM', salary: '40 – 60 triệu', type: 'Full-time', logo: '🛒', tags: ['React', 'TypeScript', 'Remote OK'], isNew: true },
    { title: 'Product Designer (UI/UX)', company: 'VNG Corporation', location: 'TP. HCM', salary: '30 – 50 triệu', type: 'Full-time', logo: '🎮', tags: ['Figma', 'Design System'], isNew: true },
    { title: 'Marketing Manager', company: 'Vingroup', location: 'Hà Nội', salary: '35 – 55 triệu', type: 'Full-time', logo: '🏢', tags: ['Digital Marketing', 'SEO', 'Content'], isNew: false },
    { title: 'Data Analyst', company: 'MoMo', location: 'TP. HCM', salary: '25 – 40 triệu', type: 'Full-time', logo: '💳', tags: ['SQL', 'Python', 'Power BI'], isNew: false },
    { title: 'Backend Engineer (Go/Node)', company: 'Grab Vietnam', location: 'Hybrid', salary: '45 – 70 triệu', type: 'Full-time', logo: '🚗', tags: ['Go', 'Microservices', 'AWS'], isNew: true },
    { title: 'HR Business Partner', company: 'Shopee Vietnam', location: 'TP. HCM', salary: '20 – 35 triệu', type: 'Full-time', logo: '🛍️', tags: ['HR', 'Talent Mgmt', 'C&B'], isNew: false },
  ];

  const steps = [
    { num: '01', title: 'Tạo hồ sơ của bạn', desc: 'Điền thông tin cá nhân, kinh nghiệm và kỹ năng để tạo hồ sơ nổi bật.', color: '#2563EB' },
    { num: '02', title: 'Khám phá cơ hội', desc: 'Tìm kiếm và lọc hàng nghìn vị trí phù hợp với định hướng nghề nghiệp.', color: '#14B8A6' },
    { num: '03', title: 'Nộp đơn ứng tuyển', desc: 'Gửi đơn chỉ trong vài giây và theo dõi tiến trình ứng tuyển realtime.', color: '#7C3AED' },
  ];

  const testimonials = [
    { name: 'Nguyễn Minh Khoa', role: 'Frontend Developer tại Tiki', avatar: '👨‍💻', quote: 'Chỉ sau 2 tuần đăng hồ sơ, tôi đã nhận được 8 lời mời phỏng vấn. Worklify thực sự rất hiệu quả!' },
    { name: 'Trần Thị Mai Anh', role: 'HR Manager tại VNG', avatar: '👩‍💼', quote: 'Nền tảng tuyển dụng tốt nhất tôi từng dùng. Giao diện đẹp, dễ dùng và tìm được ứng viên chất lượng cao.' },
    { name: 'Lê Hoàng Phúc', role: 'Product Designer tại Grab', avatar: '🧑‍🎨', quote: 'Worklify giúp tôi kết nối đúng với công ty phù hợp. Quy trình nộp đơn cực kỳ mượt mà và nhanh chóng.' },
  ];

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section style={{ background: '#F8FAFC', paddingTop: 72, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', top: -120, right: -120, width: 500, height: 500, background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, background: 'radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.5, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24,
            background: '#fff', border: '1.5px solid #BFDBFE', borderRadius: 99,
            padding: '6px 16px',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#2563EB' }}>12,000+ việc làm đang chờ bạn</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 60px)',
            fontWeight: 900,
            color: '#0F172A',
            lineHeight: 1.15,
            letterSpacing: -1.5,
            marginBottom: 20,
          }}>
            Tìm việc làm mơ ước<br />
            <span style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              chỉ trong vài bước
            </span>
          </h1>

          <p style={{ fontSize: 18, color: '#64748B', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Worklify kết nối ứng viên tài năng với hàng nghìn cơ hội việc làm từ các công ty hàng đầu Việt Nam.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{
            background: '#fff',
            border: '1.5px solid #E2E8F0',
            borderRadius: 16,
            padding: 8,
            display: 'flex',
            gap: 0,
            boxShadow: '0 8px 40px rgba(37,99,235,0.10)',
            maxWidth: 700,
            margin: '0 auto',
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', borderRight: '1px solid #E2E8F0' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                placeholder="Chức danh, kỹ năng hoặc công ty..."
                value={searchParams.keyword}
                onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: '#0F172A', fontFamily: "'Be Vietnam Pro', sans-serif", background: 'transparent' }}
              />
            </div>
            <div style={{ flex: 0.6, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <input
                type="text"
                placeholder="Địa điểm"
                value={searchParams.location}
                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: '#0F172A', fontFamily: "'Be Vietnam Pro', sans-serif", background: 'transparent' }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '13px 28px', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                boxShadow: '0 2px 12px rgba(37,99,235,0.3)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Tìm kiếm
            </button>
          </form>

          {/* Popular */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>Phổ biến:</span>
            {popularKeywords.map((k) => (
              <button
                key={k}
                onClick={() => { setSearchParams({ keyword: k, location: '' }); navigate(`/jobs?keyword=${k}`); }}
                style={{
                  background: 'transparent', border: '1px solid #E2E8F0', borderRadius: 99,
                  padding: '4px 12px', fontSize: 13, color: '#475569', cursor: 'pointer',
                  fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.background = '#EFF6FF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '40px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[
            { value: 12000, suffix: '+', label: 'Việc làm đang mở' },
            { value: 5400, suffix: '+', label: 'Công ty uy tín' },
            { value: 98000, suffix: '+', label: 'Ứng viên đăng ký' },
            { value: 87, suffix: '%', label: 'Tỷ lệ thành công' },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign: 'center',
              padding: '16px 24px',
              borderRight: i < 3 ? '1px solid #E2E8F0' : 'none',
            }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', letterSpacing: -1, lineHeight: 1 }}>
                <CountUp end={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 6, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', background: '#EFF6FF', color: '#2563EB', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 99, marginBottom: 14, letterSpacing: '0.06em' }}>NGÀNH NGHỀ</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#0F172A', letterSpacing: -0.8, marginBottom: 12 }}>Khám phá theo ngành nghề</h2>
            <p style={{ fontSize: 16, color: '#64748B', maxWidth: 480, margin: '0 auto' }}>Tìm kiếm cơ hội phù hợp trong hàng chục lĩnh vực khác nhau</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {categories.map((cat) => (
              <CategoryCard key={cat.label} {...cat} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/jobs" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: '#2563EB', fontWeight: 700, fontSize: 15, textDecoration: 'none',
              border: '1.5px solid #BFDBFE', padding: '10px 24px', borderRadius: 10, background: '#fff',
              transition: 'all 0.15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
            >
              Xem tất cả ngành nghề
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS ──────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'inline-block', background: '#F0FDF4', color: '#166534', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 99, marginBottom: 14, letterSpacing: '0.06em' }}>VIỆC LÀM</div>
              <h2 style={{ fontSize: 34, fontWeight: 800, color: '#0F172A', letterSpacing: -0.8, margin: 0 }}>Cơ hội nổi bật</h2>
            </div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', borderRadius: 10, padding: 4 }}>
              {['all', 'fulltime', 'parttime', 'remote'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                    background: activeTab === tab ? '#fff' : 'transparent',
                    color: activeTab === tab ? '#0F172A' : '#64748B',
                    boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                  }}
                >
                  {{ all: 'Tất cả', fulltime: 'Full-time', parttime: 'Part-time', remote: 'Remote' }[tab]}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {jobs.map((job, i) => <JobCard key={i} {...job} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/jobs" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
              color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none',
              padding: '13px 32px', borderRadius: 12,
              boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
              transition: 'all 0.15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.35)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.3)'; }}
            >
              Xem tất cả việc làm
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-block', background: '#F5F3FF', color: '#6D28D9', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 99, marginBottom: 14, letterSpacing: '0.06em' }}>QUY TRÌNH</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#0F172A', letterSpacing: -0.8, marginBottom: 12 }}>Bắt đầu chỉ trong 3 bước</h2>
            <p style={{ fontSize: 16, color: '#64748B', maxWidth: 400, margin: '0 auto' }}>Đơn giản, nhanh chóng và hiệu quả</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 40, left: '17%', right: '17%', height: 2, background: 'linear-gradient(90deg, #2563EB, #14B8A6)', opacity: 0.25, pointerEvents: 'none' }} />
            {steps.map((step, i) => (
              <div key={i} style={{
                background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: 16,
                padding: '32px 28px', textAlign: 'center',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: step.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 900, margin: '0 auto 20px',
                  boxShadow: `0 4px 16px ${step.color}40`,
                }}>{step.num}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#0F172A' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-block', background: 'rgba(37,99,235,0.2)', color: '#60A5FA', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 99, marginBottom: 14, letterSpacing: '0.06em' }}>ĐÁNH GIÁ</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#F8FAFC', letterSpacing: -0.8, marginBottom: 12 }}>Họ đã thành công cùng Worklify</h2>
            <p style={{ fontSize: 16, color: '#94A3B8', maxWidth: 440, margin: '0 auto' }}>Hàng nghìn ứng viên đã tìm được việc làm lý tưởng</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: '#1E293B', border: '1px solid #334155', borderRadius: 16, padding: '28px 24px',
              }}>
                <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.8, marginBottom: 24 }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          background: 'linear-gradient(135deg, #1d4ed8 0%, #2563EB 50%, #0891b2 100%)',
          borderRadius: 24, padding: '64px 40px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, background: 'rgba(255,255,255,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 16, lineHeight: 1.2 }}>
              Sẵn sàng bứt phá<br />sự nghiệp của bạn?
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 }}>
              Tham gia cùng 98,000+ ứng viên đang sử dụng Worklify để tìm kiếm cơ hội tốt nhất.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/auth/register" style={{
                background: '#fff', color: '#2563EB', fontWeight: 800, fontSize: 15,
                padding: '14px 36px', borderRadius: 12, textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'all 0.15s',
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Đăng ký miễn phí
              </Link>
              <Link to="/jobs" style={{
                background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: 15,
                padding: '14px 36px', borderRadius: 12, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.3)',
                transition: 'all 0.15s', fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              >
                Tìm việc ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR EMPLOYERS ──────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', background: '#ECFDF5', color: '#065F46', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 99, marginBottom: 20, letterSpacing: '0.06em' }}>NHÀ TUYỂN DỤNG</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', letterSpacing: -0.8, marginBottom: 16, lineHeight: 1.25 }}>Tìm nhân tài phù hợp, nhanh hơn bao giờ hết</h2>
            <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.8, marginBottom: 28 }}>
              Đăng tin tuyển dụng, quản lý ứng viên và xây dựng đội ngũ mạnh mẽ với bộ công cụ tuyển dụng toàn diện của Worklify.
            </p>
            {[
              'Tiếp cận hơn 98,000 ứng viên chất lượng',
              'Quản lý pipeline tuyển dụng trực quan',
              'Đăng tin và nhận hồ sơ ngay lập tức',
              'Báo cáo và phân tích chi tiết',
            ].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#ECFDF5', border: '1.5px solid #6EE7B7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontSize: 14, color: '#334155', fontWeight: 500 }}>{f}</span>
              </div>
            ))}
            <Link to="/auth/register?role=employer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 24,
              background: '#0F172A', color: '#fff', fontWeight: 700, fontSize: 15,
              padding: '13px 28px', borderRadius: 12, textDecoration: 'none',
              transition: 'all 0.15s', fontFamily: "'Be Vietnam Pro', sans-serif",
              boxShadow: '0 4px 16px rgba(15,23,42,0.2)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Đăng tin tuyển dụng
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { val: '5,400+', label: 'Công ty đang tuyển', color: '#EFF6FF', text: '#1E40AF' },
              { val: '98%', label: 'Tỷ lệ hài lòng', color: '#ECFDF5', text: '#065F46' },
              { val: '3 ngày', label: 'Thời gian tuyển TB', color: '#FDF4FF', text: '#5B21B6' },
              { val: '12K+', label: 'Tin đang hoạt động', color: '#FFFBEB', text: '#78350F' },
            ].map((s) => (
              <div key={s.label} style={{
                background: s.color, borderRadius: 14, padding: '24px 20px', textAlign: 'center',
                border: '1.5px solid rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: s.text, letterSpacing: -0.5, marginBottom: 6 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, letterSpacing: '0.02em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 768px) {
          section > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          section > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          section > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
