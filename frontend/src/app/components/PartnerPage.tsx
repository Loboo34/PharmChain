import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Briefcase, HeartHandshake, Shield, Sparkles, Users, Globe2 } from 'lucide-react';

export function PartnerPage() {
  return (
    <div className="min-h-full bg-background py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Briefcase className="size-5 text-primary" />
            <span className="text-sm text-primary">Partner With Us</span>
          </div>
          <h1 className="text-5xl font-semibold mb-6">Build trusted medication verification together</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Partner with Medify to deploy secure, blockchain-powered drug authentication across your organization.
            We help manufacturers, pharmacies, regulators, and health networks reduce counterfeits and improve patient safety.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl bg-white border border-border p-10 shadow-lg"
          >
            <div className="inline-flex items-center gap-3 mb-6 text-primary">
              <Shield className="size-5" />
              <h2 className="text-3xl font-semibold">Why partner with Medify?</h2>
            </div>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3 items-start">
                <HeartHandshake className="size-6 text-secondary mt-1" />
                <span>Access secure pharmaceutical verification tools tailored for African supply chains.</span>
              </li>
              <li className="flex gap-3 items-start">
                <Sparkles className="size-6 text-accent mt-1" />
                <span>Increase patient trust by providing verifiable medication authenticity at point of dispense.</span>
              </li>
              <li className="flex gap-3 items-start">
                <Globe2 className="size-6 text-primary mt-1" />
                <span>Leverage interoperable blockchain tracking for manufacturers, distributors, and regulators.</span>
              </li>
              <li className="flex gap-3 items-start">
                <Users className="size-6 text-secondary mt-1" />
                <span>Operate with a trusted partner experienced in healthcare, compliance, and secure technology.</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-3xl bg-white border border-border p-10 shadow-lg"
          >
            <div className="inline-flex items-center gap-3 mb-6 text-secondary">
              <Users className="size-5" />
              <h2 className="text-3xl font-semibold">Who should partner?</h2>
            </div>
            <div className="space-y-5 text-muted-foreground">
              <div>
                <h3 className="text-xl font-semibold mb-2">Manufacturers</h3>
                <p>Ensure every batch is trackable from production to pharmacy shelf using secure blockchain records.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Pharmacies</h3>
                <p>Offer patient-facing verification at the point of sale and reduce the risk of counterfeit distribution.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Regulators</h3>
                <p>Monitor drug movement, detect anomalies, and respond to counterfeit threats with real-time data.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-primary/10 border border-primary/20 p-10 mb-16"
        >
          <h2 className="text-3xl font-semibold mb-5">Partnership process</h2>
          <ol className="space-y-6 text-muted-foreground">
            <li>
              <span className="font-semibold text-foreground">1. Discovery</span> – We assess your current drug supply operations and identify integration opportunities.
            </li>
            <li>
              <span className="font-semibold text-foreground">2. Integration</span> – We connect your product batches to the Medify verification network and onboard your team.
            </li>
            <li>
              <span className="font-semibold text-foreground">3. Activation</span> – Your users can verify medication authenticity through secure batch and QR verification workflows.
            </li>
            <li>
              <span className="font-semibold text-foreground">4. Support</span> – We provide training, analytics, and ongoing verification support to keep your supply chain protected.
            </li>
          </ol>
        </motion.div>

        <div className="text-center">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-10 py-4 text-white text-lg shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
          >
            Get Started as a Partner
          </Link>
        </div>
      </div>
    </div>
  );
}
