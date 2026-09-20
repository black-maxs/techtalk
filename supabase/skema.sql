-- ============================================================================
-- TechTalk 2026 — skema database
-- Jalankan SEKALI di Supabase Dashboard → SQL Editor → New query → Run.
-- Aman dijalankan ulang (memakai "if not exists" / "or replace").
-- ============================================================================

-- ─── Tabel pesanan ──────────────────────────────────────────────────────────
-- Satu baris = satu pendaftar. Status berubah: pending → paid / expired / failed.
create table if not exists public.pesanan (
  id               uuid primary key default gen_random_uuid(),
  kode             text not null unique,            -- kode tiket, juga dipakai sebagai order_id Midtrans
  nama             text not null check (char_length(nama) between 3 and 100),
  email            text not null check (char_length(email) <= 254),
  whatsapp         text not null check (whatsapp ~ '^628[0-9]{7,11}$'),
  instansi         text not null check (char_length(instansi) between 2 and 120),
  jenis_tiket      text not null check (jenis_tiket in ('early-bird', 'student', 'regular')),
  harga            integer not null check (harga > 0),
  status           text not null default 'pending'
                   check (status in ('pending', 'paid', 'expired', 'failed')),
  dibuat_pada      timestamptz not null default now(),
  kedaluwarsa_pada timestamptz not null default now() + interval '1 hour',
  dibayar_pada     timestamptz,
  check_in_pada    timestamptz
);

create index if not exists pesanan_status_idx on public.pesanan (status, kedaluwarsa_pada);
create index if not exists pesanan_email_idx on public.pesanan (email);

-- Token Snap Midtrans, disimpan agar pesanan yang sama tidak membuat transaksi baru
alter table public.pesanan add column if not exists snap_token text;

-- ─── Keamanan: Row Level Security ───────────────────────────────────────────
-- RLS aktif TANPA policy apa pun → kunci publik (anon) dan user login
-- (authenticated) tidak bisa membaca atau menulis satu baris pun.
-- Semua akses lewat server Next.js dengan SECRET key (role service_role),
-- yang memang melewati RLS. Data peserta tidak pernah bisa diambil dari browser.
alter table public.pesanan enable row level security;

-- ─── Fungsi: hitung kursi terisi ────────────────────────────────────────────
-- Kursi dihitung dari pesanan lunas + pesanan pending yang BELUM kedaluwarsa
-- (kursinya sedang "dipegang" selama pendaftar menyelesaikan pembayaran).
create or replace function public.hitung_kursi_terisi()
returns integer
language sql
stable
set search_path = ''
as $$
  select count(*)::integer
  from public.pesanan
  where status = 'paid'
     or (status = 'pending' and kedaluwarsa_pada > now());
$$;

-- ─── Fungsi: buat pesanan (dengan cek kuota yang aman) ──────────────────────
create or replace function public.buat_pesanan(
  p_kode        text,
  p_nama        text,
  p_email       text,
  p_whatsapp    text,
  p_instansi    text,
  p_jenis_tiket text,
  p_harga       integer,
  p_kuota       integer
)
returns public.pesanan
language plpgsql
set search_path = ''
as $$
declare
  hasil public.pesanan;
begin
  -- Kunci antrean: pendaftar yang submit bersamaan diproses satu per satu,
  -- supaya kursi terakhir tidak terjual dua kali. Kunci lepas otomatis
  -- saat transaksi selesai.
  perform pg_advisory_xact_lock(hashtext('techtalk_buat_pesanan'));

  if public.hitung_kursi_terisi() >= p_kuota then
    raise exception 'KUOTA_PENUH';
  end if;

  insert into public.pesanan (kode, nama, email, whatsapp, instansi, jenis_tiket, harga)
  values (p_kode, p_nama, p_email, p_whatsapp, p_instansi, p_jenis_tiket, p_harga)
  returning * into hasil;

  return hasil;
end;
$$;

-- Fungsi hanya boleh dipanggil oleh server (service_role), bukan dari browser.
revoke all on function public.hitung_kursi_terisi() from public, anon, authenticated;
revoke all on function public.buat_pesanan(text, text, text, text, text, text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.hitung_kursi_terisi() to service_role;
grant execute on function public.buat_pesanan(text, text, text, text, text, text, integer, integer)
  to service_role;
