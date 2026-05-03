import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Store, Briefcase, Factory, Laptop, Utensils, Shapes, ArrowRight, ArrowLeft } from 'lucide-react';
import { saveOnboardingData } from '../services/userService';

const Onboarding = ({ user }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const inputRef = useRef(null);

  const [formData, setFormData] = useState({
    businessName: localStorage.getItem('businessName') || '',
    industry: '',
    openingBalance: '',
    revenueRange: '',
    categories: ['Rent & Lease', 'Salaries', 'Inventory', 'Utilities'],
    customCategory: '',
    txType: 'expense',
    txAmount: '',
    txCategory: ''
  });

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateCurrentStep();
    const timer = setTimeout(() => {
      if (inputRef.current && currentStep !== 6) {
        inputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStep, formData]);

  const validateCurrentStep = () => {
    let valid = false;
    switch (currentStep) {
      case 1: valid = formData.businessName.trim() !== ''; break;
      case 2: valid = formData.industry !== ''; break;
      case 3: valid = formData.openingBalance !== ''; break;
      case 4: valid = formData.categories.length > 0; break;
      case 5: valid = formData.txAmount !== ''; break;
      default: valid = true;
    }
    setIsValid(valid);
  };

  const handleNext = () => {
    if (isValid && currentStep <= totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValid) {
      handleNext();
    }
  };

  const finishSetup = async () => {
    if (!user) return;
    try {
      await saveOnboardingData(user.uid, formData);
      // Hard refresh to reload auth state and user data from Firestore
      window.location.href = '/dashboard';
    } catch (err) {
      console.error("Failed to save onboarding data", err);
    }
  };

  const toggleCategory = (cat) => {
    setFormData(prev => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists ? prev.categories.filter(c => c !== cat) : [...prev.categories, cat]
      };
    });
  };

  const addCustomCategory = () => {
    if (formData.customCategory.trim()) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, prev.customCategory.trim()],
        customCategory: ''
      }));
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[var(--color-background)]">
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-50/60 blur-3xl -z-10"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-50/60 blur-3xl -z-10"></div>

      {currentStep < 6 && (
        <header className="w-full max-w-3xl mx-auto pt-8 px-6 sm:px-10 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg shadow-sm">L</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--color-muted)]">Step {currentStep} of {totalSteps}</span>
            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-secondary)] transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 flex flex-col justify-center items-center w-full px-4 sm:px-6 py-12 relative z-10">
        <div className="w-full max-w-2xl mx-auto relative h-[400px]">
          
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="absolute inset-0 animate-in fade-in slide-in-from-right-8 duration-500">
              <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-4 tracking-tight">Welcome to Ledger AI.</h1>
              <p className="text-xl text-[var(--color-muted)] mb-12">To get started, what's your business called?</p>
              <input 
                ref={inputRef}
                type="text" 
                className="w-full text-3xl sm:text-4xl font-medium text-text bg-transparent border-b-2 border-gray-200 py-4 focus:outline-none focus:border-[var(--color-secondary)] transition-colors placeholder-gray-300"
                placeholder="e.g. Acme Corp" 
                value={formData.businessName}
                onChange={e => setFormData({...formData, businessName: e.target.value})}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="absolute inset-0 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl sm:text-4xl font-bold text-text mb-3 tracking-tight">What industry are you in?</h2>
              <p className="text-lg text-[var(--color-muted)] mb-10">This helps us tailor your financial categories.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { id: 'Retail', icon: <Store className="w-8 h-8 mb-3" /> },
                  { id: 'Services', icon: <Briefcase className="w-8 h-8 mb-3" /> },
                  { id: 'Manufacturing', icon: <Factory className="w-8 h-8 mb-3" /> },
                  { id: 'Technology', icon: <Laptop className="w-8 h-8 mb-3" /> },
                  { id: 'Food & Bev', icon: <Utensils className="w-8 h-8 mb-3" /> },
                  { id: 'Other', icon: <Shapes className="w-8 h-8 mb-3" /> }
                ].map(ind => (
                  <div 
                    key={ind.id} 
                    onClick={() => setFormData({...formData, industry: ind.id})}
                    className={`flex flex-col items-center justify-center p-6 bg-white border-2 rounded-xl cursor-pointer transition-all hover:-translate-y-1 ${
                      formData.industry === ind.id 
                      ? 'border-[var(--color-secondary)] bg-blue-50/50 shadow-[var(--shadow-card-hover)] ring-1 ring-[var(--color-secondary)] text-[var(--color-secondary)]' 
                      : 'border-gray-100 hover:border-blue-200 text-gray-500 hover:text-[var(--color-secondary)]'
                    }`}
                  >
                    {ind.icon}
                    <span className={`font-medium ${formData.industry === ind.id ? 'text-[var(--color-text)]' : ''}`}>{ind.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="absolute inset-0 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl sm:text-4xl font-bold text-text mb-3 tracking-tight">Let's set your starting balances.</h2>
              <p className="text-lg text-[var(--color-muted)] mb-10">How much cash is currently in your business bank account?</p>
              <div className="bg-white p-8 rounded-2xl shadow-[var(--shadow-premium)] border border-gray-100">
                <div className="relative flex items-end">
                  <span className="text-4xl font-medium text-gray-400 mb-4 mr-2">₹</span>
                  <input 
                    ref={inputRef}
                    type="number" 
                    className="w-full text-3xl sm:text-4xl font-medium text-text bg-transparent border-b-2 border-gray-200 py-4 focus:outline-none focus:border-[var(--color-secondary)] transition-colors placeholder-gray-300"
                    placeholder="0" 
                    value={formData.openingBalance}
                    onChange={e => setFormData({...formData, openingBalance: e.target.value})}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="mt-8">
                  <p className="text-sm font-medium text-[var(--color-muted)] mb-4 uppercase tracking-wider">Estimated Monthly Revenue</p>
                  <div className="flex flex-wrap gap-3">
                    {['< 1L', '1L - 5L', '5L - 10L', '> 10L'].map(range => (
                      <div 
                        key={range}
                        onClick={() => setFormData({...formData, revenueRange: range})}
                        className={`px-6 py-3 rounded-full font-medium cursor-pointer transition-all border ${
                          formData.revenueRange === range 
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md' 
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {range === '< 1L' || range === '> 10L' ? range.replace('L', ' ₹1L').replace('> 10L', '> ₹10L') : `₹${range.replace(' - ', 'L - ₹')}`}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="absolute inset-0 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl sm:text-4xl font-bold text-text mb-3 tracking-tight">Select common categories.</h2>
              <p className="text-lg text-[var(--color-muted)] mb-8">We've pre-selected a few based on your industry. Add or remove as needed.</p>
              <div className="bg-white p-8 rounded-2xl shadow-[var(--shadow-premium)] border border-gray-100">
                <div className="flex flex-wrap gap-3">
                  {['Rent & Lease', 'Salaries', 'Inventory', 'Utilities', 'Marketing', 'Software', 'Travel', 'Consulting'].map(cat => {
                    const isSelected = formData.categories.includes(cat);
                    return (
                      <div 
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-5 py-2.5 rounded-full font-medium cursor-pointer transition-all border ${
                          isSelected 
                          ? 'bg-blue-50 text-[var(--color-primary)] border-[var(--color-primary)]' 
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {cat}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3">
                  <input 
                    type="text" 
                    value={formData.customCategory}
                    onChange={e => setFormData({...formData, customCategory: e.target.value})}
                    onKeyDown={e => e.key === 'Enter' && addCustomCategory()}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-1" 
                    placeholder="Add custom category..."
                  />
                  <button onClick={addCustomCategory} className="bg-gray-900 text-white px-5 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {currentStep === 5 && (
            <div className="absolute inset-0 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl sm:text-4xl font-bold text-text mb-3 tracking-tight">Record your first transaction.</h2>
              <p className="text-lg text-[var(--color-muted)] mb-8">Log an initial income or expense to populate your dashboard.</p>
              <div className="bg-white p-8 rounded-2xl shadow-[var(--shadow-premium)] border border-gray-100">
                <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8">
                  <button 
                    onClick={() => setFormData({...formData, txType: 'income'})} 
                    className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${formData.txType === 'income' ? 'bg-white shadow-sm text-text' : 'text-gray-500 hover:text-gray-900'}`}
                  >Income</button>
                  <button 
                    onClick={() => setFormData({...formData, txType: 'expense'})} 
                    className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${formData.txType === 'expense' ? 'bg-white shadow-sm text-text' : 'text-gray-500 hover:text-gray-900'}`}
                  >Expense</button>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                      <input 
                        ref={inputRef}
                        type="number" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--color-secondary)] focus:bg-white" 
                        placeholder="0.00"
                        value={formData.txAmount}
                        onChange={e => setFormData({...formData, txAmount: e.target.value})}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--color-secondary)] focus:bg-white"
                      value={formData.txCategory || formData.categories[0]}
                      onChange={e => setFormData({...formData, txCategory: e.target.value})}
                    >
                      {formData.categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: FINISH */}
          {currentStep === 6 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30 transform transition-transform hover:scale-105">
                <Check className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-4 tracking-tight">You're all set! 🎉</h1>
              <p className="text-xl text-[var(--color-muted)] mb-12 max-w-lg mx-auto">Your business profile is fully configured. You're ready to take control of your finances.</p>
              <button 
                onClick={finishSetup} 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-primary)] hover:bg-[#152c6b] text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>

      {currentStep < 6 && (
        <footer className="w-full max-w-3xl mx-auto px-6 sm:px-10 pb-10 pt-4 z-20 flex justify-between items-center">
          <button 
            onClick={handlePrev} 
            className={`flex items-center gap-2 text-[var(--color-muted)] hover:text-text font-medium px-4 py-2 transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          <button 
            onClick={handleNext} 
            disabled={!isValid} 
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium transition-all ${
              currentStep === totalSteps 
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md' 
              : 'bg-[var(--color-primary)] hover:bg-[#152c6b] text-white shadow-md hover:shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {currentStep === totalSteps ? (
              <>Finish Setup <Check className="w-4 h-4" /></>
            ) : (
              <>Continue <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </footer>
      )}
    </div>
  );
};

export default Onboarding;
