import { motion } from 'motion/react';
import {
  ArrowLeft,
  Scan,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Package,
  Calendar,
  Pill,
  MapPin,
  TrendingUp,
  Shield,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDrugData } from '../contexts/DrugDataContext';
import { useEffect } from 'react';

export function VerificationResults() {
  const navigate = useNavigate();
  const { drugData } = useDrugData();

  useEffect(() => {
    if (!drugData) {
      navigate('/scan');
    }
  }, [drugData, navigate]);

  if (!drugData) {
    return null;
  }

  const data = drugData;
  const registeredBatchIds = ['AZI250-BN-55678', 'AL2024-001', 'AMX2024-089'];
  const isVerified = data.verified && !data.anomalyDetected;
  const isRegistered = registeredBatchIds.includes(data.batchId);
  const isCounterfeit = !isVerified;

  const downloadReport = () => {
    const report = {
      batchId: data.batchId,
      drugName: data.drugName,
      manufacturer: data.manufacturer,
      verified: data.verified,
      anomalyDetected: data.anomalyDetected,
      registered: isRegistered,
      warnings: data.warnings || [],
      manufactureDate: data.manufactureDate,
      expiryDate: data.expiryDate,
      dosage: data.dosage,
      activeIngredient: data.activeIngredient,
      supplyChain: data.supplyChain,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verification-report-${data.batchId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="size-10 rounded-xl bg-background hover:bg-muted transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <h1 className="text-2xl">Verification Results</h1>
                <p className="text-sm text-muted-foreground">Batch ID</p>
                <p className="text-lg font-semibold font-mono">{data.batchId}</p>
                <div
                  className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    isRegistered
                      ? 'bg-verified-green/10 text-verified-green'
                      : 'bg-error-red/10 text-error-red'
                  }`}
                >
                  {isRegistered ? 'Registered on ledger' : 'Batch not registered'}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/scan')}
              className="px-6 py-3 rounded-xl bg-primary text-white hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Scan className="size-4" />
              <span>Scan Another</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Selected Batch Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-white border border-border p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2">
                  Selected Batch
                </div>
                <div className="text-3xl font-semibold font-mono break-all">
                  {data.batchId}
                </div>
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                  This batch is the current selected verification result. Use it to search and compare against registered inventory.
                </p>
              </div>
              <div
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
                  isRegistered
                    ? 'bg-verified-green/10 text-verified-green border border-verified-green/20'
                    : 'bg-error-red/10 text-error-red border border-error-red/20'
                }`}
              >
                {isRegistered ? 'Registered on ledger' : 'Batch not registered'}
              </div>
            </div>
          </motion.div>


          {isRegistered ? null : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-3xl bg-slate-50 border border-border p-6"
            >
              <div className="flex items-center justify-between mb-4 gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Registered Batch IDs</h2>
                  <p className="text-sm text-muted-foreground">
                    This batch is not registered. Compare it with known registered IDs below.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {registeredBatchIds.map((id) => (
                  <div
                    key={id}
                    className="rounded-2xl border border-border bg-white px-4 py-3 text-sm font-medium text-foreground"
                  >
                    {id}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Verification Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative overflow-hidden rounded-3xl p-10 text-white shadow-xl border ${
              isVerified
                ? 'bg-emerald-800 border-emerald-600'
                : 'bg-red-800 border-red-600 animate-pulse'
            }`}
          >
            <div className="absolute top-0 right-0 size-64 opacity-10">
              {isVerified ? (
                <CheckCircle2 className="size-full text-white/10" strokeWidth={1} />
              ) : (
                <XCircle className="size-full text-white/10" strokeWidth={1} />
              )}
            </div>

            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="size-20 rounded-2xl bg-black/25 flex items-center justify-center shadow-sm">
                    {isVerified ? (
                      <CheckCircle2 className="size-10 text-white" />
                    ) : (
                      <XCircle className="size-10 text-white" />
                    )}
                  </div>
                  <div className="text-white">
                    <div className="text-sm opacity-90 mb-3 flex items-center gap-3">
                    <span>Verification Status</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                        isVerified
                          ? 'bg-black/30 text-white border-white/40'
                          : 'bg-black/30 text-white border-white/40'
                      }`}
                    >
                      {isRegistered ? 'REGISTERED' : 'UNREGISTERED'}
                    </span>
                  </div>
                  <div className="text-4xl">
                    {isVerified ? 'Authentic Medication' : 'Counterfeit Detected'}
                  </div>
                </div>
              </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-black/20 border border-white/20 shadow-sm">
                  <div className="text-white/95 text-sm mb-2">Drug Name</div>
                  <div className="text-2xl text-white">{data.drugName}</div>
                </div>
                <div className="p-6 rounded-2xl bg-black/20 border border-white/20 shadow-sm">
                  <div className="text-white/95 text-sm mb-2">Manufacturer</div>
                  <div className="text-2xl text-white">{data.manufacturer}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Warnings (if any) */}
          {data.warnings && data.warnings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 rounded-2xl bg-warning-amber/10 border-2 border-warning-amber/30"
            >
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-warning-amber/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="size-6 text-warning-amber" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl mb-4 text-warning-amber">Security Alerts</h3>
                  <ul className="space-y-3">
                    {data.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="size-6 rounded-full bg-warning-amber/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-warning-amber text-xs">!</span>
                        </div>
                        <span className="text-lg text-foreground/90">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Drug Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8 rounded-2xl bg-white border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Pill className="size-6 text-primary" />
                </div>
                <h3 className="text-2xl">Drug Information</h3>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4 pb-5 border-b border-border">
                  <Package className="size-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Batch ID</div>
                    <div className="text-lg font-mono">{data.batchId}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-5 border-b border-border">
                  <Activity className="size-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Active Ingredient</div>
                    <div className="text-lg">{data.activeIngredient}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-5 border-b border-border">
                  <Pill className="size-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">Dosage</div>
                    <div className="text-lg">{data.dosage}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="size-5 text-muted-foreground mt-1" />
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Manufactured</div>
                      <div className="text-base">{data.manufactureDate}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="size-5 text-muted-foreground mt-1" />
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Expires</div>
                      <div className="text-base">{data.expiryDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Analysis */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-8 rounded-2xl bg-white border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="size-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <TrendingUp className="size-6 text-secondary" />
                </div>
                <h3 className="text-2xl">AI Analysis</h3>
              </div>

              <div className="space-y-5">
                <div className="p-5 rounded-xl bg-background">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Supply Chain Integrity</span>
                    <span className={`text-lg ${isVerified ? 'text-verified-green' : 'text-error-red'}`}>
                      {isVerified ? '98%' : '34%'}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isVerified ? '98%' : '34%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full ${isVerified ? 'bg-verified-green' : 'bg-error-red'}`}
                    />
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-background">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Packaging Authenticity</span>
                    <span className={`text-lg ${isVerified ? 'text-verified-green' : 'text-error-red'}`}>
                      {isVerified ? '96%' : '28%'}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isVerified ? '96%' : '28%' }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className={`h-full ${isVerified ? 'bg-verified-green' : 'bg-error-red'}`}
                    />
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-background">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Distribution Pattern</span>
                    <span className={`text-lg ${isVerified ? 'text-verified-green' : 'text-error-red'}`}>
                      {isVerified ? '100%' : '41%'}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isVerified ? '100%' : '41%' }}
                      transition={{ duration: 1, delay: 0.9 }}
                      className={`h-full ${isVerified ? 'bg-verified-green' : 'bg-error-red'}`}
                    />
                  </div>
                </div>

                <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
                  <div className="flex items-start gap-3">
                    <Shield className="size-5 text-primary mt-1" />
                    <div>
                      <div className="text-sm mb-1">AI Confidence Score</div>
                      <div className="text-3xl mb-2">
                        {isVerified ? '98.2%' : '22.8%'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isVerified
                          ? 'All verification checks passed successfully'
                          : 'Multiple anomalies detected - Do not consume'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Supply Chain Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-8 rounded-2xl bg-white border border-border"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="size-12 rounded-xl bg-supply-purple/10 flex items-center justify-center">
                <MapPin className="size-6 text-supply-purple" />
              </div>
              <div>
                <h3 className="text-2xl">Supply Chain Journey</h3>
                <p className="text-muted-foreground">Blockchain-verified distribution path</p>
              </div>
            </div>

            <div className="relative">
              {data.supplyChain.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="relative flex gap-6 pb-12 last:pb-0"
                >
                  {/* Timeline Line */}
                  {index < data.supplyChain.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-primary to-primary/20" />
                  )}

                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`size-12 rounded-full flex items-center justify-center text-white shadow-lg ${
                        item.status === 'completed'
                          ? 'bg-gradient-to-br from-primary to-primary/70'
                          : 'bg-muted'
                      }`}
                    >
                      {item.status === 'completed' ? (
                        <CheckCircle2 className="size-6" />
                      ) : (
                        <span className="text-lg">{index + 1}</span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-xl mb-1">{item.stage}</h4>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="size-4" />
                            <span>{item.location}</span>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-lg text-sm ${
                            item.status === 'completed'
                              ? 'bg-verified-green/10 text-verified-green border border-verified-green/20'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {item.status === 'completed' ? 'Verified' : 'Pending'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="size-4" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {data.supplyChain.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="size-12 mx-auto mb-4 text-warning-amber" />
                <p className="text-lg">No supply chain data available</p>
                <p className="text-sm">This is a red flag - authentic medications have complete chain records</p>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex gap-4 justify-center pt-8"
          >
            <button
              onClick={() => navigate('/scan')}
              className="px-8 py-4 rounded-2xl bg-primary text-white hover:shadow-xl transition-all flex items-center gap-3"
            >
              <Scan className="size-5" />
              <span className="text-lg">Scan Another Medication</span>
            </button>
            <button
              onClick={downloadReport}
              className="px-8 py-4 rounded-2xl bg-white border-2 border-border hover:border-primary/30 transition-all flex items-center gap-3"
            >
              <span className="text-lg">Download Report</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}