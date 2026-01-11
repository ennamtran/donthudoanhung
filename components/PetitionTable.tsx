
import React from 'react';
import { Petition, PetitionStatus, UserRole } from '../types';
import { Edit3, Trash2, AlertCircle, Clock, ShieldCheck, ArrowRight, User as UserIcon, Building2, Layers } from 'lucide-react';

interface PetitionTableProps {
  petitions: Petition[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  currentUserRole: UserRole;
  currentUserName: string;
}

export const PetitionTable: React.FC<PetitionTableProps> = ({ petitions, onEdit, onDelete, currentUserRole, currentUserName }) => {
  const canDelete = currentUserRole === UserRole.RECEIVING_OFFICER || currentUserRole === UserRole.UBND_LEADER;

  return (
    <div className="divide-y divide-slate-100 bg-white">
      {petitions.map((p) => {
        const isAssignedToMe = p.assignedOfficer?.includes(currentUserName);
        const isOverdue = p.status !== PetitionStatus.RESOLVED && new Date(p.deadlineDate) < new Date();
        const hasCoopDepts = p.cooperatingDepartments && p.cooperatingDepartments.length > 0;
        
        return (
          <div 
            key={p.id} 
            className={`flex p-6 md:p-8 hover:bg-blue-50/40 transition-all cursor-pointer group border-l-[6px] border-transparent hover:border-blue-600 relative ${isAssignedToMe ? 'bg-blue-50/15' : ''}`}
            onClick={() => onEdit(p.id)}
          >
            {/* Cột trạng thái */}
            <div className="w-14 shrink-0 flex flex-col items-center pt-2">
               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm ${isOverdue ? 'bg-red-100 text-red-600' : p.status === PetitionStatus.RESOLVED ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                 {isOverdue ? <AlertCircle size={22} /> : p.status === PetitionStatus.RESOLVED ? <ShieldCheck size={22} /> : <Clock size={22} />}
               </div>
               <div className="mt-6">
                 <input 
                   type="checkbox" 
                   className="w-5 h-5 border-2 border-slate-300 rounded-lg cursor-pointer checked:bg-blue-600 transition-all" 
                   onClick={(e) => e.stopPropagation()} 
                 />
               </div>
            </div>

            {/* Nội dung chính */}
            <div className="flex-1 px-6 space-y-4 min-w-0">
               <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-2 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded tracking-widest uppercase shadow-sm">{p.id}</span>
                      {isAssignedToMe && currentUserRole === UserRole.PROCESSING_OFFICER && (
                        <span className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight shadow-lg shadow-blue-500/20">
                          <ShieldCheck size={12} /> Đang thụ lý chính
                        </span>
                      )}
                      {isOverdue && (
                        <span className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase animate-pulse shadow-lg shadow-red-500/20">
                          <AlertCircle size={12} /> Quá hạn xử lý
                        </span>
                      )}
                    </div>
                    <h4 className="text-[16px] font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors uppercase tracking-tight truncate max-w-2xl">
                      {p.summary || p.content}
                    </h4>
                  </div>
                  <div className="hidden md:flex flex-col items-end shrink-0">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Loại đơn</span>
                    <span className="text-xs font-bold text-slate-700">{p.type}</span>
                  </div>
               </div>
               
               {/* Thông tin chi tiết */}
               <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-3 gap-x-8">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Công dân gửi đơn</span>
                     <span className="text-[12px] font-bold text-slate-800 flex items-center gap-2"><UserIcon size={14} className="text-slate-400"/> {p.petitioner.name}</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ngày tiếp nhận</span>
                     <span className="text-[12px] font-bold text-slate-700">{new Date(p.receivedDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hạn giải quyết</span>
                     <span className={`text-[12px] font-bold ${isOverdue ? 'text-red-600' : 'text-amber-600'}`}>{new Date(p.deadlineDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Building2 size={10}/> Đơn vị thụ lý</span>
                     <div className="flex flex-col gap-1">
                        <span className="text-[12px] font-bold text-slate-700 truncate">{p.department || 'Chưa phân công'}</span>
                        {hasCoopDepts && (
                          <div className="flex flex-wrap gap-1">
                            {p.cooperatingDepartments?.map(d => (
                              <span key={d} className="text-[8px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">PH: {d}</span>
                            ))}
                          </div>
                        )}
                     </div>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cán bộ thụ lý</span>
                     <span className={`text-[12px] font-bold truncate ${isAssignedToMe ? 'text-blue-600' : 'text-slate-600'}`}>
                       {p.assignedOfficer?.split(' – ')[0] || 'Chờ giao việc'}
                     </span>
                  </div>
               </div>
            </div>

            {/* Thao tác */}
            <div className="flex flex-col justify-center items-center gap-3 pl-6 opacity-0 group-hover:opacity-100 transition-all shrink-0">
               <button 
                 onClick={(e) => { e.stopPropagation(); onEdit(p.id); }} 
                 className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-90 transition-all"
                 title="Xem chi tiết & Xử lý"
               >
                  <ArrowRight size={20} />
               </button>
               {canDelete && (
                 <button 
                   onClick={(e) => { e.stopPropagation(); onDelete(p.id); }} 
                   className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-90"
                   title="Xóa hồ sơ"
                 >
                    <Trash2 size={20} />
                 </button>
               )}
            </div>
          </div>
        );
      })}

      {petitions.length === 0 && (
        <div className="p-32 text-center flex flex-col items-center gap-6 bg-white">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 shadow-inner">
             <Clock size={48} className="opacity-20" />
          </div>
          <div>
            <p className="text-slate-400 font-black text-sm uppercase tracking-[0.3em] mb-2">Hộp thư rỗng</p>
            <p className="text-slate-400 text-xs font-medium">Không tìm thấy hồ sơ đơn thư nào trong danh mục này.</p>
          </div>
        </div>
      )}
    </div>
  );
};
