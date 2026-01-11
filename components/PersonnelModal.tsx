
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { DEPARTMENTS } from '../constants';
import { X, UserPlus, Trash2, Edit2, Search, ShieldCheck, Users, Save, Landmark, Briefcase, UserCog } from 'lucide-react';

interface PersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onUpdateUsers: (users: User[]) => void;
}

export const PersonnelModal: React.FC<PersonnelModalProps> = ({ isOpen, onClose, users, onUpdateUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    username: '',
    password: 'Ubnd@123',
    role: UserRole.PROCESSING_OFFICER,
    department: DEPARTMENTS[0],
    isFirstLogin: true
  });

  if (!isOpen) return null;

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (!formData.name || !formData.username) {
      alert('Vui lòng nhập đầy đủ Tên và Tên đăng nhập');
      return;
    }

    if (editingId) {
      const updated = users.map(u => u.id === editingId ? { ...u, ...formData } as User : u);
      onUpdateUsers(updated);
    } else {
      const newUser: User = {
        ...formData,
        id: `u${Date.now()}`,
      } as User;
      onUpdateUsers([newUser, ...users]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      password: 'Ubnd@123',
      role: UserRole.PROCESSING_OFFICER,
      department: DEPARTMENTS[0],
      isFirstLogin: true
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (user: User) => {
    setFormData(user);
    setEditingId(user.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa cán bộ này khỏi hệ thống?')) {
      onUpdateUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <UserCog size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase leading-none tracking-tight">Văn phòng quản lý nhân sự</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hệ thống quản trị cán bộ UBND xã Đoan Hùng</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left: List */}
          <div className="flex-1 flex flex-col border-r border-slate-100 min-w-0">
            <div className="p-6 border-b border-slate-50 shrink-0 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm tên cán bộ, chức vụ..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              {!isAdding && (
                <button 
                  onClick={() => setIsAdding(true)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                >
                  <UserPlus size={18} /> Thêm cán bộ
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-slate-50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cán bộ</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phòng ban</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm border border-indigo-100">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 leading-none">{user.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{user.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                          {user.department || 'Ban Lãnh đạo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(user)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit2 size={16}/></button>
                          <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Add/Edit Form */}
          {isAdding && (
            <div className="w-[320px] bg-slate-50 p-8 flex flex-col animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                  {editingId ? 'Sửa thông tin' : 'Thêm cán bộ mới'}
                </h3>
                <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>

              <div className="space-y-5 flex-1 overflow-y-auto no-scrollbar pb-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên đăng nhập</label>
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vai trò hệ thống</label>
                  <select 
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                  >
                    {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phòng ban</label>
                  <select 
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                  >
                    <option value="">Ban Lãnh đạo</option>
                    {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 mt-auto">
                <button 
                  onClick={handleSave}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  <Save size={18} /> {editingId ? 'Cập nhật' : 'Xác nhận lưu'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
