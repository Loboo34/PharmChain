import { motion } from 'motion/react';
import { Package, Plus, TrendingUp, AlertTriangle, QrCode, Factory, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export function ManufacturerDashboard() {
  const { user } = useAuth();
  const [showNewBatchForm, setShowNewBatchForm] = useState(false);

  const batches = [
    {
      id: 'AL2024-001',
      drugName: 'Artemether-Lumefantrine 20/120mg',
      quantity: 50000,
      status: 'active',
      registered: '2026-04-01',
      distributed: 42000,
    },
    {
      id: 'AMX2024-089',
      drugName: 'Amoxicillin 500mg',
      quantity: 100000,
      status: 'active',
      registered: '2026-03-15',
      distributed: 87500,
    },
    {
      id: 'PARA2024-156',
      drugName: 'Paracetamol 500mg',
      quantity: 200000,
      status: 'completed',
      registered: '2026-02-20',
      distributed: 200000,
    },
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
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl mb-2">Manufacturer Portal</h1>
              <p className="text-xl text-muted-foreground">{user?.organization}</p>
            </div>
            <button
              onClick={() => setShowNewBatchForm(!showNewBatchForm)}
              className="px-6 py-3 rounded-xl bg-primary text-white hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="size-5" />
              <span>Register New Batch</span>
            </button>
          </div>
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
              <TrendingUp className="size-5 text-verified-green" />
            </div>
            <div className="text-3xl mb-1">12</div>
            <div className="text-sm text-muted-foreground">Active Batches</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <Factory className="size-10 text-secondary" />
              <TrendingUp className="size-5 text-verified-green" />
            </div>
            <div className="text-3xl mb-1">350K</div>
            <div className="text-sm text-muted-foreground">Units Produced</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <QrCode className="size-10 text-scan-blue" />
              <TrendingUp className="size-5 text-verified-green" />
            </div>
            <div className="text-3xl mb-1">329K</div>
            <div className="text-sm text-muted-foreground">QR Scans</div>
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
            <div className="text-3xl mb-1">3</div>
            <div className="text-sm text-muted-foreground">Alerts</div>
          </motion.div>
        </div>

        {/* New Batch Form */}
        {showNewBatchForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-12 bg-white rounded-2xl border border-border p-8"
          >
            <h2 className="text-2xl mb-6">Register New Batch</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Drug Name</label>
                <input
                  type="text"
                  placeholder="e.g., Artemether-Lumefantrine 20/120mg"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Batch ID</label>
                <input
                  type="text"
                  placeholder="Auto-generated or custom"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Quantity</label>
                <input
                  type="number"
                  placeholder="Number of units"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Expiry Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="px-6 py-3 rounded-xl bg-primary text-white hover:shadow-lg transition-all">
                Register & Generate QR Codes
              </button>
              <button
                onClick={() => setShowNewBatchForm(false)}
                className="px-6 py-3 rounded-xl bg-background hover:bg-muted transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Batches Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-border overflow-hidden"
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-2xl">Registered Batches</h2>
            <button className="text-sm text-primary hover:underline flex items-center gap-2">
              <BarChart3 className="size-4" />
              View Analytics
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">Batch ID</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">Drug Name</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">Quantity</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">Distributed</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">Registered</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch.id} className="border-b border-border hover:bg-background transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm">{batch.id}</div>
                    </td>
                    <td className="px-6 py-4">{batch.drugName}</td>
                    <td className="px-6 py-4">{batch.quantity.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(batch.distributed / batch.quantity) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {Math.round((batch.distributed / batch.quantity) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm ${
                          batch.status === 'active'
                            ? 'bg-verified-green/10 text-verified-green border border-verified-green/20'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {batch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{batch.registered}</td>
                    <td className="px-6 py-4">
                      <button className="text-primary hover:underline text-sm">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
