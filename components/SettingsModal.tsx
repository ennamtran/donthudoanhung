
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
import { X, User as UserIcon, Mail, Phone, Lock, Camera, Save, ShieldCheck, Eye, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';

interface SettingsModalProps {
  user: User;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ user, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email || '',
    phone: user.phone || '',
    avatar: user.avatar || ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdate({
        ...user,
        ...formData
      });
      setSuccessMessage('Cập nhật thông tin cá nhân thành công!');
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 800);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (passwordData.oldPassword !== user.password) {
      alert('Mật khẩu cũ không chính xác!');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      onUpdate({
        ...user,
        password: passwordData.newPassword
      });
      setSuccessMessage('Đổi mật khẩu thành công!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <UserIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase leading-none tracking-tight">Cài đặt tài khoản</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Quản lý thông tin và bảo mật</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-8 bg-white border-b border-slate-100 flex gap-8 shrink-0">
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`py-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
          >
            Thông tin cá nhân
          </button>
          <button 
            onClick={() => setActiveTab('security')} 
            className={`py-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'security' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
          >
            Bảo mật & Mật khẩu
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-100 text-green-600 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={20} />
              <p className="text-sm font-bold">{successMessage}</p>
            </div>
          )}

          {activeTab === 'profile' ? (
            <form onSubmit={handleProfileSave} className="space-y-8">
              <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                  <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={48} className="text-slate-300" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera size={24} />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                </div>
                <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ảnh đại diện công vụ</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chức vụ / Vai trò</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      disabled
                      value={user.role}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-bold text-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      value={formData.email}
                      placeholder="chua_cap_nhat@doanhung.gov.vn"
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      placeholder="Chưa cập nhật"
                      onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <Save size={18} />
                  {isSaving ? 'ĐANG LƯU...' : 'LƯU THÔNG TIN THAY ĐỔI'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSave} className="space-y-6">
              <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl flex gap-4 mb-6">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                  <KeyRound size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-amber-900 uppercase">Khuyến nghị bảo mật</p>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Bạn nên đổi mật khẩu định kỳ 6 tháng một lần và không sử dụng lại mật khẩu cũ để đảm bảo an toàn cho dữ liệu công vụ.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type={showPasswords.old ? 'text' : 'password'} 
                      value={passwordData.oldPassword}
                      onChange={e => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type={showPasswords.new ? 'text' : 'password'} 
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type={showPasswords.confirm ? 'text' : 'password'} 
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <KeyRound size={18} />
                  {isSaving ? 'ĐANG CẬP NHẬT...' : 'XÁC NHẬN ĐỔI MẬT KHẨU'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 text-center shrink-0">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Cổng hành chính số UBND xã Đoan Hùng</p>
        </div>
      </div>
    </div>
  );
};