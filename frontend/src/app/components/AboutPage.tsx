import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Shield, Users, Globe2, Target, Award, Heart } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-full bg-background py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Shield className="size-4 text-primary" />
              <span className="text-sm text-primary">About Medify</span>
            </div>
            <h1 className="text-6xl mb-6 leading-tight">
              Building Trust in
              <br />
              <span className="text-secondary">African Healthcare</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're on a mission to eliminate counterfeit drugs and protect communities across
              Africa through blockchain technology and artificial intelligence.
            </p>
          </motion.div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-10 rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-white"
            >
              <Target className="size-12 mb-6 opacity-90" />
              <h2 className="text-3xl mb-4">Our Mission</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                To provide accessible, reliable drug verification tools that empower patients,
                healthcare providers, and regulators to identify and eliminate counterfeit medications
                from the supply chain.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-10 rounded-3xl bg-gradient-to-br from-secondary to-secondary/80 text-white"
            >
              <Globe2 className="size-12 mb-6 opacity-90" />
              <h2 className="text-3xl mb-4">Our Vision</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                A future where every medication in Africa is verifiable, traceable, and authentic.
                Where patients can trust their medicines and counterfeit drugs are a thing of the past.
              </p>
            </motion.div>
          </div>

          {/* The Problem */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="p-12 rounded-3xl bg-white border border-border">
              <h2 className="text-4xl mb-6">The Crisis We're Solving</h2>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="p-6 rounded-2xl bg-error-red/10 border border-error-red/20">
                  <div className="text-4xl text-error-red mb-2">42%</div>
                  <p className="text-muted-foreground">
                    of antimalarials in sub-Saharan Africa are estimated to be substandard or fake
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-warning-amber/10 border border-warning-amber/20">
                  <div className="text-4xl text-warning-amber mb-2">$200B</div>
                  <p className="text-muted-foreground">
                    annual economic impact of counterfeit drugs globally
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-error-red/10 border border-error-red/20">
                  <div className="text-4xl text-error-red mb-2">169K</div>
                  <p className="text-muted-foreground">
                    children die annually from fake pneumonia medications in Africa alone
                  </p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Counterfeit and substandard medications are a silent epidemic. They undermine trust in
                healthcare systems, waste scarce resources, and most tragically, cost lives. Traditional
                verification methods are expensive, slow, and often inaccessible to those who need them most.
              </p>
            </div>
          </motion.div>

          {/* Our Solution */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-4xl mb-8 text-center">How Medify Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Blockchain Security',
                  description:
                    'Every medication is registered on an immutable blockchain ledger, creating a permanent, tamper-proof record of its entire journey.',
                  color: 'text-primary',
                  bgColor: 'bg-primary/10',
                },
                {
                  icon: Users,
                  title: 'AI Detection',
                  description:
                    'Machine learning algorithms analyze patterns, detect anomalies, and flag suspicious distribution routes in real-time.',
                  color: 'text-secondary',
                  bgColor: 'bg-secondary/10',
                },
                {
                  icon: Heart,
                  title: 'Instant Access',
                  description:
                    'Anyone with a smartphone can verify medication authenticity in seconds, putting the power of verification in patients\' hands.',
                  color: 'text-accent',
                  bgColor: 'bg-accent/10',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-white border border-border hover:border-primary/20 transition-all"
                >
                  <div className={`size-14 rounded-xl ${item.bgColor} flex items-center justify-center mb-6`}>
                    <item.icon className={`size-7 ${item.color}`} />
                  </div>
                  <h3 className="text-2xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-4xl mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Trust & Transparency',
                  description:
                    'We believe in open systems. Our blockchain is transparent, and our AI models are explainable.',
                },
                {
                  icon: Award,
                  title: 'Accessibility First',
                  description:
                    'Healthcare is a right. Our tools are free for patients and designed to work on any smartphone.',
                },
                {
                  icon: Users,
                  title: 'Community Partnership',
                  description:
                    'We work with local healthcare workers, pharmacies, and governments to build trust from the ground up.',
                },
                {
                  icon: Globe2,
                  title: 'Innovation for Impact',
                  description:
                    'Technology is our tool, but saving lives is our measure of success. Every feature serves that goal.',
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-background border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <value.icon className="size-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl mb-2">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-white"
          >
            <h2 className="text-4xl mb-4">Join Us in This Mission</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Whether you're a patient, healthcare provider, pharmacy, or regulator, you have a role to play
              in eliminating counterfeit drugs.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/partner"
                className="px-8 py-4 rounded-2xl bg-white text-primary hover:shadow-xl transition-all text-lg"
              >
                Partner With Us
              </Link>
              <Link
                to="/case-studies"
                className="px-8 py-4 rounded-2xl bg-white/10 border-2 border-white/30 hover:bg-white/20 transition-all text-lg"
              >
                Read Case Studies
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
