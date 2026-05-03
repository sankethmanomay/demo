import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../utils/auth';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      // In a real app, we check backend. For now, assume onboarding is complete if not set.
      const onboardingCompleted = localStorage.getItem('onboardingCompleted') !== 'false';
      loginUser(formData.email, onboardingCompleted);
      
      setIsLoading(false);
      navigate(onboardingCompleted ? '/dashboard' : '/onboarding');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[var(--color-background)]">
      {/* Background Accents */}
      <div className="fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-blue-100/40 blur-3xl -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-blue-500/10 blur-3xl -z-10"></div>

      <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-soft overflow-hidden flex flex-col lg:flex-row relative z-10 border border-gray-100">
        
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[var(--color-primary)] to-[#0f245c] p-10 xl:p-14 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 rounded-lg bg-white text-[var(--color-primary)] flex items-center justify-center font-bold text-2xl shadow-lg">F</div>
              <span className="text-2xl font-bold tracking-tight">FlowAI</span>
            </div>
            <h1 className="text-[2.5rem] leading-[1.15] font-bold mb-6 tracking-tight">Smart Financial Management for MSMEs</h1>
            <p className="text-blue-100/90 text-lg leading-relaxed mb-12 max-w-[90%]">
              Simplify your cash flow. Track revenue, manage expenses, and generate professional insights instantly from one secure dashboard.
            </p>
          </div>
          <div className="relative z-10 mt-12 text-sm text-white/50 font-medium">
            &copy; {new Date().getFullYear()} FlowAI Technologies Inc.
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-[55%] p-8 sm:p-12 xl:p-16 relative bg-white">
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-2xl shadow-lg">F</div>
            <span className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">FlowAI</span>
          </div>

          <div className="max-w-[420px] mx-auto w-full relative min-h-[500px]">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-gray-500 text-sm">Enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="founder@company.com"
                value={formData.email}
                onChange={handleChange}
                error={error}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                icon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <div className="flex items-center justify-between mt-3 mb-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 text-[var(--color-secondary)] rounded border-gray-300 focus:ring-blue-500/50 transition-colors" />
                  <span className="text-sm text-gray-600 group-hover:text-[var(--color-text)] transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors">Forgot password?</a>
              </div>

              <Button type="submit" isLoading={isLoading}>
                {isLoading ? 'Authenticating...' : 'Login'}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors ml-1">
                Create Account
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
