import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Wallet, TrendingUp, Receipt, ArrowDown, ArrowUp } from 'lucide-react';
import { logOut } from '../services/authService';

const Dashboard = ({ user, userData }) => {
  const navigate = useNavigate();
  const userEmail = user?.email;
  const businessName = userData?.businessName;

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen text-[var(--color-text)] bg-[var(--color-background)]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg shadow-md">L</div>
              <span className="text-xl font-bold text-[var(--color-primary)] tracking-tight hidden sm:block">Ledger AI</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-700 hidden sm:block">
                {userEmail || 'User'}
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[var(--color-secondary)] flex items-center justify-center">
                <User size={16} />
              </div>
              <button onClick={handleLogout} className="ml-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back{businessName ? `, ${businessName}` : ''}!
          </h1>
          <p className="text-gray-500 mt-1">Here is a summary of your financial health.</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'Total Balance', amount: '₹1,24,500', icon: <Wallet size={20} />, color: 'text-[var(--color-secondary)]', bg: 'bg-blue-50', trend: '+2.4%', up: true },
            { title: 'Monthly Revenue', amount: '₹45,200', icon: <TrendingUp size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '+12.5%', up: true },
            { title: 'Monthly Expenses', amount: '₹18,400', icon: <Receipt size={20} />, color: 'text-red-500', bg: 'bg-red-50', trend: '+4.1%', up: true },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.amount}</h3>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span className={`font-medium flex items-center gap-1 ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.up ? <ArrowUp size={14} /> : <ArrowDown size={14} />} {stat.trend}
                </span>
                <span className="text-gray-400 ml-2">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-sm font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { title: 'Client Payment - Alpha Co.', date: 'Today, 10:42 AM', category: 'Consulting Income', amount: '+₹15,000', type: 'income' },
              { title: 'AWS Cloud Services', date: 'Yesterday, 02:15 PM', category: 'Software Subscriptions', amount: '-₹4,200', type: 'expense' },
              { title: 'Office Rent', date: 'May 1, 09:00 AM', category: 'Rent & Lease', amount: '-₹25,000', type: 'expense' },
            ].map((tx, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {tx.type === 'income' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{tx.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tx.date} • {tx.category}</p>
                  </div>
                </div>
                <span className={`font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-gray-900'}`}>{tx.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
