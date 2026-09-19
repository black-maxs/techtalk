"use client";

import { useActionState, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { ArrowRight, CircleAlert, LoaderCircle } from "lucide-react";
import { daftar, type StateDaftar } from "@/app/daftar/actions";
import { errorPerKolom, skemaDaftar, type ErrorKolom, type KolomDaftar } from "@/lib/skemaDaftar";
import type { TiketDenganStatus } from "@/lib/tiket";
import type { IdTiket } from "@/lib/types";
import { formatRupiah } from "@/lib/utils";

const URUTAN_KOLOM: KolomDaftar[] = ["nama", "email", "whatsapp", "instansi", "tiket"];

function PesanError({ id, pesan }: { id: string; pesan: string }) {
  return (
    <p id={id} className="flex items-center gap-1.5 text-sm text-bahaya">
      <CircleAlert className="size-4 shrink-0" />
      {pesan}
    </p>
  );
}

type PropsKolom = InputHTMLAttributes<HTMLInputElement> & {
  name: KolomDaftar;
  label: string;
  error?: string;
  petunjuk?: string;
};

function Kolom({ name, label, error, petunjuk, ...input }: PropsKolom) {
  const idPetunjuk = `${name}-petunjuk`;
  const idError = `${name}-error`;
  const keterangan = error ? idError : petunjuk ? idPetunjuk : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={keterangan}
        className={`h-12 rounded-md border bg-panel-2 px-4 text-base text-teks transition-[border-color] duration-200 placeholder:text-redup/60 focus-visible:border-aksen ${
          error ? "border-bahaya/70" : "border-garis-kuat"
        }`}
        {...input}
      />
      {error ? (
        <PesanError id={idError} pesan={error} />
      ) : (
        petunjuk && (
          <p id={idPetunjuk} className="text-xs text-redup">
            {petunjuk}
          </p>
        )
      )}
    </div>
  );
}

type Props = {
  daftarTiket: TiketDenganStatus[];
  tiketAwal: IdTiket | null;
};

export default function FormDaftar({ daftarTiket, tiketAwal }: Props) {
  const [state, formAction, pending] = useActionState<StateDaftar, FormData>(daftar, {});
  const [errorKlien, setErrorKlien] = useState<ErrorKolom | null>(null);
  const nilai = state.nilai ?? {};
  const [dipilih, setDipilih] = useState<string>(nilai.tiket || tiketAwal || "");

  // Error dari browser diutamakan (paling baru). Kalau lolos di browser, tampilkan hasil dari server.
  const errors = errorKlien ?? state.errors ?? {};
  const tiketTerpilih = daftarTiket.find((t) => t.id === dipilih && t.tersedia);

  function periksa(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const hasil = skemaDaftar.safeParse(Object.fromEntries(new FormData(form)));
    if (hasil.success) {
      setErrorKlien(null);
      return; // lanjut ke Server Action
    }

    // Batalkan pengiriman, tampilkan error, lalu fokuskan kolom pertama yang salah
    e.preventDefault();
    const errorBaru = errorPerKolom(hasil.error);
    setErrorKlien(errorBaru);
    const kolomPertama = URUTAN_KOLOM.find((k) => errorBaru[k]);
    form.querySelector<HTMLElement>(`[name="${kolomPertama}"]`)?.focus();
  }

  return (
    <form action={formAction} onSubmit={periksa} noValidate className="flex flex-col gap-6">
      <Kolom
        name="nama"
        label="Nama lengkap"
        autoComplete="name"
        placeholder="Contoh: Raka Pradipta"
        petunjuk="Nama ini akan tertulis di e-certificate."
        defaultValue={nilai.nama}
        error={errors.nama}
        required
      />
      <Kolom
        name="email"
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="nama@email.com"
        petunjuk="E-tiket ber-QR akan dikirim ke email ini."
        defaultValue={nilai.email}
        error={errors.email}
        required
      />
      <Kolom
        name="whatsapp"
        label="Nomor WhatsApp"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="0812 3456 7890"
        petunjuk="Untuk informasi penting dari panitia menjelang acara."
        defaultValue={nilai.whatsapp}
        error={errors.whatsapp}
        required
      />
      <Kolom
        name="instansi"
        label="Kampus / sekolah / instansi"
        autoComplete="organization"
        placeholder="Contoh: Universitas Indonesia"
        defaultValue={nilai.instansi}
        error={errors.instansi}
        required
      />

      <fieldset
        aria-describedby={errors.tiket ? "tiket-error" : undefined}
        className="flex flex-col gap-3"
      >
        <legend className="mb-2 text-sm font-medium">Jenis tiket</legend>
        {daftarTiket.map((t) => (
          <label
            key={t.id}
            className="flex cursor-pointer items-center gap-4 rounded-lg border border-garis-kuat bg-panel-2 p-4 transition-[border-color,background-color] duration-200 has-checked:border-aksen has-checked:bg-aksen/5 has-disabled:cursor-not-allowed has-disabled:opacity-50"
          >
            <input
              type="radio"
              name="tiket"
              value={t.id}
              defaultChecked={(nilai.tiket || tiketAwal) === t.id}
              disabled={!t.tersedia}
              onChange={() => setDipilih(t.id)}
              className="size-4 shrink-0 accent-aksen"
            />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-semibold">{t.nama}</span>
              <span className="text-sm text-redup">
                {t.alasan === "habis" ? "Habis" : t.alasan === "berakhir" ? "Sudah berakhir" : t.deskripsi}
              </span>
            </span>
            <span className="font-mono font-medium">{formatRupiah(t.harga)}</span>
          </label>
        ))}
        {errors.tiket && <PesanError id="tiket-error" pesan={errors.tiket} />}
      </fieldset>

      {/* Honeypot anti-bot: tersembunyi dari manusia dan screen reader */}
      <div aria-hidden="true" className="hidden">
        <label>
          Situs web
          <input name="situs" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex items-center justify-between border-t border-garis pt-6">
        <span className="text-redup">Total bayar</span>
        <span className="font-mono text-2xl font-medium">
          {tiketTerpilih ? formatRupiah(tiketTerpilih.harga) : "—"}
        </span>
      </div>

      {state.pesan && (
        <p role="alert" className="flex gap-2.5 rounded-lg border border-bahaya/40 bg-bahaya/10 p-4 text-sm text-bahaya">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {state.pesan}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-14 items-center justify-center gap-2.5 rounded-md bg-aksen px-7 text-[17px] font-semibold text-latar transition-[background-color,opacity] duration-200 hover:bg-aksen-terang disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? (
          <>
            <LoaderCircle className="size-5 animate-spin" />
            Memproses…
          </>
        ) : (
          <>
            Lanjut ke Pembayaran
            <ArrowRight strokeWidth={2.2} className="size-4" />
          </>
        )}
      </button>

      <p className="text-center text-xs leading-relaxed text-redup">
        Dengan mendaftar, kamu setuju data di atas dipakai panitia untuk keperluan acara TechTalk.
      </p>
    </form>
  );
}
