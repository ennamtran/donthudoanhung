
import React, { useState } from 'react';
import { Petition, PetitionStatus } from '../types';
// Added X to the import list from lucide-react
import { MapPin, Info, AlertTriangle, CheckCircle2, Clock, X } from 'lucide-react';

interface MapViewProps {
  petitions: Petition[];
  onSelect: (id: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({ petitions, onSelect }) => {
  const petitionsWithCoords = petitions.filter(p => p.coordinates);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  const getStatusColor = (status: PetitionStatus) => {
    switch (status) {
      case PetitionStatus.OVERDUE: return 'bg-red-500';
      case PetitionStatus.PROCESSING: return 'bg-blue-500';
      case PetitionStatus.RESOLVED: return 'bg-green-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Bản đồ Số Vụ việc</h3>
          <p className="text-sm text-slate-500 font-medium">Giám sát địa bàn và các điểm nóng tranh chấp</p>
        </div>
        <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Quá hạn</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Đang giải quyết</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Đã giải quyết</div>
        </div>
      </div>

      <div className="flex-1 bg-slate-100 rounded-3xl relative overflow-hidden border border-slate-200 shadow-inner">
        {/* Mock Map Background - Trong thực tế sẽ dùng Leaflet/Google Maps */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 100L200 150L300 100L400 200L500 150L700 300L600 500L300 450L100 400Z" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 8"/>
            <path d="M400 0V600M0 300H800" stroke="#cbd5e1" strokeWidth="1"/>
            <circle cx="400" cy="300" r="150" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4"/>
          </svg>
        </div>

        {petitionsWithCoords.length > 0 ? petitionsWithCoords.map((p) => (
          <div 
            key={p.id}
            style={{ 
              left: `${((p.coordinates!.lng % 1) * 2000) % 90}%`, 
              top: `${((p.coordinates!.lat % 1) * 2000) % 90}%` 
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"
          >
            <button 
              onClick={() => setSelectedPin(p.id)}
              className={`p-2 rounded-full text-white shadow-xl transition-all hover:scale-125 hover:z-30 ${getStatusColor(p.status)}`}
            >
              <MapPin size={20} fill="currentColor" fillOpacity={0.3} />
            </button>

            {selectedPin === p.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-40 animate-in fade-in slide-in-from-bottom-2">
                {/* Fixed the missing 'X' icon error by importing it from lucide-react */}
                <button onClick={(e) => { e.stopPropagation(); setSelectedPin(null); }} className="absolute top-2 right-2 p-1 hover:bg-slate-100 rounded-full text-slate-400"><X size={12}/></button>
                <p className="text-[10px] font-black text-blue-600 mb-1">{p.id}</p>
                <p className="text-xs font-black text-slate-800 mb-1 truncate">{p.petitioner.name}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">"{p.summary || p.content}"</p>
                <button onClick={() => onSelect(p.id)} className="w-full py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-blue-600 transition-colors">XEM CHI TIẾT</button>
              </div>
            )}
          </div>
        )) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-4">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm"><MapPin size={32} className="opacity-20" /></div>
             <p className="text-sm font-bold tracking-tight">Chưa có vụ việc nào được xác định tọa độ.</p>
          </div>
        )}

        <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-lg space-y-2 z-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Thống kê địa bàn</p>
          <div className="flex items-center gap-3">
             <div className="text-center">
                <p className="text-lg font-black text-slate-800 leading-none">{petitionsWithCoords.length}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Điểm tin</p>
             </div>
             <div className="w-[1px] h-6 bg-slate-200"></div>
             <div className="text-center">
                <p className="text-lg font-black text-red-600 leading-none">{petitionsWithCoords.filter(p => p.status === PetitionStatus.OVERDUE).length}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Nguy cơ</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
