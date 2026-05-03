import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../utils/auth';
import Input from '../components/Input';
import Button from '../components/Button';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ businessName: '', email: '', type: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  useEffect(() => {
    // Password strength logic
    let s = 0;
    const p = formData.password;
    if (p.length >= 8) s += 25;
    if (/[a-z]/.test(p)) s += 25;
    if (/[A-Z]/.test(p)) s += 25;
    if (/[0-9!@#$%^&*]/.test(p)) s += 25;
    setStrength(p.length === 0 ? 0 : s);

    // Confirm match logic
    if (formData.confirm && formData.password !== formData.confirm) {
      setErrors(prev => ({ ...prev, confirm: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirm: '' }));
    }
  }, [formData.password, formData.confirm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) return;

    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      loginUser(formData.email, false); // false = onboarding not completed
      localStorage.setItem('businessName', formData.businessName); // Save for onboarding
      
      setIsLoading(false);
      navigate('/onboarding');
    }, 1200);
  };

  const getStrengthBarColor = () => {
    if (strength === 0) return 'bg-gray-300';
    if (strength <= 25) return 'bg-red-400';
    if (strength <= 50) return 'bg-yellow-400';
    if (strength <= 75) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[var(--color-background)]">
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
            <h1 className="text-[2.5rem] leading-[1.15] font-bold mb-6 tracking-tight">Start managing finances smartly</h1>
            <p className="text-blue-100/90 text-lg leading-relaxed mb-12 max-w-[90%]">
              Join thousands of MSMEs automating their cash flow.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-[55%] p-8 sm:p-12 xl:p-16 relative bg-white">
          <div className="max-w-[420px] mx-auto w-full relative min-h-[500px]">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2 tracking-tight">Create Account</h2>
              <p className="text-gray-500 text-sm">Start managing your business finances today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Business Name" name="businessName" value={formData.businessName} onChange={handleChange} required />
                <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    icon={
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none hover:text-gray-600 transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                  />
                  <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${getStrengthBarColor()}`} style={{ width: `${strength}%` }}></div>
                  </div>
                </div>

                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  name="confirm"
                  value={formData.confirm}
                  onChange={handleChange}
                  error={errors.confirm}
                  required
                />
              </div>

              <Button type="submit" isLoading={isLoading} className="mt-6">
                {isLoading ? 'Setting up...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/" className="font-semibold text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors ml-1">
                Login
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
