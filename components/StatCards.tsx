
import React from 'react';
import { DashboardStats, PetitionStatus } from '../types';
import { Clock, CheckCircle, List, Stamp, UserCheck, FileSearch, PlusCircle } from 'lucide-react';

interface StatCardsProps {
  stats: DashboardStats;
  onCardClick?: (status: PetitionStatus | 'all' | 'nearDeadline') => void;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats, onCardClick }) => {
  const cards = [
    { id: 'all', title: 'Tổng số đơn', value: stats.total, icon: <List />, color: 'blue', label: 'Toàn bộ hồ sơ' },
    { id: PetitionStatus.PENDING, title: 'Mới tiếp nhận', value: stats.pending, icon: <PlusCircle />, color: 'slate', label: 'Cần phân loại' },
    { id: PetitionStatus.WAITING_APPROVAL, title: 'Trình lãnh đạo UBND', value: stats.waitingApproval, icon: <Stamp />, color: 'purple', label: 'Cần bút phê' },
    { id: PetitionStatus.WAITING_ASSIGNMENT, title: 'Lãnh đạo phòng duyệt', value: stats.waitingAssignment, icon: <UserCheck />, color: 'indigo', label: 'Cần giao việc' },
    { id: PetitionStatus.PROCESSING, title: 'Đang thụ lý', value: stats.processing, icon: <Clock />, color: 'blue', label: 'Đang xác minh' },
    { id: PetitionStatus.RESOLVED, title: 'Hoàn thành', value: stats.resolved, icon: <CheckCircle />, color: 'green', label: 'Đã đóng hồ sơ' },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 border-blue-100 text-blue-600';
      case 'purple': return 'bg-purple-50 border-purple-100 text-purple-600';
      case 'indigo': return 'bg-indigo-50 border-indigo-100 text-indigo-600';
      case 'orange': return 'bg-orange-50 border-orange-100 text-orange-600';
      case 'green': return 'bg-green-50 border-green-100 text-green-600';
      case 'slate': return 'bg-slate-50 border-slate-100 text-slate-600';
      default: return 'bg-slate-50 border-slate-100 text-slate-600';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
      {cards.map((card) => (
        <button 
          key={card.id} 
          onClick={() => onCardClick?.(card.id as any)}
          className={`group p-5 rounded-[1.5rem] border shadow-lg transition-all hover:-translate-y-1 active:scale-95 text-left bg-white ${getColorClasses(card.color)}`}
        >
          <div className={`mb-3 p-2 rounded-xl w-fit bg-white shadow-sm transition-all group-hover:scale-110`}>
            {React.cloneElement(card.icon as React.ReactElement, { size: 20 } as any)}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{card.title}</p>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-black text-slate-900 leading-none">{card.value}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">{card.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};