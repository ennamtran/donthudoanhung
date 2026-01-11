
import React from 'react';
import { Petition, PetitionStatus } from '../types';
import { Bell, X, AlertTriangle, Clock, MessageSquareQuote, ChevronRight } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  petitions: Petition[];
  onSelect: (id: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose, petitions, onSelect }) => {
  const overdue = petitions.filter(p => p.status === PetitionStatus.OVERDUE);
  const nearDeadline = petitions.filter(p => {
    if (p.status === PetitionStatus.RESOLVED || p.status === PetitionStatus.OVERDUE) return false;
    const diff = new Date(p.deadlineDate).getTime() - new Date().getTime();
    return diff > 0 && diff < (3 * 24 * 60 * 60 * 1000);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-96 bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-blue-600" />
            <h3 className="font-black text-slate-800">Trung tâm Thông báo</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {overdue.length > 0 && (
            <section>
              <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-3 ml-2">Đơn thư quá hạn ({overdue.length})</h4>
              <div className="space-y-2">
                {overdue.map(p => (
                  <button key={p.id} onClick={() => { onSelect(p.id); onClose(); }} className="w-full text-left bg-red-50 border border-red-100 p-4 rounded-2xl hover:bg-red-100 transition-all group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-black text-red-700">{p.id}</span>
                      <AlertTriangle size={14} className="text-red-500" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 mb-1">{p.petitioner.name}</p>
                    <p className="text-[10px] text-red-600 font-medium">Hạn: {p.deadlineDate} (Đã quá hạn)</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {nearDeadline.length > 0 && (
            <section>
              <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3 ml-2">Sắp đến hạn ({nearDeadline.length})</h4>
              <div className="space-y-2">
                {nearDeadline.map(p => (
                  <button key={p.id} onClick={() => { onSelect(p.id); onClose(); }} className="w-full text-left bg-amber-50 border border-amber-100 p-4 rounded-2xl hover:bg-amber-100 transition-all">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-black text-amber-700">{p.id}</span>
                      <Clock size={14} className="text-amber-500" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 mb-1">{p.petitioner.name}</p>
                    <p className="text-[10px] text-amber-600 font-medium">Chỉ còn vài ngày để giải quyết</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {overdue.length === 0 && nearDeadline.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 pt-20">
               <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center"><Bell size={32} className="opacity-20" /></div>
               <p className="text-sm font-bold tracking-tight">Không có thông báo khẩn cấp.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
