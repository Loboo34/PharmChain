import { motion } from 'motion/react';
import {
  Scan,
  Database,
  Shield,
  TrendingUp,
  CheckCircle2,
  Package,
  Smartphone,
  Cloud,
  Lock,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router';

export function HowItWorksPage() {
  return (
    <div className="min-h-full bg-background py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-100 border border-blue-200 mb-6">
              <Scan className="size-4 text-blue-600" />
              <span className="text-sm text-blue-600">How It Works</span>
            </div>
            <h1 className="text-6xl mb-6 leading-tight">
              Verify Medications in
              <br />
              <span className="text-primary">3 Simple Steps</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Medify combines blockchain technology and artificial intelligence to provide
              instant, reliable drug authentication.
            </p>
          </motion.div>

          {/* User Journey */}
          <div className="mb-24">
            <h2 className="text-4xl mb-12 text-center">For Patients</h2>
            <div className="space-y-16">
              {[
                {
                  step: '01',
                  icon: Scan,
                  title: 'Scan the QR Code',
                  description:
                    'Open Medify on your smartphone and scan the QR code printed on your medication packaging. No special equipment needed.',
                  details: [
                    'Works with any smartphone camera',
                    'Instant recognition',
                    'Can also enter batch ID manually',
                    'Offline scanning available',
                  ],
                  color: 'from-blue-500 to-blue-700',
                },
                {
                  step: '02',
                  icon: Database,
                  title: 'Blockchain Verification',
                  description:
                    'Our system checks the medication against our blockchain ledger, verifying its complete supply chain journey from manufacturer to your hands.',
                  details: [
                    'Immutable record verification',
                    'Complete supply chain visibility',
                    'Manufacturer authentication',
                    'Real-time status updates',
                  ],
                  color: 'from-primary to-primary/70',
                },
                {
                  step: '03',
                  icon: CheckCircle2,
                  title: 'Get Instant Results',
                  description:
                    'Receive immediate confirmation of authenticity, along with detailed information about the drug, its journey, and AI-powered safety analysis.',
                  details: [
                    'Authenticity verdict',
                    'Supply chain visualization',
                    'AI confidence score',
                    'Safety recommendations',
                  ],
                  color: 'from-emerald-600 to-emerald-400',
                },
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {index % 2 === 0 ? (
                      <>
                        <motion.div
                          className={`p-12 rounded-3xl bg-gradient-to-br ${step.color} text-white shadow-2xl border border-white/10 min-h-[220px]`}
                          initial={{ opacity: 0, y: 24 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.02, y: -4 }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          viewport={{ once: true }}
                        >
                          <step.icon className="size-16 mb-6 opacity-90" />
                          <div className="text-6xl mb-2 opacity-60">{step.step}</div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                          viewport={{ once: true }}
                        >
                          <h3 className="text-3xl mb-4 text-foreground">{step.title}</h3>
                          <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                            {step.description}
                          </p>
                          <ul className="space-y-3">
                            {step.details.map((detail) => (
                              <li key={detail} className="flex items-center gap-3">
                                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle2 className="size-4 text-primary" />
                                </div>
                                <span className="text-foreground/70">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <motion.div
                          className="order-2 md:order-1"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                          viewport={{ once: true }}
                        >
                          <h3 className="text-3xl mb-4 text-foreground">{step.title}</h3>
                          <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                            {step.description}
                          </p>
                          <ul className="space-y-3">
                            {step.details.map((detail) => (
                              <li key={detail} className="flex items-center gap-3">
                                <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle2 className="size-4 text-primary" />
                                </div>
                                <span className="text-foreground/70">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                        <motion.div
                          className={`p-12 rounded-3xl bg-gradient-to-br ${step.color} text-white order-1 md:order-2 shadow-2xl border border-white/10 min-h-[220px]`}
                          initial={{ opacity: 0, y: 24 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.02, y: -4 }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          viewport={{ once: true }}
                        >
                          <step.icon className="size-16 mb-6 opacity-90" />
                          <div className="text-6xl mb-2 opacity-30">{step.step}</div>
                        </motion.div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className="text-4xl mb-8 text-center">Powered by Advanced Technology</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Blockchain Ledger',
                  description:
                    'Distributed, immutable record of every medication batch and its supply chain journey.',
                  features: ['Tamper-proof records', 'Decentralized verification', 'Full transparency'],
                },
                {
                  icon: TrendingUp,
                  title: 'AI Analysis',
                  description:
                    'Machine learning models trained on millions of data points to detect counterfeit patterns.',
                  features: ['Pattern recognition', 'Anomaly detection', 'Continuous learning'],
                },
                {
                  icon: Cloud,
                  title: 'Cloud Infrastructure',
                  description:
                    'Scalable, reliable platform that can serve millions of verification requests daily.',
                  features: ['99.9% uptime', 'Global CDN', 'Instant response'],
                },
              ].map((tech, index) => (
                <motion.div
                  key={tech.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-white border border-border"
                >
                  <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <tech.icon className="size-7 text-primary" />
                  </div>
                  <h3 className="text-2xl mb-3">{tech.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{tech.description}</p>
                  <ul className="space-y-2">
                    {tech.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="size-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* For Manufacturers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="p-12 rounded-3xl bg-gradient-to-br from-secondary to-secondary/80 text-white">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl mb-6">For Manufacturers & Distributors</h2>
                  <p className="text-xl text-white/90 mb-8 leading-relaxed">
                    Protect your brand, comply with regulations, and build trust with patients by
                    registering your products on Medify.
                  </p>
                  <ul className="space-y-4">
                    {[
                      'Easy integration with existing production lines',
                      'Batch registration and QR code generation',
                      'Real-time distribution tracking',
                      'Counterfeit alerts and analytics',
                      'Regulatory compliance reports',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 className="size-6 flex-shrink-0 mt-0.5" />
                        <span className="text-lg text-white/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Package, label: 'Product Registry' },
                    { icon: Lock, label: 'Secure API' },
                    { icon: Smartphone, label: 'Mobile Dashboard' },
                    { icon: Zap, label: 'Real-time Alerts' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                    >
                      <item.icon className="size-8 mb-3" />
                      <div className="text-sm">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl mb-6">Ready to Try It?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Experience the future of drug verification
            </p>
            <Link
              to="/scan"
              className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-primary text-white text-lg hover:shadow-2xl transition-all"
            >
              <Scan className="size-5" />
              <span>Start Scanning Now</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
