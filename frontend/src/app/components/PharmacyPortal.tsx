import { motion } from 'motion/react';
import { Pill, CheckCircle2, AlertTriangle, Package, Scan, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function PharmacyPortal() {
  const { user } = useAuth();

  const inventory = [
    {
      id: 'AL2024-001',
      drugName: 'Artemether-Lumefantrine',
      stock: 450,
      verified: true,
      lastChecked: '2026-04-14',
      expiryDate: '2027-12-31',
    },
    {
      id: 'AMX2024-089',
      drugName: 'Amoxicillin 500mg',
      stock: 820,
      verified: true,
      lastChecked: '2026-04-13',
      expiryDate: '2027-08-15',
    },
    {
      id: 'PARA2024-156',
      drugName: 'Paracetamol 500mg',
      stock: 1200,
      verified: false,
      lastChecked: '2026-04-12',
      expiryDate: '2027-06-20',
      alert: 'Verification failed',
    },
  ];

  const recentDispensed = [
    { id: '1', drugName: 'Artemether-Lumefantrine', quantity: 2, time: '2 hours ago' },
    { id: '2', drugName: 'Amoxicillin 500mg', quantity: 1, time: '3 hours ago' },
    { id: '3', drugName: 'Paracetamol 500mg', quantity: 3, time: '5 hours ago' },
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
          <h1 className="text-4xl mb-2">Pharmacy Portal</h1>
          <p className="text-xl text-muted-foreground">{user?.organization}</p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-white border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <Package className="size-10 text-primary" />
            </div>
            <div className="text-3xl mb-1">{inventory.length}</div>
            <div className="text-sm text-muted-foreground">Drug Types in Stock</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className="size-10 text-verified-green" />
            </div>
            <div className="text-3xl mb-1">
              {inventory.filter(i => i.verified).length}
            </div>
            <div className="text-sm text-muted-foreground">Verified Products</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <Pill className="size-10 text-secondary" />
              <TrendingUp className="size-5 text-verified-green" />
            </div>
            <div className="text-3xl mb-1">147</div>
            <div className="text-sm text-muted-foreground">Dispensed Today</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-white border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="size-10 text-warning-amber" />
            </div>
            <div className="text-3xl mb-1">
              {inventory.filter(i => !i.verified).length}
            </div>
            <div className="text-sm text-muted-foreground">Alerts</div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white hover:shadow-2xl transition-all text-left"
          >
            <Scan className="size-12 mb-4" />
            <h3 className="text-2xl mb-2">Verify Incoming Stock</h3>
            <p className="text-white/90">Scan to verify new deliveries</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="p-8 rounded-2xl bg-white border border-border hover:border-primary/30 transition-all text-left"
          >
            <Pill className="size-12 mb-4 text-secondary" />
            <h3 className="text-2xl mb-2">Log Dispensed</h3>
            <p className="text-muted-foreground">Record patient medication</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="p-8 rounded-2xl bg-white border border-border hover:border-primary/30 transition-all text-left"
          >
            <AlertTriangle className="size-12 mb-4 text-warning-amber" />
            <h3 className="text-2xl mb-2">Report Suspicious</h3>
            <p className="text-muted-foreground">Alert regulators</p>
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Inventory */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-border overflow-hidden"
          >
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl">Current Inventory</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">Batch ID</th>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">Drug Name</th>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">Stock</th>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">Status</th>
                    <th className="text-left px-6 py-4 text-sm text-muted-foreground">Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-background transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm">{item.id}</div>
                      </td>
                      <td className="px-6 py-4">{item.drugName}</td>
                      <td className="px-6 py-4">
                        <span className={item.stock < 100 ? 'text-warning-amber' : ''}>
                          {item.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.verified ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-verified-green" />
                            <span className="text-sm text-verified-green">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="size-4 text-error-red" />
                            <span className="text-sm text-error-red">{item.alert}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{item.expiryDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl border border-border p-6"
          >
            <h2 className="text-2xl mb-6">Recent Dispensed</h2>
            <div className="space-y-4">
              {recentDispensed.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm">{item.drugName}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" />
                      {item.time}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full py-3 rounded-xl bg-background hover:bg-muted transition-all text-sm">
              View All Activity
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
