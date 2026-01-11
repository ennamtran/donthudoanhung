
import React, { useState, useEffect, useRef } from 'react';
import { Petition, PetitionType, PetitionStatus, User, UserRole, ProgressLog, Directive, Attachment } from '../types';
import { DEPARTMENTS, DEPARTMENTS_DATA } from '../constants';
import { analyzePetitionContent, generateDraftResponse, searchLegalGrounds } from '../services/geminiService';
import { 
  Loader2, Sparkles, X, Info, FileEdit, CheckCircle2, 
  ShieldCheck, ChevronRight, Download, Printer, UserPlus,
  ArrowRight, Save, Trash2, Gavel, FileText, Send, Stamp, Building2, Layers
} from 'lucide-react';

interface PetitionFormProps {
  initialData?: Petition;
  currentUser: User;
  onSave: (data: Partial<Petition>) => void;
  onClose: () => void;
}

export const PetitionForm: React.FC<PetitionFormProps> = ({ initialData, currentUser, onSave, onClose }) => {
  const isReceivingOfficer = currentUser.role === UserRole.RECEIVING_OFFICER;
  const isUBNDLeader = currentUser.role === UserRole.UBND_LEADER;
  const isDeptLeader = currentUser.role === UserRole.DEPT_LEADER;
  const isProcessingOfficer = currentUser.role === UserRole.PROCESSING_OFFICER;
  
  const [activeTab, setActiveTab] = useState<'info' | 'progress' | 'result'>('info');
  const [newDirective, setNewDirective] = useState('');
  const [newProgress, setNewProgress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSearchingLegal, setIsSearchingLegal] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Petition>>(initialData || {
    petitioner: { name: '', address: '', phone: '', idCard: '' },
    content: '',
    summary: '',
    type: PetitionType.REFLECT_PETITION,
    department: '',
    cooperatingDepartments: [],
    assignedOfficer: '',
    receivedDate: new Date().toISOString().split('T')[0],
    deadlineDate: '',
    status: PetitionStatus.PENDING,
    progress: [],
    directives: [],
    legalGrounds: [],
    attachments: [],
    editHistory: []
  });

  // Tự động tính hạn giải quyết dựa trên loại đơn
  useEffect(() => {
    if (formData.receivedDate && formData.type && !initialData) {
      const date = new Date(formData.receivedDate);
      const days = (formData.type === PetitionType.COMPLAINT || formData.type === PetitionType.DENUNCIATION) ? 60 : 30;
      date.setDate(date.getDate() + days);
      setFormData(prev => ({ ...prev, deadlineDate: date.toISOString().split('T')[0] }));
    }
  }, [formData.receivedDate, formData.type, initialData]);

  const isAssignedToMe = formData.assignedOfficer?.includes(currentUser.name);

  const toggleCooperatingDept = (dept: string) => {
    if (!isReceivingOfficer && !isUBNDLeader) return;
    const current = formData.cooperatingDepartments || [];
    if (current.includes(dept)) {
      setFormData({ ...formData, cooperatingDepartments: current.filter(d => d !== dept) });
    } else {
      setFormData({ ...formData, cooperatingDepartments: [...current, dept] });
    }
  };

  const handleAction = async (newStatus: PetitionStatus, logContent: string) => {
    setIsSubmitting(true);
    try {
      const updatedProgress = [...(formData.progress || [])];
      updatedProgress.push({
        id: Date.now().toString(),
        date: new Date().toLocaleString('vi-VN'),
        content: logContent,
        officer: currentUser.name,
        statusAfter: newStatus
      });
      
      onSave({ ...formData, status: newStatus, progress: updatedProgress });
      alert("Cập nhật trạng thái hồ sơ thành công!");
    } catch (e) {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIAnalyze = async () => {
    if (!formData.content) return;
    setIsAnalyzing(true);
    const result = await analyzePetitionContent(formData.content);
    if (result) {
      setFormData(prev => ({
        ...prev,
        summary: result.summary,
        type: result.type as PetitionType
      }));
    }
    setIsAnalyzing(false);
  };

  const handleLegalSearch = async () => {
    if (!formData.content) return;
    setIsSearchingLegal(true);
    const result = await searchLegalGrounds(formData.content);
    if (result) {
      setFormData(prev => ({ ...prev, legalGrounds: result.links }));
    }
    setIsSearchingLegal(false);
  };

  const handleDraftAI = async () => {
    setIsGeneratingDraft(true);
    const draft = await generateDraftResponse(formData);
    if (draft) setFormData(prev => ({ ...prev, responseDraft: draft }));
    setIsGeneratingDraft(false);
    setActiveTab('result');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-0 md:p-6 overflow-hidden">
      <div className="bg-white md:rounded-[2rem] shadow-2xl w-full max-w-6xl h-full md:max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <FileEdit size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-800 uppercase leading-none">{formData.id || "Hồ sơ mới"}</h2>
                {isAssignedToMe && isProcessingOfficer && (
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-1 shadow-sm"><ShieldCheck size={10}/> Xử lý chính</span>
                )}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Trạng thái: {formData.status}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all"><X size={24} /></button>
        </div>

        {/* Tab Navigation */}
        <div className="px-8 bg-white border-b border-slate-100 flex gap-8 shrink-0 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('info')} className={`py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${activeTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>1. Chi tiết hồ sơ</button>
          <button onClick={() => setActiveTab('progress')} className={`py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${activeTab === 'progress' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>2. Nhật ký & Chỉ đạo</button>
          <button onClick={() => setActiveTab('result')} className={`py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${activeTab === 'result' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>3. Văn bản trả lời</button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-8">
                <section className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">Thông tin công dân</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-1">Họ và tên</label>
                        <input disabled={!isReceivingOfficer && formData.status !== PetitionStatus.PENDING} value={formData.petitioner?.name} onChange={(e) => setFormData({...formData, petitioner: {...formData.petitioner!, name: e.target.value}})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-1">Số CCCD</label>
                        <input disabled={!isReceivingOfficer && formData.status !== PetitionStatus.PENDING} value={formData.petitioner?.idCard} onChange={(e) => setFormData({...formData, petitioner: {...formData.petitioner!, idCard: e.target.value}})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-1">Địa chỉ thường trú</label>
                      <input disabled={!isReceivingOfficer && formData.status !== PetitionStatus.PENDING} value={formData.petitioner?.address} onChange={(e) => setFormData({...formData, petitioner: {...formData.petitioner!, address: e.target.value}})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" />
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">Nội dung vụ việc</h3>
                    {isReceivingOfficer && (
                      <button onClick={handleAIAnalyze} disabled={isAnalyzing} className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-2 hover:bg-blue-100">
                        {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI TÓM TẮT
                      </button>
                    )}
                  </div>
                  <textarea disabled={!isReceivingOfficer && formData.status !== PetitionStatus.PENDING} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={8} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium leading-relaxed outline-none focus:ring-4 focus:ring-blue-100" placeholder="Mô tả chi tiết vụ việc..." />
                </section>
              </div>

              <div className="space-y-8">
                <section className="space-y-4">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">Phân loại & Thụ lý</h3>
                  <div className="grid grid-cols-1 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-1">Loại đơn thư</label>
                      <select disabled={!isReceivingOfficer} value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as PetitionType})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold">
                        {Object.values(PetitionType).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-2"><Building2 size={12}/> Đơn vị chuyên môn thụ lý chính</label>
                      <select disabled={!isReceivingOfficer && !isUBNDLeader} value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold">
                        <option value="">-- Chọn đơn vị thụ lý chính --</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-2"><Layers size={12}/> Đơn vị phối hợp giải quyết</label>
                      <div className="grid grid-cols-1 gap-2 bg-white/50 p-3 rounded-xl border border-slate-200 max-h-[160px] overflow-y-auto">
                         {DEPARTMENTS.map(dept => (
                           <label key={dept} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${formData.department === dept ? 'opacity-30 pointer-events-none' : 'hover:bg-slate-100'}`}>
                             <input 
                              type="checkbox" 
                              checked={formData.cooperatingDepartments?.includes(dept)}
                              disabled={!isReceivingOfficer && !isUBNDLeader}
                              onChange={() => toggleCooperatingDept(dept)}
                              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                             />
                             <span className={`text-[11px] font-bold ${formData.cooperatingDepartments?.includes(dept) ? 'text-blue-600' : 'text-slate-600'}`}>{dept}</span>
                           </label>
                         ))}
                      </div>
                    </div>

                    {isDeptLeader && formData.status === PetitionStatus.WAITING_ASSIGNMENT && (
                      <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                        <label className="text-[9px] font-black text-blue-600 uppercase tracking-wider ml-1 flex items-center gap-1"><UserPlus size={10}/> Phân công cán bộ xử lý chính</label>
                        <select value={formData.assignedOfficer} onChange={(e) => setFormData({...formData, assignedOfficer: e.target.value})} className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm font-bold text-blue-700">
                          <option value="">-- Chọn cán bộ thụ lý --</option>
                          {formData.department && DEPARTMENTS_DATA[formData.department]?.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    )}

                    {formData.assignedOfficer && !isDeptLeader && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider ml-1">Cán bộ phụ trách</label>
                        <div className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600">{formData.assignedOfficer}</div>
                      </div>
                    )}
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">Căn cứ pháp lý gợi ý</h3>
                    <button onClick={handleLegalSearch} disabled={isSearchingLegal} className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center gap-2 hover:bg-indigo-100">
                      {isSearchingLegal ? <Loader2 size={12} className="animate-spin" /> : <Gavel size={12} />} TRA CỨU LUẬT
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.legalGrounds?.map((lg, i) => (
                      <a key={i} href={lg.uri} target="_blank" rel="noreferrer" className="block p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                        <p className="text-[11px] font-bold text-slate-700 line-clamp-1">{lg.title}</p>
                        <p className="text-[9px] text-blue-500 mt-1 truncate">{lg.uri}</p>
                      </a>
                    ))}
                    {!formData.legalGrounds?.length && <p className="text-[10px] text-slate-400 font-medium italic text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">Nhấn tra cứu để AI gợi ý các văn bản luật liên quan</p>}
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-10">
              {/* Lãnh đạo UBND xã cho ý kiến chỉ đạo */}
              {isUBNDLeader && (
                <section className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-200">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Stamp size={18}/> Ý kiến chỉ đạo của Lãnh đạo UBND</h3>
                  <div className="space-y-4">
                    <textarea value={newDirective} onChange={(e) => setNewDirective(e.target.value)} rows={3} className="w-full bg-blue-700/50 border border-blue-400/30 rounded-2xl p-5 text-sm font-medium placeholder:text-blue-300 outline-none focus:ring-4 focus:ring-blue-400/20" placeholder="Nhập bút phê chỉ đạo xử lý vụ việc..." />
                    <button onClick={() => {
                      if (!newDirective.trim()) return;
                      const directive: Directive = { id: Date.now().toString(), date: new Date().toLocaleString('vi-VN'), leaderName: currentUser.name, content: newDirective };
                      setFormData({...formData, directives: [...(formData.directives || []), directive]});
                      setNewDirective('');
                    }} className="px-6 py-3 bg-white text-blue-700 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-50 transition-all">LƯU CHỈ ĐẠO</button>
                  </div>
                </section>
              )}

              {/* Tiến trình xử lý của cán bộ */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-6">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">Nhật ký xử lý hồ sơ</h3>
                  
                  {isProcessingOfficer && isAssignedToMe && (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center gap-2 mb-2 text-blue-600 font-black text-[10px] uppercase"><CheckCircle2 size={16}/> Cập nhật tiến độ mới</div>
                      <textarea value={newProgress} onChange={(e) => setNewProgress(e.target.value)} rows={3} className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100" placeholder="Nêu các bước đã thực hiện (xác minh hiện trường, đối thoại...)" />
                      <button onClick={() => {
                        if (!newProgress.trim()) return;
                        const log: ProgressLog = { id: Date.now().toString(), date: new Date().toLocaleString('vi-VN'), content: newProgress, officer: currentUser.name };
                        setFormData({...formData, progress: [...(formData.progress || []), log]});
                        setNewProgress('');
                      }} className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">LƯU NHẬT KÝ</button>
                    </div>
                  )}

                  <div className="relative pl-6 space-y-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                    {formData.progress?.slice().reverse().map((log) => (
                      <div key={log.id} className="relative">
                        <div className="absolute -left-[27px] top-1 w-3 h-3 bg-white border-2 border-blue-600 rounded-full"></div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{log.date}</span>
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{log.officer}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">{log.content}</p>
                      </div>
                    ))}
                    {!formData.progress?.length && <p className="text-xs text-slate-400 italic">Chưa có nhật ký xử lý.</p>}
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">Chỉ đạo từ lãnh đạo</h3>
                  <div className="space-y-4">
                    {formData.directives?.map((d) => (
                      <div key={d.id} className="bg-white p-5 rounded-2xl border-l-4 border-blue-600 shadow-sm space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[11px] font-black text-blue-600 uppercase">{d.leaderName}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">{d.date}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800 leading-relaxed italic">"{d.content}"</p>
                      </div>
                    ))}
                    {!formData.directives?.length && <p className="text-xs text-slate-400 italic py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">Chưa có ý kiến chỉ đạo.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'result' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <section className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-400 mb-1">Dự thảo văn bản trả lời công dân</h3>
                      <p className="text-sm text-slate-400 font-medium">Bản thảo chuẩn hành chính do chuyên gia AI soạn thảo</p>
                    </div>
                    {isProcessingOfficer && (
                      <button onClick={handleDraftAI} disabled={isGeneratingDraft} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40">
                        {isGeneratingDraft ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} SOẠN THẢO VỚI AI
                      </button>
                    )}
                  </div>
                  
                  <textarea value={formData.responseDraft} onChange={(e) => setFormData({...formData, responseDraft: e.target.value})} rows={15} className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-sm font-medium leading-relaxed font-mono outline-none focus:ring-4 focus:ring-blue-500/20" placeholder="Văn bản trả lời sẽ xuất hiện tại đây sau khi soạn thảo..." />
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all"><Printer size={18}/></button>
                    <button className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all"><Download size={18}/></button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex flex-wrap justify-between items-center gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => onSave(formData)} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all"><Save size={16}/> Lưu tạm</button>
            {isUBNDLeader && (
              <button onClick={() => { if(confirm('Xác nhận xóa hồ sơ?')) { /* Xử lý xóa */ } }} className="flex items-center gap-2 px-4 py-3 bg-white border border-red-100 rounded-xl font-black text-[10px] uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"><Trash2 size={16}/></button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Tiếp nhận đơn -> Trình UBND duyệt */}
            {isReceivingOfficer && formData.status === PetitionStatus.PENDING && (
              <button onClick={() => handleAction(PetitionStatus.WAITING_APPROVAL, "Hồ sơ được trình Lãnh đạo UBND xã phê duyệt nội dung.")} className="flex items-center gap-3 px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.15em] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all group">TRÌNH LÃNH ĐẠO UBND <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/></button>
            )}

            {/* Lãnh đạo UBND duyệt -> Chuyển Phòng phân công */}
            {isUBNDLeader && formData.status === PetitionStatus.WAITING_APPROVAL && (
              <div className="flex gap-2">
                <button onClick={() => handleAction(PetitionStatus.WAITING_ASSIGNMENT, "Lãnh đạo UBND xã đã phê duyệt và chuyển bộ phận chuyên môn xử lý.")} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200"><CheckCircle2 size={16}/> PHÊ DUYỆT</button>
                <button onClick={() => handleAction(PetitionStatus.PENDING, "Yêu cầu bổ sung thêm thông tin hồ sơ.")} className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-red-100">TRẢ LẠI</button>
              </div>
            )}

            {/* Lãnh đạo Phòng phân công -> Cán bộ xử lý */}
            {isDeptLeader && formData.status === PetitionStatus.WAITING_ASSIGNMENT && (
              <button disabled={!formData.assignedOfficer} onClick={() => handleAction(PetitionStatus.PROCESSING, `Giao cán bộ ${formData.assignedOfficer} chủ trì giải quyết.`)} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.15em] shadow-xl shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50">PHÂN CÔNG CÁN BỘ <UserPlus size={18}/></button>
            )}

            {/* Cán bộ hoàn thành hồ sơ -> Trình duyệt đóng */}
            {isProcessingOfficer && isAssignedToMe && formData.status === PetitionStatus.PROCESSING && (
              <button onClick={() => handleAction(PetitionStatus.WAITING_CLOSURE, "Đã hoàn thành xác minh và dự thảo văn bản, trình Lãnh đạo duyệt đóng hồ sơ.")} className="flex items-center gap-3 px-8 py-3 bg-amber-600 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.15em] shadow-xl shadow-amber-200 hover:bg-amber-700 transition-all group">TRÌNH DUYỆT HOÀN THÀNH <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/></button>
            )}

            {/* Lãnh đạo UBND duyệt đóng -> Hoàn thành */}
            {isUBNDLeader && formData.status === PetitionStatus.WAITING_CLOSURE && (
              <button onClick={() => handleAction(PetitionStatus.RESOLVED, "Vụ việc đã được giải quyết dứt điểm, văn bản trả lời đã gửi công dân.")} className="flex items-center gap-2 px-10 py-3 bg-green-600 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.15em] shadow-xl shadow-green-200 hover:bg-green-700"><CheckCircle2 size={20}/> HOÀN THÀNH & ĐÓNG HỒ SƠ</button>
            )}
            
            {formData.status === PetitionStatus.RESOLVED && (
              <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase bg-green-50 px-6 py-3 rounded-xl border border-green-100">
                <CheckCircle2 size={18} /> Hồ sơ đã kết thúc giải quyết
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
