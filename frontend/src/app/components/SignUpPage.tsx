import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Mail, Lock, User, Building, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth, UserRole } from '../contexts/AuthContext';

export function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'consumer' as UserRole,
    organization: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    { 
      value: 'consumer' as UserRole, 
      label: 'Consumer/Patient', 
      description: 'Verify medications you purchase',
      needsOrg: false,
    },
    { 
      value: 'manufacturer' as UserRole, 
      label: 'Manufacturer', 
      description: 'Register and track drug batches',
      needsOrg: true,
    },
    { 
      value: 'pharmacy' as UserRole, 
      label: 'Pharmacy', 
      description: 'Dispense and log medications',
      needsOrg: true,
    },
    { 
      value: 'regulator' as UserRole, 
      label: 'Regulator', 
      description: 'Audit and monitor supply chain',
      needsOrg: true,
    },
  ];

  const selectedRole = roles.find(r => r.value === formData.role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (selectedRole?.needsOrg && !formData.organization.trim()) {
      setError('Organization name is required for this role');
      return;
    }

    setLoading(true);

    try {
      await signup(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        formData.organization || undefined
      );
      navigate('/dashboard');
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Shield className="size-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl tracking-tight text-primary">Medify</h1>
              <p className="text-sm text-muted-foreground">Blockchain Authentication</p>
            </div>
          </Link>

          <h2 className="text-4xl mb-3">Create Your Account</h2>
          <p className="text-xl text-muted-foreground">
            Join the fight against counterfeit medications
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl border border-border p-10"
        >
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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Role Selection */}
            <div>
              <label className="block text-lg mb-4">I am a...</label>
              <div className="grid md:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.role === role.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30 bg-background'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                      className="sr-only"
                    />
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-lg">{role.label}</div>
                      {formData.role === role.value && (
                        <CheckCircle2 className="size-5 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Organization (conditional) */}
            {selectedRole?.needsOrg && (
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">
                  Organization Name
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Your organization name"
                    required={selectedRole.needsOrg}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">At least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="size-5 rounded border-border mt-0.5" />
              <span className="text-sm text-muted-foreground">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
