console.log(import.meta.env.VITE_GEMINI_API_KEY)
import React, { useState, useEffect } from 'react';
import ReceiptForm from './components/ReceiptForm';
import ReceiptPreview from './components/ReceiptPreview';
import HistoryPanel from './components/HistoryPanel';
import CustomerListPanel from './components/CustomerListPanel';
import { ReceiptData, Order, Customer } from './types';

// Declare html2pdf for TypeScript
declare var html2pdf: any;

const INITIAL_DATA: ReceiptData = {
  namaPenyewa: '',
  alamatRumah: '',
  telp: '',
  jenisMobil: '',
  nopol: '',
  tanggalMulai: '',
  pukulMulai: '',
  tanggalSelesai: '',
  pukulSelesai: '',
  pemakaian: '',
  jumlahHari: 1,
  tarif24Jam: '',
  uangMuka: '',
  jaminan: '',
  tujuanSewa: '',
  jasaSopir: '',
  jasaAntar: '',
  overtime: '',
  total: 0,
  lokasi: 'Candi'
};

const App: React.FC = () => {
  const [data, setData] = useState<ReceiptData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rightPanelTab, setRightPanelTab] = useState<'history' | 'customers'>('history');

  useEffect(() => {
    loadOrders();
    loadCustomers();
  }, []);

  const loadOrders = () => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(allOrders);
  };

  const loadCustomers = () => {
    const allCustomers: Customer[] = JSON.parse(localStorage.getItem('customers') || '[]');
    setCustomers(allCustomers);
  };

  const downloadPDF = async (shouldPrint = false) => {
    const element = document.getElementById('receipt-preview');
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `Nota_KL_${data.namaPenyewa || 'Rental'}_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 3, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all'] }
    };

    if (shouldPrint) {
      html2pdf().from(element).set(opt).toPdf().get('pdf').then((pdf: any) => {
        const blobUrl = URL.createObjectURL(pdf.output('blob'));
        window.open(blobUrl, '_blank');
      });
    } else {
      html2pdf().from(element).set(opt).save();
    }
  };

  const saveOrder = () => {
    if (!data.namaPenyewa || !data.jenisMobil) {
      alert("Nama penyewa dan jenis mobil harus diisi!");
      return;
    }

    const allOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
    const newOrder: Order = {
      ...data,
      id: `KL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      createdAt: new Date().toISOString()
    };
    
    const updatedOrders = [newOrder, ...allOrders];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    syncCustomer(data);
    
    setActiveTab('preview');
    setTimeout(() => {
      downloadPDF(false);
      alert('Nota Berhasil disimpan ke Riwayat dan diunduh!');
    }, 500);
  };

  const syncCustomer = (receipt: ReceiptData) => {
    const allCustomers: Customer[] = JSON.parse(localStorage.getItem('customers') || '[]');
    const existingIndex = allCustomers.findIndex(c => c.name.toLowerCase() === receipt.namaPenyewa.toLowerCase());
    
    if (existingIndex > -1) {
      allCustomers[existingIndex] = {
        ...allCustomers[existingIndex],
        address: receipt.alamatRumah,
        phone: receipt.telp,
        lastVisit: new Date().toISOString()
      };
    } else {
      const newCustomer: Customer = {
        id: `CUST-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        name: receipt.namaPenyewa,
        address: receipt.alamatRumah,
        phone: receipt.telp,
        lastVisit: new Date().toISOString()
      };
      allCustomers.push(newCustomer);
    }
    
    localStorage.setItem('customers', JSON.stringify(allCustomers));
    setCustomers(allCustomers);
  };

  const deleteOrder = (orderId: string) => {
    if (confirm('Hapus nota ini dari riwayat?')) {
      const allOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedAll = allOrders.filter(o => o.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(updatedAll));
      setOrders(updatedAll);
    }
  };

  const handlePrint = () => {
    setActiveTab('preview');
    setTimeout(() => {
      downloadPDF(true);
    }, 500);
  };

  const resetForm = () => {
    if (confirm('Bersihkan data dan buat nota baru?')) {
      setData(INITIAL_DATA);
      setActiveTab('form');
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setData({
      ...data,
      namaPenyewa: customer.name,
      alamatRumah: customer.address,
      telp: customer.phone
    });
    setActiveTab('form');
  };

  const handleSelectOrder = (order: Order) => {
    setData(order);
    setActiveTab('preview');
  };

  const Logo = () => (
    <div className="flex flex-col items-center md:items-start select-none group">
      <div className="flex items-center">
        <div className="relative bg-gradient-to-br from-[#ff4d00] to-[#ff0000] text-white px-6 py-3 rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-md rounded-bl-md font-black italic text-5xl tracking-tighter leading-none shadow-2xl transform transition-transform group-hover:scale-105">
          KL
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col space-y-1.5 opacity-70">
             <div className="w-8 h-1.5 bg-[#ff4d00] rounded-full"></div>
             <div className="w-12 h-1.5 bg-[#ff4d00] rounded-full"></div>
             <div className="w-6 h-1.5 bg-[#ff4d00] rounded-full"></div>
          </div>
        </div>
        <div className="flex flex-col leading-none ml-6">
          <span className="text-[#e60000] font-[1000] text-4xl tracking-tighter italic uppercase">CV. KAWAN LAMA</span>
          <span className="text-gray-400 text-[11px] font-bold tracking-[0.6em] uppercase mt-2">Professional Rental Management</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto p-6 md:p-12 animate-in fade-in duration-500">
      <header className="no-print flex flex-col xl:flex-row xl:items-center justify-between mb-16 space-y-8 xl:space-y-0 pb-10 border-b-4 border-black/5">
        <Logo />
        <div className="flex flex-wrap gap-5">
           <button 
             onClick={resetForm}
             className="bg-white text-black border-[3px] border-black px-10 py-5 rounded-[1.5rem] font-[1000] text-lg hover:bg-gray-50 transition-all flex items-center shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none modern-curve"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
             </svg>
             NOTA BARU
           </button>
           <button 
             onClick={saveOrder}
             className="bg-[#00c853] text-white px-10 py-5 rounded-[1.5rem] font-[1000] text-lg hover:bg-[#00a844] transition-all flex items-center shadow-[6px_6px_0px_rgba(0,0,0,0.2)] active:translate-x-1 active:translate-y-1 active:shadow-none modern-curve"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
             </svg>
             SIMPAN & UNDUH
           </button>
           <button 
             onClick={handlePrint}
             className="bg-black text-white px-10 py-5 rounded-[1.5rem] font-[1000] text-lg hover:bg-zinc-800 transition-all flex items-center shadow-[6px_6px_0px_rgba(0,0,0,0.2)] active:translate-x-1 active:translate-y-1 active:shadow-none modern-curve"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 012-2H5a2 2 0 012 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
             </svg>
             CETAK SEKARANG
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          <div className="no-print mb-8 flex bg-white p-2 rounded-[1.5rem] border-4 border-black shadow-lg w-fit">
            <button 
              onClick={() => setActiveTab('form')}
              className={`px-10 py-4 font-[1000] text-lg rounded-2xl transition-all ${activeTab === 'form' ? 'bg-black text-white shadow-xl transform scale-105' : 'text-gray-400 hover:text-black'}`}
            >
              INPUT DATA
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`px-10 py-4 font-[1000] text-lg rounded-2xl transition-all ${activeTab === 'preview' ? 'bg-black text-white shadow-xl transform scale-105' : 'text-gray-400 hover:text-black'}`}
            >
              PREVIEW NOTA
            </button>
          </div>

          <div className={activeTab === 'form' ? 'block' : 'hidden lg:block'}>
            <ReceiptForm data={data} onChange={setData} customers={customers} />
          </div>

          <div id="receipt-preview-container" className={`${activeTab === 'preview' ? 'block' : 'hidden lg:block'} pt-4 lg:pt-0`}>
            <div id="receipt-preview">
              <ReceiptPreview data={data} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 no-print">
          <div className="sticky top-12 space-y-10">
            <div className="flex p-2 bg-white rounded-[2rem] border-4 border-black shadow-lg">
              <button 
                onClick={() => setRightPanelTab('history')}
                className={`flex-1 py-4 text-sm font-[1000] rounded-2xl transition-all ${rightPanelTab === 'history' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
              >
                RIWAYAT
              </button>
              <button 
                onClick={() => setRightPanelTab('customers')}
                className={`flex-1 py-4 text-sm font-[1000] rounded-2xl transition-all ${rightPanelTab === 'customers' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
              >
                PELANGGAN
              </button>
            </div>

            {rightPanelTab === 'history' ? (
              <HistoryPanel 
                orders={orders} 
                onSelectOrder={handleSelectOrder} 
                onDeleteOrder={deleteOrder}
              />
            ) : (
              <CustomerListPanel 
                customers={customers} 
                onSelect={handleSelectCustomer}
              />
            )}
          </div>
        </div>
      </div>

      <footer className="no-print mt-32 py-16 border-t-8 border-black/5 text-center text-black font-black text-sm tracking-[0.5em] uppercase opacity-50">
        &copy; {new Date().getFullYear()} CV. KAWAN LAMA SIDOARJO • PREMIUM RENTAL MANAGEMENT
      </footer>
    </div>
  );
};

export default App;
