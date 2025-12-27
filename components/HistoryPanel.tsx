
import React from 'react';
import { Order } from '../types';

interface HistoryPanelProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ orders, onSelectOrder, onDeleteOrder }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-black flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right duration-300">
      <div className="p-6 border-b-4 border-black bg-black text-white flex items-center justify-between">
        <h2 className="font-black text-sm uppercase tracking-[0.3em] flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[#ff4d00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Riwayat Nota
        </h2>
        <span className="text-[10px] font-black bg-white text-black px-3 py-1 rounded-full uppercase">{orders.length} Trx</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50 max-h-[600px]">
        {orders.length === 0 ? (
          <div className="text-center py-24 opacity-20">
            <svg className="w-16 h-16 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
            <p className="text-sm font-black uppercase tracking-widest">Belum Ada Transaksi</p>
          </div>
        ) : (
          orders.map(order => (
            <div 
              key={order.id} 
              className="bg-white p-5 rounded-3xl border-4 border-black/5 hover:border-black hover:shadow-xl transition-all group cursor-pointer relative transform hover:-translate-y-1"
              onClick={() => onSelectOrder(order)}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg uppercase tracking-tight border border-orange-100">{order.id}</span>
                <span className="text-[10px] font-bold text-gray-400">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="text-lg font-[1000] text-black uppercase truncate pr-10 tracking-tight">{order.namaPenyewa}</div>
              <div className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wide">{order.jenisMobil} • <span className="text-black font-black">{order.nopol}</span></div>
              <div className="text-base text-black mt-4 flex justify-between items-center font-[1000] font-mono border-t border-gray-100 pt-3">
                <span className="text-xl">Rp {order.total.toLocaleString('id-ID')}</span>
                <div className="flex items-center text-[10px] text-gray-500 font-black bg-gray-100 px-3 py-1.5 rounded-full uppercase">
                   {order.jumlahHari} Hari Sewa
                </div>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteOrder(order.id); }}
                className="absolute top-5 right-5 text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-125"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
