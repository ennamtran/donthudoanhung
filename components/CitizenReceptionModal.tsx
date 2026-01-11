import React from 'react';
import { X, Calendar, User, Clock, MapPin, Info, Landmark } from 'lucide-react';

interface CitizenReceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CitizenReceptionModal: React.FC<CitizenReceptionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const schedules = [
    {
      role: 'Chủ tịch UBND xã',
      name: 'Đinh Quốc Toàn',
      time: 'Thứ 3 hàng tuần',
      location: 'Phòng Tiếp công dân - Trụ sở UBND xã',
      icon: <User className="text-blue-600" size={24} />,
      badge: 'Chính quyền'
    },
    {
      role: 'Bí thư Đảng ủy xã',
      name: 'Nguyễn Văn A (Dự kiến)',
      time: 'Ngày 25 hàng tháng',
      location: 'Phòng Tiếp công dân - Trụ sở Đảng ủy xã',
      icon: <Landmark className="text-red-600" size={24} />,
      badge: 'Đảng ủy'
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Calendar size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase leading-none tracking-tight">Lịch tiếp công dân</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">UBND xã Đoan Hùng</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            {schedules.map((item, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
                
                <div className="flex gap-4 relative z-10">
                  <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-md shrink-0 border border-slate-100">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.badge}</p>
                      <span className="text-[9px] font-bold bg-white px-2 py-1 rounded-lg border border-slate-200 text-slate-500">Định kỳ</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 leading-tight mb-1">{item.role}</h4>
                    <p className="text-sm font-bold text-slate-500 mb-4 italic">{item.name}</p>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-3 text-slate-600 bg-white/60 p-2 rounded-xl border border-slate-100/50">
                        <Clock size={16} className="text-blue-500" />
                        <span className="text-xs font-bold">{item.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600 bg-white/60 p-2 rounded-xl border border-slate-100/50">
                        <MapPin size={16} className="text-blue-500" />
                        <span className="text-xs font-bold truncate">{item.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex gap-4">
            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
              <Info size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-indigo-900 uppercase">Ghi chú quan trọng</p>
              <p className="text-[11px] text-indigo-700 leading-relaxed">
                Trường hợp trùng vào ngày nghỉ, ngày lễ hoặc có công việc đột xuất, lịch tiếp công dân sẽ được dời sang ngày làm việc kế tiếp hoặc có thông báo riêng tại bảng tin điện tử của xã.
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Cổng thông tin điện tử UBND xã Đoan Hùng</p>
        </div>
      </div>
    </div>
  );
};