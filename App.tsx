
import React, { useState, useMemo, useEffect } from 'react';
import { Petition, PetitionStatus, DashboardStats, User, UserRole } from './types';
import { MOCK_DATA, USERS } from './constants';
import { StatCards } from './components/StatCards';
import { PetitionTable } from './components/PetitionTable';
import { PetitionForm } from './components/PetitionForm';
import { DashboardCharts } from './components/DashboardCharts';
import { NotificationDrawer } from './components/NotificationDrawer';
import { QRCodeModal } from './components/QRCodeModal';
import { CitizenReceptionModal } from './components/CitizenReceptionModal';
import { SettingsModal } from './components/SettingsModal';
import { PersonnelModal } from './components/PersonnelModal';
import { Login } from './components/Login';
import { 
  PlusCircle, Search, Menu, Bell, 
  Settings, LogOut, UserCog, PieChart, Clock, Stamp, 
  UserCheck, CheckCircle2, FileSearch, Calendar, Contact,
  QrCode, Filter, RefreshCcw, Users, ShieldAlert
} from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [systemUsers, setSystemUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('system_users_data');
    return saved ? JSON.parse(saved) : USERS;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'list'>('list');
  const [filterStatus, setFilterStatus] = useState<PetitionStatus | 'all' | 'nearDeadline'>(PetitionStatus.PROCESSING);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isReceptionModalOpen, setIsReceptionModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPersonnelOpen, setIsPersonnelOpen] = useState(false);
  
  const [editingPetition, setEditingPetition] = useState<Petition | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('current_user_profile');
    if (savedUser) return JSON.parse(savedUser);
    return systemUsers[3]; // Cán bộ tiếp nhận mặc định
  }); 

  const canManagePersonnel = currentUser.name === 'Nguyễn Hùng Phong' || currentUser.role === UserRole.UBND_LEADER;

  useEffect(() => {
    const savedData = localStorage.getItem('petitions_data');
    if (savedData) {
      try { 
        const parsed = JSON.parse(savedData);
        setPetitions(Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_DATA);
      } catch (e) { setPetitions(MOCK_DATA); }
    } else {
      setPetitions(MOCK_DATA);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('petitions_data', JSON.stringify(petitions));
    localStorage.setItem('system_users_data', JSON.stringify(systemUsers));
  }, [petitions, systemUsers]);

  const stats: DashboardStats = useMemo(() => {
    const today = new Date();
    let nearDeadlineCount = 0;
    const updatedStats = {
      total: petitions.length,
      pending: petitions.filter(p => p.status === PetitionStatus.PENDING).length,
      waitingApproval: petitions.filter(p => p.status === PetitionStatus.WAITING_APPROVAL).length,
      waitingAssignment: petitions.filter(p => p.status === PetitionStatus.WAITING_ASSIGNMENT).length,
      processing: petitions.filter(p => p.status === PetitionStatus.PROCESSING).length,
      waitingClosure: petitions.filter(p => p.status === PetitionStatus.WAITING_CLOSURE).length,
      resolved: petitions.filter(p => p.status === PetitionStatus.RESOLVED).length,
      overdue: petitions.filter(p => p.status !== PetitionStatus.RESOLVED && new Date(p.deadlineDate) < today).length,
      nearDeadline: 0
    };
    petitions.forEach(p => {
      if (p.status !== PetitionStatus.RESOLVED) {
        const deadline = new Date(p.deadlineDate);
        const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 3 && diffDays >= 0) nearDeadlineCount++;
      }
    });
    updatedStats.nearDeadline = nearDeadlineCount;
    return updatedStats;
  }, [petitions]);

  const filteredPetitions = useMemo(() => {
    return petitions.filter(p => {
      if (currentUser.role === UserRole.PROCESSING_OFFICER) {
        if (!p.assignedOfficer?.includes(currentUser.name)) return false;
      }
      if (currentUser.role === UserRole.DEPT_LEADER) {
        if (p.department !== currentUser.department) return false;
      }
      const matchSearch = p.petitioner.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
      let matchStatus = filterStatus === 'all' ? true : (filterStatus === 'nearDeadline' ? true : p.status === filterStatus);
      return matchSearch && matchStatus;
    });
  }, [petitions, searchTerm, filterStatus, currentUser]);

  if (!isAuthenticated) {
    return <Login onLogin={(user) => { setCurrentUser(user); setIsAuthenticated(true); }} onUpdateUser={(u) => setSystemUsers(prev => prev.map(user => user.id === u.id ? u : user))} />;
  }

  const handleSavePetition = (data: Partial<Petition>) => {
    if (editingPetition) {
      setPetitions(prev => prev.map(p => p.id === editingPetition.id ? { ...p, ...data } as Petition : p));
    } else {
      const newId = `DT-2025-${String(petitions.length + 1).padStart(3, '0')}`;
      setPetitions(prev => [{ ...data, id: newId } as Petition, ...prev]);
    }
    setIsFormOpen(false);
    setEditingPetition(undefined);
  };

  // Fix: Added handleEdit to process opening an existing petition for editing/viewing
  const handleEdit = (id: string) => {
    const p = petitions.find(item => item.id === id);
    if (p) {
      setEditingPetition(p);
      setIsFormOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden font-inter text-slate-900">
      <aside className={`${sidebarOpen ? 'w-[280px]' : 'w-0'} bg-white flex flex-col border-r border-slate-200 transition-all duration-300 overflow-hidden shrink-0 z-[60] shadow-sm`}>
        <div className="bg-[#1e40af] p-6 text-white shrink-0">
           <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-xl font-black shrink-0 shadow-lg overflow-hidden">
                 {currentUser.avatar ? <img src={currentUser.avatar} className="w-full h-full object-cover" /> : currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                 <h2 className="font-bold text-[14px] truncate leading-tight tracking-tight">{currentUser.name}</h2>
                 <p className="text-[9px] text-blue-200 uppercase font-black truncate mt-1 bg-white/10 px-2 py-0.5 rounded-md inline-block">{currentUser.role}</p>
              </div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto py-5 custom-scrollbar">
           <nav className="px-3 space-y-1">
              <div className="py-2 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quy trình xử lý</div>
              {[
                { id: PetitionStatus.PENDING, label: 'Mới tiếp nhận', icon: <PlusCircle size={18} />, count: stats.pending, color: 'text-slate-600' },
                { id: PetitionStatus.WAITING_APPROVAL, label: 'Trình lãnh đạo UBND', icon: <Stamp size={18} />, count: stats.waitingApproval, color: 'text-purple-600' },
                { id: PetitionStatus.WAITING_ASSIGNMENT, label: 'Lãnh đạo phòng duyệt', icon: <UserCheck size={18} />, count: stats.waitingAssignment, color: 'text-indigo-600' },
                { id: PetitionStatus.PROCESSING, label: 'Đang thụ lý', icon: <Clock size={18} />, count: stats.processing, color: 'text-blue-600' },
                { id: PetitionStatus.RESOLVED, label: 'Đã hoàn thành', icon: <CheckCircle2 size={18} />, count: stats.resolved, color: 'text-green-600' },
              ].map((item) => (
                <button key={item.id} onClick={() => { setActiveTab('list'); setFilterStatus(item.id as PetitionStatus); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === 'list' && filterStatus === item.id ? 'bg-blue-50 text-[#1e40af]' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <span className={activeTab === 'list' && filterStatus === item.id ? item.color : 'text-slate-400'}>{item.icon}</span>
                    <span className="text-[13px] font-bold">{item.label}</span>
                  </div>
                  {item.count > 0 && <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500">{item.count}</span>}
                </button>
              ))}

              <div className="pt-6 pb-2 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thống kê</div>
              <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-50 text-[#1e40af]' : 'text-slate-600 hover:bg-slate-50'}`}>
                 <PieChart size={18} className={activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'} />
                 <span className="text-[13px] font-bold">Báo cáo tổng hợp</span>
              </button>

              {canManagePersonnel && (
                <button onClick={() => setIsPersonnelOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50 text-indigo-700 shadow-sm transition-all border border-indigo-100 mt-4">
                   <Users size={18} className="text-indigo-600" />
                   <span className="text-[13px] font-black">QUẢN LÝ NHÂN SỰ</span>
                </button>
              )}
           </nav>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
           <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
              <LogOut size={18} />
              <span className="text-[13px] font-bold">Đăng xuất</span>
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        <header className="bg-[#1e40af] h-16 shrink-0 flex items-center px-6 justify-between text-white z-50">
           <div className="flex items-center gap-5">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 hover:bg-white/10 rounded-xl transition-all"><Menu size={22} /></button>
              <h1 className="text-base font-black tracking-tight uppercase truncate">QUẢN LÝ ĐƠN THƯ XÃ ĐOAN HÙNG</h1>
           </div>
           <div className="flex items-center gap-2">
              <button onClick={() => setIsQRModalOpen(true)} className="p-2.5 hover:bg-white/10 rounded-xl transition-all"><QrCode size={20} /></button>
              <button onClick={() => setIsNotifOpen(true)} className="relative p-2.5 hover:bg-white/10 rounded-xl transition-all">
                 <Bell size={20} />
                 {stats.overdue > 0 && <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1e40af] animate-pulse"></span>}
              </button>
              <button onClick={() => setIsSettingsOpen(true)} className="p-2.5 hover:bg-white/10 rounded-xl transition-all"><Settings size={20} /></button>
           </div>
        </header>

        <div className="bg-[#1e40af] pb-8 px-6 shrink-0 flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Tìm người gửi, nội dung đơn..." className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl text-slate-800 text-sm font-semibold outline-none shadow-xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
           </div>
           {currentUser.role === UserRole.RECEIVING_OFFICER && (
             <button onClick={() => { setEditingPetition(undefined); setIsFormOpen(true); }} className="flex-1 md:flex-none bg-white text-[#1e40af] px-6 py-3.5 rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-50 shadow-2xl">
                <PlusCircle size={20} /> Tiếp nhận đơn mới
             </button>
           )}
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col -mt-4 rounded-t-[2.5rem] bg-[#f8fafc] shadow-2xl z-40 overflow-hidden">
           {activeTab === 'dashboard' ? (
              <div className="p-8 space-y-10 animate-in fade-in overflow-y-auto"><StatCards stats={stats} /><DashboardCharts petitions={petitions} /></div>
           ) : (
              <div className="flex flex-col h-full bg-white overflow-hidden">
                 <div className="flex-1 overflow-y-auto">
                    <PetitionTable petitions={filteredPetitions} onEdit={handleEdit} onDelete={(id) => setPetitions(prev => prev.filter(p => p.id !== id))} currentUserRole={currentUser.role} currentUserName={currentUser.name} onView={handleEdit} />
                 </div>
              </div>
           )}
        </div>
      </main>

      {isFormOpen && <PetitionForm initialData={editingPetition} currentUser={currentUser} onSave={handleSavePetition} onClose={() => { setIsFormOpen(false); setEditingPetition(undefined); }} />}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} petitions={petitions} onSelect={handleEdit} />
      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
      <CitizenReceptionModal isOpen={isReceptionModalOpen} onClose={() => setIsReceptionModalOpen(false)} />
      {isSettingsOpen && <SettingsModal user={currentUser} onClose={() => setIsSettingsOpen(false)} onUpdate={(u) => { setCurrentUser(u); setSystemUsers(prev => prev.map(user => user.id === u.id ? u : user)); }} />}
      <PersonnelModal isOpen={isPersonnelOpen} onClose={() => setIsPersonnelOpen(false)} users={systemUsers} onUpdateUsers={setSystemUsers} />
    </div>
  );
};

export default App;
