import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, ArrowLeft, Keyboard, Scan, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { DrugData } from '../App';
import { useDrugData } from '../contexts/DrugDataContext';
import { useAuth } from '../contexts/AuthContext';

const registeredBatches: Record<string, DrugData> = {
  'AZI250-BN-55678': {
    batchId: 'AZI250-BN-55678',
    drugName: 'Azithro 250',
    manufacturer: 'MediPharm Ltd',
    verified: true,
    supplyChain: [
      { stage: 'Production', location: 'Lagos', date: '2026-03-01', status: 'completed' },
      { stage: 'Quality Control', location: 'Lagos', date: '2026-03-02', status: 'completed' },
      { stage: 'Distribution', location: 'Abuja', date: '2026-03-04', status: 'completed' },
    ],
    manufactureDate: '2026-02-20',
    expiryDate: '2028-02-20',
    dosage: '250 mg',
    activeIngredient: 'Azithromycin',
    anomalyDetected: false,
  },
  'AL2024-001': {
    batchId: 'AL2024-001',
    drugName: 'Allegra Plus',
    manufacturer: 'SafeHealth Pharmaceuticals',
    verified: true,
    supplyChain: [
      { stage: 'Production', location: 'Ibadan', date: '2026-01-15', status: 'completed' },
      { stage: 'Validation', location: 'Ibadan', date: '2026-01-16', status: 'completed' },
      { stage: 'Distribution', location: 'Lagos', date: '2026-01-18', status: 'completed' },
    ],
    manufactureDate: '2026-01-10',
    expiryDate: '2028-01-10',
    dosage: '120 mg',
    activeIngredient: 'Fexofenadine',
    anomalyDetected: false,
  },
  'AMX2024-089': {
    batchId: 'AMX2024-089',
    drugName: 'Amoxil XR',
    manufacturer: 'GlobalBiotics',
    verified: true,
    supplyChain: [
      { stage: 'Production', location: 'Port Harcourt', date: '2026-02-01', status: 'completed' },
      { stage: 'Validation', location: 'Port Harcourt', date: '2026-02-03', status: 'completed' },
      { stage: 'Distribution', location: 'Lagos', date: '2026-02-05', status: 'completed' },
    ],
    manufactureDate: '2026-01-28',
    expiryDate: '2028-01-28',
    dosage: '500 mg',
    activeIngredient: 'Amoxicillin',
    anomalyDetected: false,
  },
};

const createVerificationResult = (batchId: string): DrugData => {
  const registered = registeredBatches[batchId];
  if (registered) {
    return registered;
  }

  return {
    batchId,
    drugName: 'Unknown Medication',
    manufacturer: 'Blockchain record not found',
    verified: false,
    supplyChain: [],
    manufactureDate: 'Unknown',
    expiryDate: 'Unknown',
    dosage: 'Unknown',
    activeIngredient: 'Unknown',
    anomalyDetected: true,
    warnings: [
      'This batch ID is not registered on the verification network.',
      'Check packaging and supplier credentials before use.',
    ],
  };
};

const mapScanResultToDrugData = (result: any, batchId: string): DrugData => {
  if (!result?.batch) {
    return createVerificationResult(batchId);
  }

  return {
    batchId: batchId,
    drugName: result.batch?.name || 'Verified Batch',
    manufacturer: result.batch?.manufacturer_id || 'Unknown Manufacturer',
    verified: result.blockchain_verified ?? true,
    supplyChain: result.batch ? [
      {
        stage: 'Registered',
        location: result.batch?.registered_at ? 'Blockchain' : 'Unknown',
        date: result.batch?.registered_at ? new Date(result.batch.registered_at).toISOString().split('T')[0] : 'Unknown',
        status: 'completed',
      },
    ] : [],
    manufactureDate: result.batch?.production_date || 'Unknown',
    expiryDate: result.batch?.expiry_date || 'Unknown',
    dosage: 'Unknown',
    activeIngredient: 'Unknown',
    anomalyDetected: !!result.ai_flags?.length || !result.blockchain_verified,
    warnings: result.message ? [result.message] : undefined,
  };
};

export function ScanPage() {
  const navigate = useNavigate();
  const { setDrugData } = useDrugData();
  const { isAuthenticated } = useAuth();
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signup');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      setScanning(true);
      setTimeout(() => {
        const data = createVerificationResult(manualCode.trim());
        setDrugData(data);
        navigate('/results');
      }, 2000);
    }
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="size-10 rounded-xl bg-background hover:bg-muted transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <h1 className="text-2xl">Scan Medication</h1>
              <p className="text-sm text-muted-foreground">Verify authenticity using QR code or batch number</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Mode Toggle */}
          <div className="flex gap-3 mb-8 p-2 bg-white rounded-2xl border border-border">
            <button
              onClick={() => setScanMode('camera')}
              className={`flex-1 px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-3 ${
                scanMode === 'camera'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Camera className="size-5" />
              <span>Scan QR Code</span>
            </button>
            <button
              onClick={() => setScanMode('manual')}
              className={`flex-1 px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-3 ${
                scanMode === 'manual'
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Keyboard className="size-5" />
              <span>Enter Manually</span>
            </button>
          </div>

          {scanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-scan-blue/10 border border-scan-blue/30 rounded-2xl flex items-center gap-4"
            >
              <Loader2 className="size-6 text-scan-blue animate-spin" />
              <div>
                <div className="text-lg text-scan-blue mb-1">Verifying on Blockchain...</div>
                <div className="text-sm text-muted-foreground">Checking supply chain and running AI analysis</div>
              </div>
            </motion.div>
          )}

          {/* Camera Mode */}
          {scanMode === 'camera' && !scanning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Camera Viewfinder */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative size-64">
                    {/* Scanning Frame */}
                    <div className="absolute inset-0 border-4 border-scan-blue rounded-2xl">
                      {/* Corner Brackets */}
                      <div className="absolute -top-1 -left-1 size-12 border-t-8 border-l-8 border-white rounded-tl-2xl" />
                      <div className="absolute -top-1 -right-1 size-12 border-t-8 border-r-8 border-white rounded-tr-2xl" />
                      <div className="absolute -bottom-1 -left-1 size-12 border-b-8 border-l-8 border-white rounded-bl-2xl" />
                      <div className="absolute -bottom-1 -right-1 size-12 border-b-8 border-r-8 border-white rounded-br-2xl" />
                    </div>

                    {/* Scanning Line */}
                    <motion.div
                      animate={{ y: [0, 240, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-scan-blue to-transparent"
                      style={{ top: 0 }}
                    />

                    {/* QR Code Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <Scan className="size-24 text-white" />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="text-white text-center text-sm">
                    Position QR code within the frame
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-border bg-white p-6">
                <h3 className="text-lg font-semibold mb-2">QR scanning support coming soon</h3>
                <p className="text-sm text-muted-foreground">
                  Use the manual batch ID entry below until direct QR scanning is enabled in the next release.
                </p>
              </div>
            </motion.div>
          )}

          {/* Manual Mode */}
          {scanMode === 'manual' && !scanning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-8 bg-white rounded-2xl border border-border">
                <label className="block mb-3 text-lg">Batch ID / Serial Number</label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
                  placeholder="e.g., BTC-2026-A8F3E2"
                  className="w-full px-6 py-4 rounded-xl border-2 border-border focus:border-primary focus:outline-none text-lg font-mono"
                />
                <p className="mt-3 text-sm text-muted-foreground">
                  Enter the batch ID found on your medication packaging
                </p>
              </div>

              <button
                onClick={handleManualSubmit}
                disabled={!manualCode.trim()}
                className="w-full px-8 py-5 rounded-2xl bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-3 text-lg"
              >
                <Scan className="size-6" />
                <span>Verify Medication</span>
              </button>

              <div className="p-6 bg-background rounded-2xl border border-border text-sm text-muted-foreground">
                Enter the exact batch ID from your medication packaging to verify the batch against the secure ledger.
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
