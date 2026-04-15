import { motion } from 'motion/react';
import { Scan, History, Shield, TrendingUp, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router';

export function ConsumerDashboard() {
  const { user } = useAuth();

  const recentScans = [
    {
      id: '1',
      drugName: 'Artemether-Lumefantrine',
      batchId: 'AL2024-001',
      verified: true,
      date: '2026-04-14',
      time: '14:30',
    },
    {
      id: '2',
      drugName: 'Amoxicillin 500mg',
      batchId: 'AMX2024-089',
      verified: true,
      date: '2026-04-10',
      time: '09:15',
    },
    {
      id: '3',
      drugName: 'Paracetamol 500mg',
      batchId: 'PARA2024-156',
      verified: false,
      date: '2026-04-05',
      time: '16:45',
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-xl text-muted-foreground">
            Your medication verification dashboard
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to="/scan"
              className="block p-8 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white hover:shadow-2xl transition-all group"
            >
              <Scan className="size-12 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl mb-2">Scan Medication</h3>
              <p className="text-white/90">Verify a new drug batch</p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-2xl bg-white border border-border"
          >
            <History className="size-12 mb-4 text-secondary" />
            <h3 className="text-2xl mb-2">Scan History</h3>
            <div className="text-4xl text-secondary">{recentScans.length}</div>
            <p className="text-muted-foreground">Total scans</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-2xl bg-white border border-border"
          >
            <Shield className="size-12 mb-4 text-verified-green" />
            <h3 className="text-2xl mb-2">Verified</h3>
            <div className="text-4xl text-verified-green">
              {recentScans.filter(s => s.verified).length}
            </div>
            <p className="text-muted-foreground">Authentic drugs</p>
          </motion.div>
        </div>

        {/* Recent Scans */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-border p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">Recent Scans</h2>
            <button className="text-primary hover:underline text-sm">View all</button>
          </div>

          <div className="space-y-4">
            {recentScans.map((scan, index) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`size-12 rounded-xl flex items-center justify-center ${
                      scan.verified
                        ? 'bg-verified-green/10 text-verified-green'
                        : 'bg-error-red/10 text-error-red'
                    }`}
                  >
                    {scan.verified ? (
                      <CheckCircle2 className="size-6" />
                    ) : (
                      <XCircle className="size-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg mb-1">{scan.drugName}</h3>
                    <p className="text-sm text-muted-foreground">Batch: {scan.batchId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="size-4" />
                      {scan.time}
                    </div>
                    <div className="text-sm text-muted-foreground">{scan.date}</div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg text-sm ${
                      scan.verified
                        ? 'bg-verified-green/10 text-verified-green border border-verified-green/20'
                        : 'bg-error-red/10 text-error-red border border-error-red/20'
                    }`}
                  >
                    {scan.verified ? 'Verified' : 'Counterfeit'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-secondary/10 to-accent/10 border border-secondary/20"
        >
          <div className="flex items-start gap-4">
            <TrendingUp className="size-8 text-secondary flex-shrink-0" />
            <div>
              <h3 className="text-xl mb-2">Safety Tips</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Always verify medications before consumption</li>
                <li>• Check for tampered packaging or unusual appearance</li>
                <li>• Report suspicious medications immediately</li>
                <li>• Buy only from licensed pharmacies</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
