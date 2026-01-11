
import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Smartphone, Info, Share2, Download } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <QrCode size={20} />
            </div>
            <h3 className="font-black text-slate-800 tracking-tight">Chia sẻ ứng dụng</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center space-y-8">
          <div className="p-4 bg-white rounded-3xl border-4 border-slate-50 shadow-inner relative group">
            <img src={qrUrl} alt="QR Code" className="w-48 h-48 md:w-56 md:h-56" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
               <Smartphone className="text-blue-600 animate-bounce" size={48} />
            </div>
          </div>

          <div className="w-full space-y-4 text-center">
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-800">Quét mã để mở trên điện thoại</p>
              <p className="text-[11px] text-slate-400 font-medium">Dùng camera iPhone hoặc Zalo để quét</p>
            </div>

            <div className="relative group">
              <div className="w-full pl-4 pr-24 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-mono text-slate-500 overflow-hidden truncate text-left">
                {currentUrl}
              </div>
              <button 
                onClick={handleCopy}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${copied ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
              >
                {copied ? <><Check size={12} /> ĐÃ CHÉP</> : <><Copy size={12} /> SAO CHÉP</>}
              </button>
            </div>
          </div>

          <div className="w-full bg-blue-50/50 p-6 rounded-3xl border border-blue-100 space-y-4">
             <div className="flex items-center gap-3 text-blue-700">
                <Download size={18} />
                <span className="text-xs font-black uppercase tracking-tight">Hướng dẫn cài đặt (PWA)</span>
             </div>
             <ul className="text-[11px] text-slate-600 space-y-2 text-left font-medium">
                <li className="flex gap-2">
                   <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 text-blue-600 font-bold">1</span>
                   <span>Mở liên kết bằng trình duyệt <b>Safari</b> (iOS) hoặc <b>Chrome</b> (Android).</span>
                </li>
                <li className="flex gap-2">
                   <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 text-blue-600 font-bold">2</span>
                   <span>Nhấn vào <b>Chia sẻ</b> hoặc <b>Dấu 3 chấm</b>.</span>
                </li>
                <li className="flex gap-2">
                   <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 text-blue-600 font-bold">3</span>
                   <span>Chọn <b>"Thêm vào màn hình chính"</b> để sử dụng như ứng dụng thật.</span>
                </li>
             </ul>
          </div>
        </div>

        <div className="p-4 bg-slate-50 text-center">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Hệ thống hành chính số UBND xã Đoan Hùng</p>
        </div>
      </div>
    </div>
  );
};
