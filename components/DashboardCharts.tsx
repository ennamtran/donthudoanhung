
import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Petition, PetitionType, PetitionStatus } from '../types';
import { TrendingUp, Target, Users, Layout, Download, Filter, Calendar, Building2, FileSpreadsheet } from 'lucide-react';
import { DEPARTMENTS } from '../constants';

interface ChartsProps {
  petitions: Petition[];
}

export const DashboardCharts: React.FC<ChartsProps> = ({ petitions }) => {
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedDept, setSelectedDept] = useState<string>('all');

  // Lọc dữ liệu dựa trên các tiêu chí
  const filteredData = useMemo(() => {
    return petitions.filter(p => {
      const pDate = new Date(p.receivedDate);
      const matchMonth = selectedMonth === 'all' || (pDate.getMonth() + 1).toString() === selectedMonth;
      const matchYear = pDate.getFullYear() === selectedYear;
      const matchDept = selectedDept === 'all' || p.department === selectedDept;
      return matchMonth && matchYear && matchDept;
    });
  }, [petitions, selectedMonth, selectedYear, selectedDept]);

  // 1. Phân loại đơn (Pie Chart)
  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(p => { counts[p.type] = (counts[p.type] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // 2. Phân bổ theo đơn vị (Bar Chart)
  const departmentData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(p => { counts[p.department] = (counts[p.department] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // 3. Tỷ lệ giải quyết
  const resolutionRate = useMemo(() => {
    if (filteredData.length === 0) return 0;
    const resolved = filteredData.filter(p => p.status === PetitionStatus.RESOLVED).length;
    return Math.round((resolved / filteredData.length) * 100);
  }, [filteredData]);

  const getTypeColor = (name: string) => {
    switch (name) {
      case PetitionType.DENUNCIATION: return '#ef4444'; 
      case PetitionType.COMPLAINT: return '#f97316';    
      case PetitionType.REFLECT_PETITION: return '#22c55e'; 
      default: return '#64748b';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 shadow-2xl rounded-xl border border-slate-700">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{payload[0].name}</p>
          <p className="text-sm font-black">Số lượng: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      alert("Không có dữ liệu để xuất báo cáo!");
      return;
    }

    const headers = ["Mã đơn", "Người gửi", "Nội dung", "Loại đơn", "Đơn vị thụ lý", "Ngày tiếp nhận", "Hạn xử lý", "Trạng thái"];
    const rows = filteredData.map(p => [
      p.id,
      p.petitioner.name,
      `"${p.content.replace(/"/g, '""')}"`,
      p.type,
      p.department,
      p.receivedDate,
      p.deadlineDate,
      p.status
    ]);

    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Bao_cao_don_thu_${selectedMonth !== 'all' ? 'Thang_' + selectedMonth : 'Ca_nam'}_${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Toolbar bộ lọc */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Filter size={18} /></div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Bộ lọc báo cáo:</span>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
            <Calendar size={14} className="text-slate-400" />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-[11px] font-black uppercase outline-none text-slate-700"
            >
              <option value="all">Tất cả các tháng</option>
              {Array.from({length: 12}, (_, i) => (
                <option key={i+1} value={(i+1).toString()}>Tháng {i+1}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
            <Calendar size={14} className="text-slate-400" />
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-[11px] font-black uppercase outline-none text-slate-700"
            >
              {[currentYear, currentYear - 1, currentYear - 2].map(y => (
                <option key={y} value={y}>Năm {y}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
            <Building2 size={14} className="text-slate-400" />
            <select 
              value={selectedDept} 
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-[11px] font-black uppercase outline-none text-slate-700"
            >
              <option value="all">Tất cả đơn vị</option>
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="ml-auto">
          <p className="text-[10px] font-bold text-slate-400 italic">Hiển thị {filteredData.length} kết quả phù hợp</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tỷ lệ hoàn thành & Tổng quát */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-gradient-to-br from-[#1e40af] to-[#1e3a8a] p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Hiệu suất giải quyết</p>
                <h3 className="text-4xl font-black mt-1">{resolutionRate}%</h3>
              </div>
              <Target size={32} className="opacity-40" />
            </div>
            <div className="space-y-3">
              <div className="w-full bg-blue-900/40 h-2.5 rounded-full overflow-hidden">
                <div className="bg-white h-full transition-all duration-1000" style={{ width: `${resolutionRate}%` }}></div>
              </div>
              <p className="text-[10px] font-bold opacity-80 flex items-center gap-2">
                <TrendingUp size={12} /> Số liệu trong kỳ báo cáo đã chọn
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Layout size={18} /></div>
              <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">Cơ cấu loại đơn</h4>
            </div>
            <div className="h-[200px]">
              {typeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getTypeColor(entry.name)} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-300 text-[11px] font-bold italic">Không có dữ liệu</div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {typeData.map((item) => (
                <div key={item.name} className="flex justify-between items-center text-[10px] font-bold">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getTypeColor(item.name) }}></div>
                      <span className="text-slate-500 uppercase">{item.name}</span>
                   </div>
                   <span className="text-slate-800">{item.value} đơn</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Biểu đồ so sánh đơn vị */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col h-full min-h-[460px]">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={18} /></div>
              <div>
                <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight leading-none mb-1">Thống kê thụ lý theo đơn vị</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dữ liệu phân bổ công việc theo kỳ báo cáo</p>
              </div>
            </div>
            <div className="flex gap-2">
               <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> <span className="text-[9px] font-bold text-slate-400 uppercase">Khối lượng</span></div>
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            {departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar 
                    dataKey="value" 
                    fill="#3b82f6" 
                    radius={[8, 8, 8, 8]} 
                    barSize={45} 
                  >
                    {departmentData.map((entry, index) => (
                      <Cell 
                        key={`cell-bar-${index}`} 
                        fill={index % 2 === 0 ? '#3b82f6' : '#1e40af'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 text-[11px] font-bold italic border-2 border-dashed border-slate-50 rounded-3xl">Không tìm thấy dữ liệu phù hợp với bộ lọc</div>
            )}
          </div>
          
          <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between shadow-xl shadow-slate-200">
             <div className="flex gap-12">
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Đơn vị trọng điểm</p>
                   <p className="text-sm font-black text-blue-400">{departmentData.sort((a,b) => b.value - a.value)[0]?.name || "N/A"}</p>
                </div>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Tỷ trọng hoàn thành</p>
                   <p className="text-sm font-black text-green-400">{resolutionRate}% hồ sơ</p>
                </div>
             </div>
             <button 
              onClick={exportToCSV}
              className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg active:scale-95"
            >
               <FileSpreadsheet size={18} /> Xuất Báo cáo CSV
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
