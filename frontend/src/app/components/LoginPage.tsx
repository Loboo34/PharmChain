import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please sign up if you do not have an account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Shield className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl tracking-tight text-primary">Medify</h1>
              <p className="text-muted-foreground">Blockchain Authentication</p>
            </div>
          </div>

          <h2 className="text-5xl mb-6 leading-tight">
            Secure Access to
            <br />
            <span className="text-primary">Healthcare Authentication</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join thousands of healthcare professionals, manufacturers, and consumers in the fight
            against counterfeit medications.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white border border-border">
              <div className="text-3xl text-primary mb-2">2.3M+</div>
              <div className="text-sm text-muted-foreground">Verified Drugs</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-border">
              <div className="text-3xl text-verified-green mb-2">98.7%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-border p-10">
            <div className="mb-8">
              <h2 className="text-3xl mb-2">Welcome Back</h2>
              <p className="text-muted-foreground">Sign in to your Medify account</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-error-red/10 border border-error-red/20 flex items-start gap-3"
              >
                <AlertCircle className="size-5 text-error-red flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error-red">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="size-4 rounded border-border" />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-primary text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
