import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ClipboardList, Sparkles, Shield, Globe2, Building, Heart } from 'lucide-react';

export function CaseStudyPage() {
  return (
    <div className="min-h-full bg-background py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
            <ClipboardList className="size-5 text-secondary" />
            <span className="text-sm text-secondary">Case Studies</span>
          </div>
          <h1 className="text-5xl font-semibold mb-6">Real-world impact from verified medicines</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            See how Medify has helped healthcare providers and regulators stop counterfeit drugs and improve patient safety with accountable verification workflows.
          </p>
        </motion.div>

        <div className="grid gap-10 mb-16">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl bg-white border border-border p-10 shadow-lg"
          >
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Building className="size-8 text-primary" />
              <div>
                <h2 className="text-3xl font-semibold">Case Study: Pharmacy Chain Rollout</h2>
                <p className="text-muted-foreground">A leading retail pharmacy deployed Medify verification to protect customers and support compliance.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
              <div>
                <p className="mb-4">The pharmacy chain integrated Medify across 120 stores, enabling pharmacists to verify batch authenticity at checkout and educate customers on secure medication handling.</p>
                <ul className="space-y-3">
                  <li className="flex gap-3 items-start">
                    <Sparkles className="size-5 text-accent mt-1" />
                    <span>40% reduction in counterfeit product returns within 3 months.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Shield className="size-5 text-primary mt-1" />
                    <span>At least 18 pharmacy staff trained on verification workflow per location.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Globe2 className="size-5 text-secondary mt-1" />
                    <span>Improved patient confidence through clear medication transparency messaging.</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-3xl bg-primary/10 border border-primary/20 p-8">
                <div className="text-2xl font-semibold text-primary mb-4">Key Outcomes</div>
                <div className="space-y-4 text-sm text-foreground/90">
                  <div>• Faster verification at the point of sale</div>
                  <div>• Streamlined reporting for suspected counterfeits</div>
                  <div>• Customer-facing QR scan feature launched in weeks</div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-3xl bg-white border border-border p-10 shadow-lg"
          >
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Heart className="size-8 text-secondary" />
              <div>
                <h2 className="text-3xl font-semibold">Case Study: National Regulator Pilot</h2>
                <p className="text-muted-foreground">A national drug authority used Medify to audit supply lines and improve counterfeit response coordination.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
              <div>
                <p className="mb-4">The regulator piloted Medify in high-risk districts, using verifiable batch records to detect suspicious shipments and prioritize inspections.</p>
                <ul className="space-y-3">
                  <li className="flex gap-3 items-start">
                    <Shield className="size-5 text-primary mt-1" />
                    <span>Enabled 24/7 monitoring of critical drug shipments.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Sparkles className="size-5 text-accent mt-1" />
                    <span>Reduced counterfeit alerts response time by over 50%.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Globe2 className="size-5 text-secondary mt-1" />
                    <span>Improved cross-border traceability for high-risk pharmaceuticals.</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-3xl bg-secondary/10 border border-secondary/20 p-8">
                <div className="text-2xl font-semibold text-secondary mb-4">Pilot Highlights</div>
                <div className="space-y-4 text-sm text-foreground/90">
                  <div>• Real-time fraud detection dashboards</div>
                  <div>• Verified supply chain records for 3 major manufacturers</div>
                  <div>• Actionable alerts integrated with inspection workflows</div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        <div className="text-center">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-secondary px-10 py-4 text-white text-lg shadow-lg shadow-secondary/30 hover:shadow-xl transition-all"
          >
            Request Your Case Study Brief
          </Link>
        </div>
      </div>
    </div>
  );
}
