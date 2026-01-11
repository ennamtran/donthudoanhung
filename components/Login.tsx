
import React, { useState } from 'react';
import { USERS } from '../constants';
import { User } from '../types';
import { ShieldCheck, Fingerprint, Lock, ChevronRight, Loader2, Landmark, User as UserIcon, Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  onUpdateUser: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onUpdateUser }) => {
  const [step, setStep] = useState<'login' | 'changePassword'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // States cho đổi mật khẩu
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    
    // Giả lập độ trễ server
    setTimeout(() => {
      // Tìm trong danh sách (Ưu tiên từ localStorage nếu đã có thay đổi mật khẩu)
      const storedUsersRaw = localStorage.getItem('system_users_data');
      const systemUsers: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : USERS;
      
      const user = systemUsers.find(u => u.username === username.toLowerCase() && u.password === password);
      
      if (user) {
        if (user.isFirstLogin) {
          setTempUser(user);
          setStep('changePassword');
          setLoading(false);
        } else {
          onLogin(user);
        }
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
        setLoading(false);
      }
    }, 1000);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải từ 6 ký tự trở lên');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Xác nhận mật khẩu không trùng khớp');
      return;
    }

    if (tempUser) {
      setLoading(true);
      setTimeout(() => {
        const updatedUser = { ...tempUser, password: newPassword, isFirstLogin: false };
        
        // Lưu cập nhật vào hệ thống giả lập
        const storedUsersRaw = localStorage.getItem('system_users_data');
        let systemUsers: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : USERS;
        systemUsers = systemUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
        localStorage.setItem('system_users_data', JSON.stringify(systemUsers));
        
        onUpdateUser(updatedUser);
        onLogin(updatedUser);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f172a] flex flex-col items-center justify-center p-6 z-[100] overflow-y-auto">
      <div className="w-full max-w-md flex flex-col items-center space-y-8 py-10">
        
        {/* Branding */}
        <div className="flex flex-col items-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-900/40 border border-red-500/30">
              <Landmark size={40} className="text-yellow-400" />
           </div>
           <div className="text-center">
              <h1 className="text-white text-xl font-black tracking-tight">CHÍNH QUYỀN SỐ</h1>
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1"> ỦY BAN NHÂN DÂN XÃ ĐOAN HÙNG</p>
           </div>
        </div>

        {step === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="w-full bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-700/50 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="space-y-2 text-center">
               <h2 className="text-white font-bold text-lg">Đăng nhập hệ thống</h2>
               <p className="text-slate-500 text-xs">Sử dụng tài khoản cán bộ được cấp</p>
            </div>

            <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Tên đăng nhập</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="vd: dqtoan"
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white text-sm outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Mật khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white text-sm outline-none focus:border-blue-500 transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
               </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                 <AlertCircle size={16} className="shrink-0" />
                 <p className="text-[11px] font-bold">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>ĐĂNG NHẬP <ChevronRight size={18} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleChangePasswordSubmit} className="w-full bg-slate-800/40 p-8 rounded-[2.5rem] border border-blue-500/30 backdrop-blur-xl shadow-2xl space-y-6 animate-in slide-in-from-right duration-500">
            <div className="space-y-2 text-center">
               <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto text-blue-500 mb-2">
                  <KeyRound size={24} />
               </div>
               <h2 className="text-white font-bold text-lg">Đổi mật khẩu lần đầu</h2>
               <p className="text-slate-500 text-xs">Bạn cần thay đổi mật khẩu mặc định để bảo mật tài khoản trước khi tiếp tục.</p>
            </div>

            <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Ít nhất 6 ký tự"
                      className="w-full pl-12 pr-12 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white text-sm outline-none focus:border-blue-500 transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white text-sm outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
               </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                 <AlertCircle size={16} className="shrink-0" />
                 <p className="text-[11px] font-bold">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-green-500/20 hover:bg-green-500 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>XÁC NHẬN & VÀO HỆ THỐNG <ChevronRight size={18} /></>}
            </button>
          </form>
        )}

        <div className="pt-6 flex flex-col items-center gap-2">
           <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Hệ thống bảo mật công vụ</span>
           </div>
           <p className="text-slate-500 text-[9px] text-center max-w-[250px]">
             Bản quyền thuộc về UBND xã Đoan Hùng. Mọi hành vi truy cập trái phép sẽ bị xử lý theo pháp luật.
           </p>
        </div>
      </div>
    </div>
  );
};
