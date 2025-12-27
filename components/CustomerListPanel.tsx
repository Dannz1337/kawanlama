
import React from 'react';
import { Customer } from '../types';

interface CustomerListPanelProps {
  customers: Customer[];
  onSelect: (customer: Customer) => void;
}

const CustomerListPanel: React.FC<CustomerListPanelProps> = ({ customers, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-black flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b-2 border-black bg-black text-white flex items-center justify-between">
        <h2 className="font-black text-sm uppercase tracking-widest flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Database Penyewa
        </h2>
        <span className="text-[10px] font-black bg-gray-800 px-2 py-1 rounded uppercase">{customers.length} Orang</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50 max-h-[500px]">
        {customers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-xs font-bold uppercase tracking-wider">Database Kosong.</p>
          </div>
        ) : (
          customers.sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()).map(customer => (
            <div 
              key={customer.id} 
              className="bg-white p-3 rounded-lg border-2 border-gray-200 hover:border-black transition-all group cursor-pointer"
              onClick={() => onSelect(customer)}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{customer.id}</span>
                <span className="text-[10px] font-bold text-gray-400 italic">Last: {new Date(customer.lastVisit).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="text-sm font-black text-black uppercase">{customer.name}</div>
              <div className="text-[10px] text-gray-500 mt-1 line-clamp-1 italic font-medium uppercase">{customer.address}</div>
              <div className="text-xs text-black mt-2 font-black font-mono tracking-widest">{customer.phone}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerListPanel;
