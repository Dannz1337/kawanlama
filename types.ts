
export interface ReceiptData {
  namaPenyewa: string;
  alamatRumah: string;
  telp: string;
  jenisMobil: string;
  nopol: string;
  tanggalMulai: string;
  pukulMulai: string;
  tanggalSelesai: string;
  pukulSelesai: string;
  pemakaian: string;
  jumlahHari: number | "";
  tarif24Jam: number | "";
  uangMuka: number | "";
  jaminan: string;
  tujuanSewa: string;
  jasaSopir: number | "";
  jasaAntar: number | "";
  overtime: number | "";
  total: number;
  lokasi: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  lastVisit: string;
}

export interface Order extends ReceiptData {
  id: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  createdAt: string;
}

export type ImageSize = '1K' | '2K' | '4K';
