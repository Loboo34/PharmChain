import { Shield, Scan, TrendingUp, CheckCircle2, AlertTriangle, Globe, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';

export function HomePage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/statistics', label: 'Statistics' },
    { to: '/about', label: 'About' },
  ];
  return (
    <div className="min-h-full relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #0A5C5C 0, #0A5C5C 2px, transparent 2px, transparent 16px),
                           repeating-linear-gradient(-45deg, #D4743C 0, #D4743C 2px, transparent 2px, transparent 16px)`
        }} />
      </div>

      <div className="relative">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-6 py-8"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Shield className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl tracking-tight text-primary">Medify</h1>
                <p className="text-xs text-muted-foreground">Blockchain Drug Authentication</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2.5 rounded-full hover:bg-white/50 transition-all text-sm"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/scan"
                className="px-6 py-2.5 rounded-full bg-white border border-border hover:border-primary/30 transition-all text-sm ml-2"
              >
                Scan Now
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden size-10 rounded-xl bg-white border border-border hover:border-primary/30 transition-colors flex items-center justify-center"
            >
              <Menu className="size-5" />
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="md:hidden overflow-hidden mt-4"
            >
              <div className="space-y-2 p-4 bg-white rounded-2xl border border-border">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block px-4 py-3 rounded-xl hover:bg-background transition-all text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/scan"
                  className="block px-4 py-3 rounded-xl bg-primary text-white text-center text-sm"
                >
                  Scan Now
                </Link>
              </div>
            </motion.nav>
          )}
        </motion.header>

        {/* Hero Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <div className="size-2 rounded-full bg-verified-green animate-pulse" />
                <span className="text-sm text-primary">Powered by AI & Blockchain</span>
              </div>

              <h2 className="text-6xl mb-6 leading-[1.1] tracking-tight">
                Fight Fake Drugs,
                <br />
                <span className="text-secondary">Save Lives</span>
              </h2>

              <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
                Scan any medication to verify its authenticity, trace its complete supply chain journey,
                and protect yourself from counterfeit pharmaceuticals.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/scan')}
                  className="px-8 py-4 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all flex items-center gap-3 group"
                >
                  <Scan className="size-5" />
                  <span className="text-lg">Start Verification</span>
                </motion.button>

                <Link
                  to="/login"
                  className="px-8 py-4 rounded-2xl bg-white border border-border hover:border-primary/30 transition-all text-lg"
                >
                  Login
                </Link>

                <Link
                  to="/about"
                  className="px-8 py-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all text-lg"
                >
                  Learn More
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-border">
                <div className="rounded-3xl p-6 bg-background border border-border">
                  <h3 className="text-lg font-semibold mb-2">Blockchain Audit</h3>
                  <p className="text-sm text-muted-foreground">
                    Immutable trace records ensure every medication batch is verifiable end-to-end.
                  </p>
                </div>
                <div className="rounded-3xl p-6 bg-background border border-border">
                  <h3 className="text-lg font-semibold mb-2">AI Risk Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced analytics identify anomalies in the supply chain before they reach patients.
                  </p>
                </div>
                <div className="rounded-3xl p-6 bg-background border border-border">
                  <h3 className="text-lg font-semibold mb-2">Verified Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Secure user accounts are required for verified scans and audit trail access.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Visual Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative"
            >
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-border">
                <div className="absolute -top-6 -right-6 size-32 rounded-full bg-gradient-to-br from-accent to-secondary opacity-20 blur-3xl" />
                <div className="absolute -bottom-6 -left-6 size-32 rounded-full bg-gradient-to-br from-primary to-primary/50 opacity-20 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Shield className="size-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Secure Verification</div>
                      <div className="text-lg font-semibold">Professional medication authentication</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-background/50 border border-border">
                      <div className="text-sm text-muted-foreground mb-1">Blockchain Traceability</div>
                      <div className="text-base">Audit every medication batch with secure end-to-end tracking.</div>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 border border-border">
                      <div className="text-sm text-muted-foreground mb-1">Regulatory Confidence</div>
                      <div className="text-base">Enable compliance with trusted drug verification workflows.</div>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 border border-border">
                      <div className="text-sm text-muted-foreground mb-1">Actionable Alerts</div>
                      <div className="text-base">Receive clear guidance when a batch cannot be validated.</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-20 border-t border-border">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h3 className="text-5xl mb-4">How It Works</h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Advanced blockchain and AI technology working together to ensure medication safety
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Scan,
                  title: 'Scan QR Code',
                  description: 'Simply scan the QR code on your medication packaging using your phone camera',
                  color: 'text-scan-blue',
                  bgColor: 'bg-scan-blue/10'
                },
                {
                  icon: Shield,
                  title: 'Blockchain Verification',
                  description: 'Our system checks the entire supply chain recorded on the blockchain for authenticity',
                  color: 'text-primary',
                  bgColor: 'bg-primary/10'
                },
                {
                  icon: TrendingUp,
                  title: 'AI Anomaly Detection',
                  description: 'Advanced AI algorithms detect suspicious patterns and flag potential counterfeits',
                  color: 'text-secondary',
                  bgColor: 'bg-secondary/10'
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-white border border-border hover:border-primary/20 transition-all hover:shadow-lg group"
                >
                  <div className={`size-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`size-8 ${feature.color}`} />
                  </div>
                  <h4 className="text-2xl mb-3">{feature.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Impact Section */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 mb-6">
                  <Globe className="size-4" />
                  <span className="text-sm">Global Impact</span>
                </div>
                <h3 className="text-5xl mb-6 leading-tight">
                  Protecting Communities Across Africa
                </h3>
                <p className="text-xl text-white/90 leading-relaxed mb-6">
                  Counterfeit drugs pose a critical health threat across the continent.
                  Our blockchain-powered verification system is helping save lives by ensuring
                  medication authenticity.
                </p>
                <div className="flex gap-3">
                  <button
                  onClick={() => navigate('/partner')}
                  className="px-6 py-3 rounded-xl bg-white text-primary hover:shadow-lg transition-all"
                >
                  Partner With Us
                </button>
                <button
                  onClick={() => navigate('/case-studies')}
                  className="px-6 py-3 rounded-xl bg-white/10 border border-white/30 hover:bg-white/20 transition-all"
                >
                  Read Case Studies
                </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: AlertTriangle, stat: '42%', label: 'Of drugs in developing countries may be substandard or fake' },
                  { icon: Shield, stat: '169K', label: 'Deaths annually from fake medicines in Africa' },
                  { icon: CheckCircle2, stat: '24/7', label: 'Real-time verification available' },
                  { icon: Globe, stat: '18', label: 'Countries currently protected' }
                ].map((item) => (
                  <div key={item.label} className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <item.icon className="size-8 mb-4 text-accent" />
                    <div className="text-3xl mb-2">{item.stat}</div>
                    <div className="text-sm text-white/80 leading-snug">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-5xl mb-6">Ready to Verify Your Medication?</h3>
              <p className="text-xl text-muted-foreground mb-8">
                Start protecting yourself and your loved ones today
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/scan')}
                className="px-12 py-5 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-white text-lg shadow-2xl shadow-primary/30 hover:shadow-3xl transition-all"
              >
                Scan Medication Now
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}