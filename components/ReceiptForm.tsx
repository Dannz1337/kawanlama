
import React, { useState, useEffect, useRef } from 'react';
import { ReceiptData, Customer } from '../types';

interface ReceiptFormProps {
  data: ReceiptData;
  onChange: (data: ReceiptData) => void;
  customers: Customer[];
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({ data, onChange, customers }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatCurrency = (val: string | number) => {
    if (val === undefined || val === null || val === "") return "";
    const str = val.toString().replace(/\D/g, "");
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseCurrency = (val: string) => {
    const cleanValue = val.replace(/\./g, "");
    return cleanValue === "" ? "" : parseFloat(cleanValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let newValue: any;

    const currencyFields = ['tarif24Jam', 'uangMuka', 'overtime', 'jasaSopir', 'jasaAntar'];
    
    if (currencyFields.includes(name)) {
      newValue = parseCurrency(value);
    } else if (type === 'number') {
      newValue = value === '' ? '' : parseFloat(value);
    } else {
      newValue = value;
    }

    let updatedData = { ...data, [name]: newValue };

    if (name === 'namaPenyewa') {
      if (typeof value === 'string' && value.length > 0) {
        const filtered = customers.filter(c => 
          c.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCustomers(filtered);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }

    const calc = (val: any) => (val === '' || isNaN(val) ? 0 : Number(val));
    if ([...currencyFields, 'jumlahHari'].includes(name)) {
      updatedData.total = (calc(updatedData.tarif24Jam) * calc(updatedData.jumlahHari)) + 
                          calc(updatedData.jasaSopir) + 
                          calc(updatedData.jasaAntar) + 
                          calc(updatedData.overtime) - 
                          calc(updatedData.uangMuka);
    }
    onChange(updatedData);
  };

  const selectCustomer = (customer: Customer) => {
    const updatedData = {
      ...data,
      namaPenyewa: customer.name,
      alamatRumah: customer.address,
      telp: customer.phone
    };
    const calc = (val: any) => (val === '' || isNaN(val) ? 0 : Number(val));
    updatedData.total = (calc(updatedData.tarif24Jam) * calc(updatedData.jumlahHari)) + 
                        calc(updatedData.jasaSopir) + 
                        calc(updatedData.jasaAntar) + 
                        calc(updatedData.overtime) - 
                        calc(updatedData.uangMuka);
    onChange(updatedData);
    setShowSuggestions(false);
  };

  // UPDATED: Larger input and label classes
  const inputClass = "w-full mt-2 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-black focus:bg-white transition-all outline-none font-black text-base md:text-lg placeholder:font-normal placeholder:text-gray-300 shadow-sm";
  const labelClass = "block text-xs md:text-sm font-black uppercase tracking-widest text-gray-500 ml-1";

  return (
    <div className="bg-white p-6 md:p-12 rounded-[3rem] shadow-2xl border-2 border-black text-black animate-in slide-in-from-bottom duration-500">
      <h2 className="text-3xl font-[1000] mb-12 border-b-8 border-black pb-6 flex items-center uppercase tracking-tighter">
        <span className="bg-black text-white p-3 rounded-2xl mr-5 shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
          </svg>
        </span>
        Input Order Rental
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Section A */}
        <div className="space-y-8">
          <h3 className="font-black text-sm uppercase tracking-[0.3em] bg-gray-100 p-3 pl-5 rounded-xl border-l-8 border-black">A. Data Penyewa</h3>
          <div className="relative" ref={suggestionRef}>
            <label className={labelClass}>Nama Lengkap Penyewa</label>
            <input 
              name="namaPenyewa" 
              autoComplete="off"
              value={data.namaPenyewa} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="Ketik Nama..."
            />
            {showSuggestions && filteredCustomers.length > 0 && (
              <div className="absolute z-50 w-full mt-3 bg-white border-4 border-black rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-h-80 overflow-y-auto overflow-hidden">
                {filteredCustomers.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => selectCustomer(c)}
                    className="p-5 hover:bg-gray-50 cursor-pointer border-b-2 border-gray-100 last:border-0 transition-colors"
                  >
                    <div className="font-[1000] text-black text-lg uppercase tracking-tight">{c.name}</div>
                    <div className="text-xs text-gray-400 truncate uppercase mt-1 font-bold">{c.address}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className={labelClass}>Alamat Tinggal Sesuai KTP</label>
            <input name="alamatRumah" value={data.alamatRumah} onChange={handleChange} className={inputClass} placeholder="Alamat Lengkap..." />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Nomor WhatsApp</label>
              <input name="telp" value={data.telp} onChange={handleChange} className={inputClass} placeholder="08..." />
            </div>
            <div>
              <label className={labelClass}>Tujuan Perjalanan</label>
              <input name="tujuanSewa" value={data.tujuanSewa} onChange={handleChange} className={inputClass} placeholder="Wisata/Dinas..." />
            </div>
          </div>
        </div>

        {/* Section B */}
        <div className="space-y-8">
          <h3 className="font-black text-sm uppercase tracking-[0.3em] bg-gray-100 p-3 pl-5 rounded-xl border-l-8 border-black">B. Detail Unit</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Jenis Mobil</label>
              <input name="jenisMobil" value={data.jenisMobil} onChange={handleChange} className={inputClass} placeholder="Innova/Avanza..." />
            </div>
            <div>
              <label className={labelClass}>Plat Nomor (Nopol)</label>
              <input name="nopol" value={data.nopol} onChange={handleChange} className={inputClass} placeholder="W 1234 KL..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-[2rem] border-2 border-gray-100 shadow-inner">
            <div className="col-span-2 text-xs font-black text-gray-400 mb-[-10px] uppercase tracking-widest">Waktu Penyerahan</div>
            <div>
              <label className={labelClass}>Tanggal</label>
              <input type="date" name="tanggalMulai" value={data.tanggalMulai} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Jam</label>
              <input type="time" name="pukulMulai" value={data.pukulMulai} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-[2rem] border-2 border-gray-100 shadow-inner">
            <div className="col-span-2 text-xs font-black text-gray-400 mb-[-10px] uppercase tracking-widest">Waktu Pengembalian</div>
            <div>
              <label className={labelClass}>Tanggal</label>
              <input type="date" name="tanggalSelesai" value={data.tanggalSelesai} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Jam</label>
              <input type="time" name="pukulSelesai" value={data.pukulSelesai} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 pt-16 border-t-8 border-black">
        <div className="space-y-8">
          <h3 className="font-black text-sm uppercase tracking-[0.3em] bg-red-50 text-[#e60000] p-3 pl-5 rounded-xl border-l-8 border-[#e60000]">C. Rincian Pembayaran</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Tarif Sewa / 24 Jam</label>
              <input type="text" name="tarif24Jam" value={formatCurrency(data.tarif24Jam)} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Total Hari</label>
              <input type="number" name="jumlahHari" value={data.jumlahHari} onChange={handleChange} min="1" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={`${labelClass} text-red-600`}>Uang Muka (DP)</label>
              <input type="text" name="uangMuka" value={formatCurrency(data.uangMuka)} onChange={handleChange} className={`${inputClass} !border-red-200 text-red-600 bg-red-50/30`} />
            </div>
            <div>
              <label className={labelClass}>Biaya Overtime</label>
              <input type="text" name="overtime" value={formatCurrency(data.overtime)} onChange={handleChange} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Biaya Sopir</label>
              <input type="text" name="jasaSopir" value={formatCurrency(data.jasaSopir)} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Biaya Antar/Jemput</label>
              <input type="text" name="jasaAntar" value={formatCurrency(data.jasaAntar)} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="font-black text-sm uppercase tracking-[0.3em] bg-gray-100 p-3 pl-5 rounded-xl border-l-8 border-black">D. Jaminan & Lokasi</h3>
          <div>
            <label className={labelClass}>Jaminan (Misal: KTP & Motor)</label>
            <input name="jaminan" value={data.jaminan} onChange={handleChange} className={inputClass} placeholder="Jaminan yang ditahan..." />
          </div>
          <div>
            <label className={labelClass}>Lokasi Serah Terima</label>
            <input name="lokasi" value={data.lokasi} onChange={handleChange} className={inputClass} />
          </div>
          <div className="bg-black p-8 rounded-[3rem] border-8 border-black shadow-[15px_15px_0px_rgba(0,0,0,0.1)] transform hover:scale-[1.01] transition-all">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Total Tagihan Sisa</label>
            <div className="text-5xl font-[1000] text-white tracking-tighter">Rp {formatCurrency(data.total)}</div>
            <p className="text-[10px] text-gray-500 mt-4 font-bold uppercase tracking-[0.2em] italic">* Nominal Terhitung Otomatis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptForm;
