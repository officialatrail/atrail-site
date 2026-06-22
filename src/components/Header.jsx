import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Lock, Sun, Moon, ShieldCheck, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { isBannerDismissed, dismissBanner } from '../lib/contentStore';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(() => isBannerDismissed());
  const location = useLocation();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const showBanner = !bannerDismissed && !isAuthenticated;
  const bannerRef = useRef(null);
  const [bannerHeight, setBannerHeight] = useState(52);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!showBanner || !bannerRef.current) return;
    const el = bannerRef.current;
    const update = () => setBannerHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [showBanner]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'Articles', href: '/articles' },
    { label: 'Videos', href: '/videos' },
    { label: 'Tools', href: '/tools', locked: true },
    { label: 'Prompts', href: '/prompts', locked: true },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      {showBanner && (
        <motion.div
          ref={bannerRef}
          className="fixed top-0 left-0 right-0 z-[60] text-white overflow-hidden"
          style={{ background: 'linear-gradient(90deg, #055430 0%, #0a9650 50%, #067C40 100%)' }}
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-3 text-center relative">
            <span className="font-rubik text-sm sm:text-base font-medium">
              Join the Atrail community to unlock tools and prompts{' '}
              <Link to="/login" className="inline-flex items-center gap-1 underline font-bold hover:text-brand-100">
                Sign in free
              </Link>
            </span>
            <button
              onClick={() => { dismissBanner(); setBannerDismissed(true); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <X size={15} />
            </button>
          </div>
        </motion.div>
      )}
    <motion.header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-lg border-b border-zinc-100 dark:border-zinc-800/60'
          : 'bg-transparent'
      }`}
      style={{ top: showBanner ? bannerHeight : 0 }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
            <Link to="/" className="flex items-center gap-2">
              <img
                src={`${import.meta.env.BASE_URL}images/logo-green.png`}
                alt="Atrail"
                className="w-10 h-10 object-contain dark:hidden"
              />
              <img
                src={`${import.meta.env.BASE_URL}images/logo-white.png`}
                alt="Atrail"
                className="w-10 h-10 object-contain hidden dark:block"
              />
              <span className="font-rubik text-2xl font-bold text-brand-600 dark:text-white">Atrail</span>
            </Link>
          </motion.div>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.label} to={item.href} className="relative py-2 group">
                  <span
                    className={`font-rubik text-[0.95rem] font-medium tracking-wide transition-colors duration-200 inline-flex items-center gap-1.5 ${
                      isActive ? 'text-brand-600 dark:text-brand-400' : 'text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white'
                    }`}
                  >
                    {item.label}
                    {item.locked && !isAuthenticated && <Lock size={10} className="opacity-50" />}
                  </span>
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-brand-600 dark:bg-brand-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-zinc-300 dark:bg-zinc-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-brand-600 dark:hover:text-brand-400"
                >
                  <User size={16} /> Account
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-brand-600 dark:hover:text-brand-400"
                  >
                    <ShieldCheck size={16} /> Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-red-500"
                >
                  <LogOut size={16} /> Log out
                </button>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="btn-shine bg-brand-600 text-white px-6 py-2 rounded-full font-medium hover:bg-brand-700 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-1.5"
                >
                  Get Started
                </Link>
              </motion.div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="text-zinc-600 dark:text-zinc-300"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-zinc-900 dark:text-white hover:text-brand-600 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden relative z-10 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                    {item.locked && !isAuthenticated && <Lock size={11} className="opacity-60" />}
                  </Link>
                );
              })}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={16} /> Account
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShieldCheck size={16} /> Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="w-full bg-brand-600 text-white px-6 py-2 rounded-full font-medium hover:bg-brand-700 transition-all duration-200 mt-4 flex items-center justify-center gap-1.5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
    </>
  );
};

export default Header;
