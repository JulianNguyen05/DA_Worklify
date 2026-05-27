import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const navLinks = [
    { label: 'Việc làm', to: '/jobs' },
    { label: 'Công ty', to: '/companies' },
    { label: 'Hồ sơ', to: '/resume' },
    { label: 'Blog nghề nghiệp', to: '/blog' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid transparent',
        transition: 'all 0.25s ease',
      }}
    >
      <nav
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 16, letterSpacing: -0.5 }}>W</span>
          </div>
          <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800, fontSize: 18, color: '#0F172A', letterSpacing: -0.5 }}>
            Work<span style={{ color: '#2563EB' }}>lify</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }} className="nav-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: location.pathname === link.to ? '#2563EB' : '#475569',
                textDecoration: 'none',
                background: location.pathname === link.to ? '#EFF6FF' : 'transparent',
                transition: 'all 0.15s',
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== link.to) {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.color = '#0F172A';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== link.to) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#475569';
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }} className="nav-desktop">
          <Link
            to="/auth/login"
            style={{
              padding: '7px 16px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#2563EB',
              textDecoration: 'none',
              border: '1.5px solid #BFDBFE',
              background: 'transparent',
              transition: 'all 0.15s',
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            Đăng nhập
          </Link>
          <Link
            to="/auth/register"
            style={{
              padding: '7px 18px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
              boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
              transition: 'all 0.15s',
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Đăng ký miễn phí
          </Link>

          {/* Hamburger (mobile) */}
          <button
            className="nav-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
            }}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: '#fff',
          borderTop: '1px solid #E2E8F0',
          padding: '12px 24px 20px',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'block',
                padding: '11px 0',
                fontSize: 15,
                fontWeight: 500,
                color: '#0F172A',
                textDecoration: 'none',
                borderBottom: '1px solid #F1F5F9',
                fontFamily: "'Be Vietnam Pro', sans-serif",
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <Link to="/auth/login" style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 8, border: '1.5px solid #BFDBFE', color: '#2563EB', fontWeight: 600, fontSize: 14, textDecoration: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Đăng nhập</Link>
            <Link to="/auth/register" style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 8, background: '#2563EB', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Đăng ký</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    {
      title: 'Ứng viên',
      links: ['Tìm việc làm', 'Hồ sơ xin việc', 'Tư vấn nghề nghiệp', 'Blog & tips'],
    },
    {
      title: 'Nhà tuyển dụng',
      links: ['Đăng tin tuyển dụng', 'Tìm ứng viên', 'Bảng giá', 'Hướng dẫn'],
    },
    {
      title: 'Worklify',
      links: ['Về chúng tôi', 'Báo chí', 'Điều khoản', 'Chính sách bảo mật'],
    },
  ];

  return (
    <footer style={{ background: '#0F172A', color: '#94A3B8', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          {/* Brand col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #2563EB, #14B8A6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>W</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#F8FAFC' }}>Work<span style={{ color: '#60A5FA' }}>lify</span></span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: '#64748B', maxWidth: 240 }}>
              Nền tảng tuyển dụng hiện đại, kết nối ứng viên tài năng với những cơ hội nghề nghiệp phù hợp nhất.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {['facebook', 'linkedin', 'twitter'].map((s) => (
                <a key={s} href={`#${s}`} style={{
                  width: 34, height: 34, borderRadius: 8, border: '1px solid #1E293B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#64748B', fontSize: 13, textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.color = '#60A5FA'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1E293B'; e.currentTarget.style.color = '#64748B'; }}
                >
                  {s[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col.title}</h4>
              {col.links.map((l) => (
                <a key={l} href="#" style={{ display: 'block', fontSize: 14, color: '#64748B', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#94A3B8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                >{l}</a>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #1E293B', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13 }}>&copy; 2026 Worklify. Tất cả các quyền được bảo lưu.</span>
          <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
            <a href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Điều khoản</a>
            <a href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Bảo mật</a>
            <a href="#" style={{ color: '#64748B', textDecoration: 'none' }}>Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── MainLayout ───────────────────────────────────────────────────────────────
export default function MainLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Be Vietnam Pro', sans-serif", background: '#F8FAFC' }}>
      <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
