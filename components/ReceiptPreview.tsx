
import React from 'react';
import { ReceiptData } from '../types';

interface ReceiptPreviewProps {
  data: ReceiptData;
}

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ data }) => {
  const formatNum = (val: any) => (val === '' || isNaN(val) ? 0 : Number(val)).toLocaleString('id-ID');

  return (
    <div className="print-area bg-white p-12 md:p-14 shadow-2xl border-[6px] border-black max-w-[210mm] mx-auto text-black min-h-[297mm] flex flex-col relative overflow-hidden modern-curve">
      {/* Decorative Speed Lines Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-bl-full -z-10 opacity-50"></div>
      
      {/* Header - Enormously Readable */}
      <div className="flex justify-between items-start border-b-[8px] border-black pb-8 mb-8">
        <div className="flex flex-col">
          <div className="flex items-center mb-4">
            <div className="relative bg-gradient-to-br from-[#ff4d00] to-[#e60000] text-white px-6 py-2 rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-md rounded-bl-md font-black italic text-5xl tracking-tighter leading-none shadow-xl">
              KL
            </div>
            <div className="flex flex-col leading-none ml-6">
              <span className="text-[#e60000] font-[1000] text-4xl tracking-tighter italic uppercase">CV. KAWAN LAMA</span>
              <span className="text-gray-500 text-[10px] font-bold tracking-[0.5em] uppercase mt-2">Premium Car Rental Service Sidoarjo</span>
            </div>
          </div>
          <div className="space-y-1 text-xs font-black leading-tight uppercase tracking-wider">
            <p className="flex items-center"><span className="w-2.5 h-2.5 bg-red-600 rounded-full mr-3"></span> Perum Harmoni Kota B 19, Durung Bedug, Candi</p>
            <p className="flex items-center"><span className="w-2.5 h-2.5 bg-black rounded-full mr-3"></span> Sidoarjo, Jawa Timur - 61271</p>
            <p className="flex items-center font-[1000] mt-2 text-base bg-black text-white px-3 py-1 rounded-lg w-fit">
              <span className="opacity-50 mr-3 text-[10px] tracking-widest">WHATSAPP:</span> 081 232 597 885 / 0812 8228 5864
            </p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end pt-2">
           <div className="bg-black text-white px-4 py-2 rounded-xl font-[1000] italic text-sm tracking-[0.3em] uppercase mb-2 shadow-lg">
             OFFICIAL RECEIPT
           </div>
           <p className="text-[11px] font-[1000] text-gray-400 uppercase tracking-[0.3em]">No. Nota: {new Date().getTime().toString().slice(-8)}</p>
        </div>
      </div>

      {/* Title Section */}
      <div className="text-center mb-10 relative">
        <h2 className="text-3xl font-[1000] uppercase italic tracking-[0.2em] relative inline-block">
          Tanda Bukti Penyerahan Unit
          <div className="absolute -bottom-2 left-0 w-full h-2 bg-red-600"></div>
        </h2>
      </div>

      {/* Main Content Grid - Larger Fonts */}
      <div className="grid grid-cols-2 gap-x-16 gap-y-8 mb-10">
        {/* Customer Column */}
        <div className="space-y-6">
          <h3 className="font-black text-xs uppercase tracking-[0.3em] bg-gray-100 py-2 px-4 rounded-xl border-l-[8px] border-black inline-block">A. Identitas Penyewa</h3>
          <div className="space-y-4 pt-1">
            <div className="flex flex-col border-b-2 border-black/10 pb-1">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Nama Lengkap</span>
              <span className="text-2xl font-[1000] uppercase tracking-tighter leading-none">{data.namaPenyewa || "........................"}</span>
            </div>
            <div className="flex flex-col border-b-2 border-black/10 pb-1">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Alamat Domisili</span>
              <span className="text-sm font-bold uppercase leading-tight">{data.alamatRumah || "........................"}</span>
            </div>
            <div className="flex flex-col border-b-2 border-black/10 pb-1">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Nomor Telepon</span>
              <span className="text-lg font-[1000] tracking-[0.1em]">{data.telp || "........................"}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Column */}
        <div className="space-y-6">
          <h3 className="font-black text-xs uppercase tracking-[0.3em] bg-gray-100 py-2 px-4 rounded-xl border-l-[8px] border-black inline-block">B. Unit Kendaraan</h3>
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col border-b-2 border-black/10 pb-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Jenis Mobil</span>
                <span className="text-lg font-[1000] uppercase tracking-tight">{data.jenisMobil || "........................"}</span>
              </div>
              <div className="flex flex-col border-b-2 border-black/10 pb-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">No. Polisi</span>
                <span className="text-lg font-[1000] uppercase tracking-widest">{data.nopol || "........................"}</span>
              </div>
            </div>
            <div className="flex flex-col border-b-2 border-black/10 pb-1">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Masa Sewa</span>
              <span className="text-lg font-[1000] uppercase tracking-tight text-red-600">{data.pemakaian || `${data.jumlahHari || 0} HARI`}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border-2 border-black/5">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase leading-none mb-1">Penyerahan</span>
                <span className="text-xs font-black leading-tight">{data.tanggalMulai || "....-....-...."} <span className="text-red-600">@{data.pukulMulai || "--:--"}</span></span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase leading-none mb-1">Pengembalian</span>
                <span className="text-xs font-black leading-tight">{data.tanggalSelesai || "....-....-...."} <span className="text-red-600">@{data.pukulSelesai || "--:--"}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Section - Mega Readable */}
      <div className="grid grid-cols-12 gap-8 mb-10 items-stretch">
        <div className="col-span-7 bg-white p-7 rounded-[2.5rem] border-[6px] border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <h3 className="font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center">
            <span className="w-2 h-5 bg-red-600 mr-3"></span> Rincian Transaksi
          </h3>
          <div className="space-y-3 font-bold text-sm">
            <div className="flex justify-between items-center border-b-2 border-gray-100 pb-2">
              <span className="text-gray-400 text-[10px] uppercase font-black">Tarif Dasar ({data.jumlahHari || 0} Hari)</span>
              <span className="font-mono text-lg">Rp. {formatNum(Number(data.tarif24Jam || 0) * Number(data.jumlahHari || 0))}</span>
            </div>
            <div className="flex justify-between items-center border-b-2 border-gray-100 pb-2">
              <span className="text-gray-400 text-[10px] uppercase font-black">Biaya Add-on (Sopir/Antar/OT)</span>
              <span className="font-mono text-lg">Rp. {formatNum(Number(data.jasaSopir || 0) + Number(data.jasaAntar || 0) + Number(data.overtime || 0))}</span>
            </div>
            <div className="flex justify-between items-center text-red-600 pt-2 italic">
              <span className="text-[11px] uppercase font-[1000] tracking-widest">Uang Muka (DP) Terbayar</span>
              <span className="font-mono text-xl font-[1000]">- Rp. {formatNum(data.uangMuka)}</span>
            </div>
            <div className="mt-8 pt-5 border-t-[6px] border-black flex justify-between items-center">
              <span className="font-[1000] text-xl uppercase tracking-tighter">TOTAL SISA</span>
              <div className="bg-black text-white px-5 py-3 rounded-2xl text-3xl font-[1000] font-mono shadow-xl transform scale-110 origin-right">
                Rp. {formatNum(data.total)}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-5 flex flex-col space-y-4">
          <div className="bg-gray-50 p-6 rounded-3xl border-[3px] border-black flex-1 flex flex-col justify-center shadow-sm">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-2">Jaminan Administrasi</span>
            <p className="text-sm font-[1000] uppercase italic leading-tight text-center">{data.jaminan || "..................."}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-3xl border-[3px] border-black flex-1 flex flex-col justify-center shadow-sm">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-2">Tujuan Penggunaan</span>
            <p className="text-sm font-[1000] uppercase italic leading-tight text-center">{data.tujuanSewa || "..................."}</p>
          </div>
        </div>
      </div>

      {/* Terms - Slightly Larger */}
      <div className="bg-zinc-900 text-white p-6 rounded-2xl mb-auto relative overflow-hidden border-l-[12px] border-red-600">
        <p className="text-[10px] md:text-[11px] font-bold leading-relaxed italic tracking-tight opacity-90">
          SYARAT & KETENTUAN: Penyewa telah memahami dan menyetujui semua aturan yang berlaku di CV. KAWAN LAMA. 
          Penyewa bertanggung jawab penuh atas segala kerusakan, kehilangan, atau pelanggaran hukum selama masa sewa. 
          Keterlambatan pengembalian akan dikenakan denda sesuai tarif overtime per jam yang disepakati.
        </p>
      </div>

      {/* Signature Section */}
      <div className="flex justify-between items-end mt-12 px-4 pb-4">
        <div className="text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-16 tracking-[0.4em]">Diserahkan Oleh</p>
          <div className="w-56 border-t-[4px] border-black pt-2">
            <p className="text-sm font-[1000] uppercase italic text-[#e60000]">CV. KAWAN LAMA</p>
            <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Digital Management Sidoarjo</p>
          </div>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <p className="text-sm font-[1000] mb-16 uppercase tracking-[0.2em] bg-gray-100 px-4 py-1 rounded-full">
            {data.lokasi || "Candi"}, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
          </p>
          <div className="text-center w-56 border-t-[4px] border-black pt-2">
            <p className="text-sm font-[1000] uppercase italic">Pihak Penyewa</p>
            <p className="text-base font-[1000] uppercase mt-1 tracking-wider">({data.namaPenyewa || "..........."})</p>
          </div>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#ff4d00] via-[#e60000] to-black"></div>
    </div>
  );
};

export default ReceiptPreview;
