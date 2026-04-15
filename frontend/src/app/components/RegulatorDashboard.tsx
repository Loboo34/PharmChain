import { motion } from 'motion/react';
import { Shield, AlertTriangle, TrendingUp, BarChart3, MapPin, FileText, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function RegulatorDashboard() {
  const { user } = useAuth();

  const alerts = [
    {
      id: '1',
      type: 'critical',
      title: 'Counterfeit Batch Detected',
      description: 'Batch PARA2024-156 flagged in 5 pharmacies across Lagos',
      location: 'Lagos, Nigeria',
      timestamp: '2 hours ago',
      status: 'investigating',
    },
    {
      id: '2',
      type: 'warning',
      title: 'Supply Chain Anomaly',
      description: 'Unusual distribution pattern for batch AMX2024-089',
      location: 'Nairobi, Kenya',
      timestamp: '5 hours ago',
      status: 'pending',
    },
    {
      id: '3',
      type: 'info',
      title: 'New Manufacturer Registration',
      description: 'PharmaTech Industries submitted registration documents',
      location: 'Accra, Ghana',
      timestamp: '1 day ago',
      status: 'review',
    },
  ];

  const statistics = [
    { region: 'West Africa', verifications: 124500, counterfeits: 4523, rate: '3.6%' },
    { region: 'East Africa', verifications: 98200, counterfeits: 3891, rate: '4.0%' },
    { region: 'Southern Africa', verifications: 76800, counterfeits: 2145, rate: '2.8%' },
    { region: 'Central Africa', verifications: 45300, counterfeits: 1688, rate: '3.7%' },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl mb-2">Regulator Dashboard</h1>
          <p className="text-xl text-muted-foreground">{user?.organization}</p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-white border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <Shield className="size-10 text-primary" />
              <TrendingUp className="size-5 text-verified-green" />
            </div>
            <div className="text-3xl mb-1">2.3M+</div>
            <div className="text-sm text-muted-foreground">Total Verifications</div>
            <div className="text-xs text-verified-green mt-2">+12.5% this month</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="size-10 text-error-red" />
            </div>
            <div className="text-3xl mb-1">15,247</div>
            <div className="text-sm text-muted-foreground">Counterfeits Detected</div>
            <div className="text-xs text-verified-green mt-2">-8.2% this month</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="size-10 text-secondary" />
            </div>
            <div className="text-3xl mb-1">98.7%</div>
            <div className="text-sm text-muted-foreground">Detection Accuracy</div>
            <div className="text-xs text-verified-green mt-2">+0.3% this month</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-warning-amber to-warning-amber/80 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="size-10" />
            </div>
            <div className="text-3xl mb-1">12</div>
            <div className="text-sm text-white/90">Active Alerts</div>
            <button className="text-xs text-white/90 hover:text-white mt-2">
              Review Now →
            </button>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl bg-white border border-border hover:border-primary/30 transition-all text-left flex items-center gap-4"
          >
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg mb-1">Generate Report</h3>
              <p className="text-sm text-muted-foreground">Monthly compliance report</p>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-2xl bg-white border border-border hover:border-primary/30 transition-all text-left flex items-center gap-4"
          >
            <div className="size-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="size-6 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg mb-1">Regional Analysis</h3>
              <p className="text-sm text-muted-foreground">View geographic data</p>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="p-6 rounded-2xl bg-white border border-border hover:border-primary/30 transition-all text-left flex items-center gap-4"
          >
            <div className="size-12 rounded-xl bg-warning-amber/10 flex items-center justify-center flex-shrink-0">
              <Download className="size-6 text-warning-amber" />
            </div>
            <div>
              <h3 className="text-lg mb-1">Export Data</h3>
              <p className="text-sm text-muted-foreground">Download audit trail</p>
            </div>
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-border overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl">Active Alerts</h2>
              <button className="text-sm text-primary hover:underline">View All</button>
            </div>

            <div className="p-6 space-y-4">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`size-10 rounded-xl flex items-center justify-center ${
                          alert.type === 'critical'
                            ? 'bg-error-red/10 text-error-red'
                            : alert.type === 'warning'
                            ? 'bg-warning-amber/10 text-warning-amber'
                            : 'bg-scan-blue/10 text-scan-blue'
                        }`}
                      >
                        <AlertTriangle className="size-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg mb-1">{alert.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            {alert.location}
                          </div>
                          <div>{alert.timestamp}</div>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs ${
                        alert.status === 'investigating'
                          ? 'bg-warning-amber/10 text-warning-amber border border-warning-amber/20'
                          : alert.status === 'pending'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-scan-blue/10 text-scan-blue border border-scan-blue/20'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:shadow-lg transition-all">
                      Investigate
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-background hover:bg-muted text-sm transition-all">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Regional Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-white rounded-2xl border border-border p-6"
          >
            <h2 className="text-2xl mb-6">Regional Overview</h2>
            <div className="space-y-6">
              {statistics.map((stat, index) => (
                <div key={stat.region} className="pb-6 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg mb-1">{stat.region}</h3>
                      <p className="text-sm text-muted-foreground">
                        {stat.verifications.toLocaleString()} verifications
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-lg text-sm ${
                        parseFloat(stat.rate) < 3
                          ? 'bg-verified-green/10 text-verified-green'
                          : parseFloat(stat.rate) < 4
                          ? 'bg-warning-amber/10 text-warning-amber'
                          : 'bg-error-red/10 text-error-red'
                      }`}
                    >
                      {stat.rate}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{stat.counterfeits.toLocaleString()} counterfeits</span>
                    <button className="text-primary hover:underline">Details</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
