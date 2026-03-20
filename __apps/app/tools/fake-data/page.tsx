"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { RefreshCw, Copy, Check, Download } from "lucide-react";

const rand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const FIRST_NAMES_M = ["Budi", "Agus", "Rizky", "Dedi", "Eko", "Fajar", "Hendra", "Ivan", "Joko", "Kevin", "Lutfi", "Muhammad", "Nanda", "Oscar", "Putra", "Rafli", "Sandi", "Teguh", "Ujang", "Wahyu", "Yusuf", "Zain", "Andika", "Bagas", "Cahyo", "Dimas", "Ferry", "Gilang", "Habib", "Ilham"];
const FIRST_NAMES_F = ["Sari", "Dewi", "Ayu", "Rina", "Nita", "Fitri", "Indah", "Laras", "Maya", "Novi", "Putri", "Ratna", "Sinta", "Tika", "Ulan", "Vina", "Wulan", "Yanti", "Zahra", "Aulia", "Bella", "Citra", "Dina", "Elva", "Fira", "Gita", "Hana", "Intan", "Jihan", "Karin"];
const LAST_NAMES = ["Santoso", "Wijaya", "Kusuma", "Setiawan", "Pratama", "Hartono", "Gunawan", "Saputra", "Hidayat", "Nugroho", "Purnama", "Andriani", "Susanto", "Rahayu", "Wibowo", "Firmansyah", "Kurniawan", "Maulana", "Permana", "Ramadan"];
const DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "proton.me", "icloud.com"];
const COMPANIES = ["PT Maju Jaya", "CV Berkah Abadi", "PT Nusantara Digital", "PT Sinar Mas", "CV Harapan Bangsa", "PT Teknologi Nusantara", "PT Karya Mandiri", "CV Sukses Bersama"];
const CITIES = ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Palembang", "Tangerang", "Depok", "Bekasi", "Yogyakarta", "Solo", "Malang", "Bogor", "Balikpapan"];
const PROVINCES = ["Jawa Barat", "Jawa Tengah", "Jawa Timur", "DKI Jakarta", "Banten", "Sumatera Utara", "Sulawesi Selatan", "Kalimantan Timur", "DIY Yogyakarta", "Bali"];
const STREETS = ["Jl. Merdeka", "Jl. Sudirman", "Jl. Gatot Subroto", "Jl. Ahmad Yani", "Jl. Diponegoro", "Jl. Pahlawan", "Jl. Kebon Jeruk", "Jl. Raya Bogor", "Jl. Pemuda", "Jl. Veteran"];
const JOBS = ["Software Engineer", "Data Analyst", "Desainer Grafis", "Manajer Pemasaran", "Akuntan", "Dokter Umum", "Guru", "Pengacara", "Arsitek", "Jurnalis", "HRD Manager", "Product Manager"];

type DataType = "nama" | "email" | "telepon" | "alamat" | "pekerjaan" | "perusahaan" | "nik" | "lengkap";

function generateOne(type: DataType): Record<string, string> {
  const isMale = Math.random() > 0.5;
  const firstName = rand(isMale ? FIRST_NAMES_M : FIRST_NAMES_F);
  const lastName = rand(LAST_NAMES);
  const fullName = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randInt(1, 99)}@${rand(DOMAINS)}`;
  const phone = `08${rand(["1", "2", "5", "7", "8", "9"])}${randInt(10000000, 99999999)}`;
  const city = rand(CITIES);
  const prov = rand(PROVINCES);
  const street = `${rand(STREETS)} No.${randInt(1, 200)}, ${city}, ${prov}`;
  const job = rand(JOBS);
  const company = rand(COMPANIES);

  // NIK: 16 digit
  const nik = `${randInt(10, 99)}${randInt(10, 99)}${randInt(10, 99)}${String(randInt(100101, 311299))}${String(randInt(1000, 9999))}`;

  switch (type) {
    case "nama": return { Nama: fullName };
    case "email": return { Nama: fullName, Email: email };
    case "telepon": return { Nama: fullName, Telepon: phone };
    case "alamat": return { Nama: fullName, Alamat: street };
    case "pekerjaan": return { Nama: fullName, Pekerjaan: job };
    case "perusahaan": return { Nama: fullName, Perusahaan: company };
    case "nik": return { Nama: fullName, NIK: nik };
    case "lengkap":
    default:
      return { Nama: fullName, Email: email, Telepon: phone, NIK: nik, Pekerjaan: job, Perusahaan: company, Kota: city, Alamat: street };
  }
}

const DATA_TYPES: { value: DataType; label: string }[] = [
  { value: "lengkap", label: "Profil Lengkap" },
  { value: "nama", label: "Nama" },
  { value: "email", label: "Nama + Email" },
  { value: "telepon", label: "Nama + Telepon" },
  { value: "alamat", label: "Nama + Alamat" },
  { value: "pekerjaan", label: "Nama + Pekerjaan" },
  { value: "perusahaan", label: "Nama + Perusahaan" },
  { value: "nik", label: "Nama + NIK" },
];

export default function FakeDataGeneratorPage() {
  const [type, setType] = useState<DataType>("lengkap");
  const [count, setCount] = useState("5");
  const [data, setData] = useState<Record<string, string>[]>(() => Array.from({ length: 5 }, () => generateOne("lengkap")));
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = useCallback(() => {
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 100);
    setData(Array.from({ length: n }, () => generateOne(type)));
  }, [type, count]);

  const copyRow = (row: Record<string, string>, idx: number) => {
    navigator.clipboard.writeText(Object.entries(row).map(([k, v]) => `${k}: ${v}`).join(" | "));
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = () => {
    const keys = Object.keys(data[0] || {});
    const csv = [keys.join(","), ...data.map((row) => keys.map((k) => `"${row[k] || ""}"`).join(","))].join("\n");
    navigator.clipboard.writeText(csv);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const downloadCSV = () => {
    const keys = Object.keys(data[0] || {});
    const csv = [keys.join(","), ...data.map((row) => keys.map((k) => `"${row[k] || ""}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fake-data-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const keys = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <ToolLayout title="Fake Data Generator" description="Generate data dummy Indonesia untuk testing dan prototyping.">
      <div className="space-y-5">
        {/* Controls */}
        <div className="bg-surface rounded-xl p-5 border border-line flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs text-muted mb-1 block">Tipe Data</label>
            <select
              className="bg-bg border border-line rounded-lg px-3 py-2.5 text-soft text-sm focus:outline-none focus:border-primary"
              value={type}
              onChange={(e) => setType(e.target.value as DataType)}
            >
              {DATA_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted mb-1 block">Jumlah</label>
            <input
              type="number"
              className="w-20 bg-bg border border-line rounded-lg px-3 py-2.5 text-soft text-sm focus:outline-none focus:border-primary"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
              max="100"
            />
          </div>

          <button
            onClick={generate}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={14} />
            Generate
          </button>
        </div>

        {/* Table */}
        {data.length > 0 && (
          <div className="bg-surface rounded-xl border border-line overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-line">
              <span className="text-sm font-semibold text-soft">{data.length} record</span>
              <div className="flex gap-3">
                <button
                  onClick={copyAll}
                  className="flex items-center gap-1.5 text-xs text-primary hover:opacity-80 transition-opacity"
                >
                  {copiedAll ? <Check size={13} /> : <Copy size={13} />}
                  Salin CSV
                </button>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-1.5 text-xs text-muted hover:text-soft transition-colors"
                >
                  <Download size={13} />
                  Download CSV
                </button>
              </div>
            </div>

            <div className="overflow-auto max-h-[520px]">
              <table className="w-full text-xs min-w-max">
                <thead>
                  <tr className="border-b border-line bg-bg sticky top-0">
                    <th className="px-4 py-2.5 text-left text-muted font-medium w-10">#</th>
                    {keys.map((k) => (
                      <th key={k} className="px-4 py-2.5 text-left text-muted font-medium">
                        {k}
                      </th>
                    ))}
                    <th className="px-4 py-2.5 w-8" />
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr key={idx} className="border-b border-line/50 hover:bg-bg group">
                      <td className="px-4 py-2.5 text-muted">{idx + 1}</td>
                      {keys.map((k) => (
                        <td key={k} className="px-4 py-2.5 text-soft whitespace-nowrap">
                          {row[k]}
                        </td>
                      ))}
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => copyRow(row, idx)}
                          className="opacity-0 group-hover:opacity-100 text-muted hover:text-soft transition-all"
                        >
                          {copiedIdx === idx ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-xs text-muted text-center">
          Data yang di-generate bersifat fiktif dan hanya untuk keperluan testing / prototyping.
        </p>
      </div>
    </ToolLayout>
  );
}
