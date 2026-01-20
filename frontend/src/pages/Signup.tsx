import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Building, Globe, ArrowRight, Sparkles, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ASEAN_COUNTRIES } from '@/types';

export default function Signup() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company_name: '',
    country: '',
    role: 'Admin' as 'Admin' | 'Employee',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = useState<{ name: string; country: string }[]>([]);
  const [isNewCompany, setIsNewCompany] = useState(true);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch existing companies for employee signup
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await authAPI.getCompanies();
        setCompanies(data);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      }
    };
    fetchCompanies();
  }, []);

  // Password validation
  const passwordRequirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
    { label: 'One special character', test: (p: string) => /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(p) },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Reset company info when role changes
    if (field === 'role') {
      setFormData((prev) => ({ ...prev, company_name: '', country: '' }));
      setIsNewCompany(value === 'Admin');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    // Validate all password requirements
    const failedRequirements = passwordRequirements.filter(req => !req.test(formData.password));
    if (failedRequirements.length > 0) {
      toast({
        title: 'Invalid Password',
        description: failedRequirements[0].label + ' is required.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        company_name: formData.company_name,
        country: formData.country,
        role: formData.role,
      });

      if (result.requires_approval) {
        toast({
          title: 'Registration Successful!',
          description: 'Your account is pending approval from your administrator. You will be notified once approved.',
        });
      } else {
        toast({
          title: 'Registration Successful!',
          description: 'You can now log in to your account.',
        });
      }
      
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Registration failed. Please try again.';
      toast({
        title: 'Registration Failed',
        description: Array.isArray(message) ? message[0]?.msg || message : message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"
          animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-48 h-48 bg-white/10 rounded-full blur-2xl"
          animate={{ y: [0, -30, 0], scale: [1, 0.9, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">LuminaHR</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Join the HR
              <br />
              <span className="text-white/90">Revolution Today</span>
            </h1>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Create your account and start managing your workforce with the most advanced HR platform in ASEAN.
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12 space-y-4"
          >
            {['Free for small teams', 'No credit card required', 'ASEAN labour law compliant'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Signup Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto"
      >
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">LuminaHR</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground mb-8">
              Fill in your details to get started
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">I am registering as</Label>
              <div className="grid grid-cols-2 gap-3">
                {['Admin', 'Employee'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleChange('role', role)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.role === role
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold text-foreground">{role}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {role === 'Admin' ? 'Create or manage a company' : 'Join an existing company'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="full_name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  className="pl-11 h-12 bg-secondary/50 border-border/50"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="pl-11 h-12 bg-secondary/50 border-border/50"
                  required
                />
              </div>
            </div>

            {/* Company Selection */}
            {formData.role === 'Employee' && companies.length > 0 ? (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Company</Label>
                <Select
                  value={formData.company_name}
                  onValueChange={(value) => {
                    const company = companies.find(c => c.name === value);
                    handleChange('company_name', value);
                    if (company) handleChange('country', company.country);
                  }}
                >
                  <SelectTrigger className="h-12 bg-secondary/50 border-border/50">
                    <Building className="w-5 h-5 text-muted-foreground mr-2" />
                    <SelectValue placeholder="Choose your company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.name} value={company.name}>
                        {company.name} ({company.country})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <>
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="text-sm font-medium">Company Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="company_name"
                      type="text"
                      placeholder="Acme Corporation"
                      value={formData.company_name}
                      onChange={(e) => handleChange('company_name', e.target.value)}
                      className="pl-11 h-12 bg-secondary/50 border-border/50"
                      required
                    />
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleChange('country', value)}
                  >
                    <SelectTrigger className="h-12 bg-secondary/50 border-border/50">
                      <Globe className="w-5 h-5 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Select ASEAN country" />
                    </SelectTrigger>
                    <SelectContent>
                      {ASEAN_COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="pl-11 pr-11 h-12 bg-secondary/50 border-border/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {passwordRequirements.map((req, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-xs ${
                        req.test(formData.password) ? 'text-green-500' : 'text-muted-foreground'
                      }`}
                    >
                      <Check className={`w-3 h-3 ${req.test(formData.password) ? 'opacity-100' : 'opacity-30'}`} />
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="pl-11 pr-11 h-12 bg-secondary/50 border-border/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || formData.password !== formData.confirmPassword}
              className="w-full h-12 text-base font-semibold group mt-6"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </motion.form>

          {/* Sign In Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 text-center text-muted-foreground"
          >
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </motion.p>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
