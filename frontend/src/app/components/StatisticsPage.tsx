import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Globe2,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';

export function StatisticsPage() {
  return (
    <div className="min-h-full bg-background py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <BarChart3 className="size-4 text-primary" />
              <span className="text-sm text-primary">Live Statistics</span>
            </div>
            <h1 className="text-6xl mb-6 leading-tight">
              Impact in
              <br />
              <span className="text-secondary">Real Numbers</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Track our progress in the fight against counterfeit drugs across Africa
            </p>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: CheckCircle2,
                value: '2.3M+',
                label: 'Drugs Verified',
                trend: '+12.5%',
                trendUp: true,
                color: 'text-verified-green',
                bgColor: 'bg-verified-green/10',
              },
              {
                icon: AlertTriangle,
                value: '15,247',
                label: 'Fakes Detected',
                trend: '-8.2%',
                trendUp: false,
                color: 'text-error-red',
                bgColor: 'bg-error-red/10',
              },
              {
                icon: Globe2,
                value: '18',
                label: 'Countries',
                trend: '+3',
                trendUp: true,
                color: 'text-scan-blue',
                bgColor: 'bg-scan-blue/10',
              },
              {
                icon: Shield,
                value: '98.7%',
                label: 'Accuracy Rate',
                trend: '+0.3%',
                trendUp: true,
                color: 'text-primary',
                bgColor: 'bg-primary/10',
              },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-white border border-border hover:shadow-lg transition-all"
              >
                <div className={`size-12 rounded-xl ${metric.bgColor} flex items-center justify-center mb-6`}>
                  <metric.icon className={`size-6 ${metric.color}`} />
                </div>
                <div className="text-4xl mb-2">{metric.value}</div>
                <div className="text-sm text-muted-foreground mb-3">{metric.label}</div>
                <div className={`flex items-center gap-1 text-sm ${metric.trendUp ? 'text-verified-green' : 'text-error-red'}`}>
                  {metric.trendUp ? (
                    <TrendingUp className="size-4" />
                  ) : (
                    <TrendingDown className="size-4" />
                  )}
                  <span>{metric.trend} this month</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Monthly Verifications */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white border border-border"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl mb-2">Monthly Verifications</h3>
                  <p className="text-sm text-muted-foreground">Last 6 months</p>
                </div>
                <Activity className="size-6 text-primary" />
              </div>

              <div className="space-y-4">
                {[
                  { month: 'Nov 2025', value: 78, count: '312K' },
                  { month: 'Dec 2025', value: 85, count: '340K' },
                  { month: 'Jan 2026', value: 82, count: '328K' },
                  { month: 'Feb 2026', value: 92, count: '368K' },
                  { month: 'Mar 2026', value: 95, count: '380K' },
                  { month: 'Apr 2026', value: 100, count: '412K' },
                ].map((data, index) => (
                  <div key={data.month}>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-muted-foreground">{data.month}</span>
                      <span className="text-foreground">{data.count}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${data.value}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Detection Rate */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white border border-border"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl mb-2">Counterfeit Detection</h3>
                  <p className="text-sm text-muted-foreground">By drug category</p>
                </div>
                <PieChart className="size-6 text-secondary" />
              </div>

              <div className="space-y-6">
                {[
                  { category: 'Antimalarials', percentage: 38, count: '5,794', color: 'bg-error-red' },
                  { category: 'Antibiotics', percentage: 28, count: '4,269', color: 'bg-warning-amber' },
                  { category: 'Pain Relief', percentage: 18, count: '2,744', color: 'bg-secondary' },
                  { category: 'Other', percentage: 16, count: '2,440', color: 'bg-muted-foreground' },
                ].map((cat, index) => (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`size-3 rounded-full ${cat.color}`} />
                        <span className="text-sm">{cat.category}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{cat.count} detected</span>
                        <span className="text-sm min-w-12 text-right">{cat.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${cat.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={`h-full ${cat.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Geographic Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-white border border-border mb-16"
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl mb-2">Regional Coverage</h2>
                <p className="text-muted-foreground">Active verifications by country</p>
              </div>
              <Globe2 className="size-8 text-primary" />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { country: 'Nigeria', verifications: '847K', growth: '+15%', rank: 1 },
                { country: 'Kenya', verifications: '592K', growth: '+12%', rank: 2 },
                { country: 'Ghana', verifications: '428K', growth: '+18%', rank: 3 },
                { country: 'South Africa', verifications: '385K', growth: '+8%', rank: 4 },
                { country: 'Uganda', verifications: '312K', growth: '+22%', rank: 5 },
                { country: 'Tanzania', verifications: '287K', growth: '+14%', rank: 6 },
                { country: 'Ethiopia', verifications: '245K', growth: '+25%', rank: 7 },
                { country: 'Rwanda', verifications: '198K', growth: '+19%', rank: 8 },
                { country: 'Zambia', verifications: '156K', growth: '+11%', rank: 9 },
              ].map((country, index) => (
                <motion.div
                  key={country.country}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-lg mb-1">{country.country}</div>
                      <div className="text-2xl text-primary">{country.verifications}</div>
                    </div>
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm text-primary">#{country.rank}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-verified-green">
                    <TrendingUp className="size-4" />
                    <span>{country.growth}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Impact Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-white"
          >
            <h2 className="text-4xl mb-12 text-center">Real-World Impact</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  value: '$12.4M',
                  label: 'Worth of fake drugs intercepted',
                  description: 'Prevented from reaching patients',
                },
                {
                  value: '23,500+',
                  label: 'Lives potentially saved',
                  description: 'By preventing consumption of dangerous counterfeits',
                },
                {
                  value: '450+',
                  label: 'Pharmacies & hospitals',
                  description: 'Now using Medify',
                },
              ].map((impact, index) => (
                <motion.div
                  key={impact.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <div className="text-5xl mb-3">{impact.value}</div>
                  <div className="text-xl mb-2">{impact.label}</div>
                  <div className="text-sm text-white/80">{impact.description}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
