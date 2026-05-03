import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logIn, setupRecaptcha, sendPhoneOTP, verifyPhoneOTP } from "../services/authService";
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loginMethod === "phone" && !window.recaptchaVerifier) {
      setupRecaptcha('recaptcha-container');
    }
  }, [loginMethod]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await logIn(email, password);
      // Routing is handled automatically by AppRoutes auth listener
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError('Failed to login. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!showOtpInput) {
        // Send OTP
        const appVerifier = window.recaptchaVerifier;
        await sendPhoneOTP(phone, appVerifier);
        setShowOtpInput(true);
      } else {
        // Verify OTP
        await verifyPhoneOTP(otp);
      }
    } catch (err) {
      console.error("Phone auth error:", err);
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
              <div className="w-10 h-10 rounded-lg bg-white text-[var(--color-primary)] flex items-center justify-center font-bold text-2xl shadow-lg">L</div>
              <span className="text-2xl font-bold tracking-tight">Ledger AI</span>
            </div>
            <h1 className="text-[2.5rem] leading-[1.15] font-bold mb-6 tracking-tight">Smart Financial Management for MSMEs</h1>
            <p className="text-blue-100/90 text-lg leading-relaxed mb-12 max-w-[90%]">
              Simplify your cash flow. Track revenue, manage expenses, and generate professional insights instantly from one secure dashboard.
            </p>
          </div>
          <div className="relative z-10 mt-12 text-sm text-white/50 font-medium">
            &copy; {new Date().getFullYear()} Ledger AI Technologies Inc.
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-[55%] p-8 sm:p-12 xl:p-16 relative bg-white">
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-2xl shadow-lg">L</div>
            <span className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">Ledger AI</span>
          </div>

          <div className="max-w-[420px] mx-auto w-full relative min-h-[500px]">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-gray-500 text-sm">Enter your credentials to access your account.</p>
            </div>

            <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6">
              <button 
                type="button"
                onClick={() => { setLoginMethod('email'); setError(''); }} 
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${loginMethod === 'email' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >Email</button>
              <button 
                type="button"
                onClick={() => { setLoginMethod('phone'); setError(''); }} 
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${loginMethod === 'phone' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >Phone OTP</button>
            </div>

            <div id="recaptcha-container"></div>

            {loginMethod === 'email' ? (
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error}
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
            ) : (
              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                {!showOtpInput ? (
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={error}
                  />
                ) : (
                  <Input
                    label="Enter 6-Digit Code"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    error={error}
                  />
                )}
                <Button type="submit" isLoading={isLoading}>
                  {isLoading ? 'Processing...' : (!showOtpInput ? 'Send OTP' : 'Verify & Login')}
                </Button>
              </form>
            )}

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
