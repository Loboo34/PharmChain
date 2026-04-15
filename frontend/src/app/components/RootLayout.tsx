import { Outlet, Link, useLocation } from 'react-router';
import { Shield, Menu, X, LogOut, User } from 'lucide-react';
import { DrugDataProvider } from '../contexts/DrugDataContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { AIAssistant } from './AIAssistant';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function LayoutContent() {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const navLinks = [
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/statistics', label: 'Statistics' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      <div className="size-full overflow-auto bg-background">
        {/* Header - only show on non-home and non-auth pages */}
        {!isHomePage && !isAuthPage && (
          <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 group">
                  <div className="size-11 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Shield className="size-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl tracking-tight text-primary">Medify</h1>
                    <p className="text-xs text-muted-foreground">Blockchain Authentication</p>
                  </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`px-4 py-2.5 rounded-full transition-all ${
                        location.pathname === link.to
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-background text-foreground/70 hover:text-foreground'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        className={`px-4 py-2.5 rounded-full transition-all ${
                          location.pathname === '/dashboard'
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-background text-foreground/70 hover:text-foreground'
                        }`}
                      >
                        Dashboard
                      </Link>
                      <div className="flex items-center gap-2 ml-2 px-4 py-2.5 rounded-full bg-background">
                        <User className="size-4" />
                        <span className="text-sm">{user?.name}</span>
                      </div>
                      <button
                        onClick={logout}
                        className="px-4 py-2.5 rounded-full hover:bg-error-red/10 text-error-red transition-all flex items-center gap-2"
                      >
                        <LogOut className="size-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/scan"
                        className="px-6 py-2.5 rounded-full bg-primary text-white hover:shadow-lg transition-all ml-2"
                      >
                        Scan Now
                      </Link>
                      <Link
                        to="/login"
                        className="px-4 py-2.5 rounded-full hover:bg-background transition-all"
                      >
                        Login
                      </Link>
                    </>
                  )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden size-10 rounded-xl bg-background hover:bg-muted transition-colors flex items-center justify-center"
                >
                  {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
              </div>

              {/* Mobile Navigation */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.nav
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden overflow-hidden"
                  >
                    <div className="pt-4 pb-2 space-y-2">
                      {navLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-4 py-3 rounded-xl transition-all ${
                            location.pathname === link.to
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-background text-foreground/70 hover:text-foreground'
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}

                      {isAuthenticated ? (
                        <>
                          <Link
                            to="/dashboard"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-xl bg-primary text-white"
                          >
                            Dashboard
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setMobileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-error-red/10 text-error-red"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/scan"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-xl bg-primary text-white"
                          >
                            Scan Now
                          </Link>
                          <Link
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-xl hover:bg-background"
                          >
                            Login
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.nav>
                )}
              </AnimatePresence>
            </div>
          </header>
        )}

        <Outlet />
      </div>

      {/* AI Assistant - show on all pages except auth pages */}
      {!isAuthPage && <AIAssistant />}
    </>
  );
}

export function RootLayout() {
  return (
    <AuthProvider>
      <DrugDataProvider>
        <LayoutContent />
      </DrugDataProvider>
    </AuthProvider>
  );
}