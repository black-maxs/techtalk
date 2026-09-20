import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { keluar } from "@/app/admin/login/actions";
import Container from "@/components/ui/Container";
import { adminSaatIni } from "@/lib/supabaseAuth";

export default async function LayoutAdmin({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await adminSaatIni();

  // Halaman login memakai layout ini juga, tapi proxy sudah menjaga pengalihannya.
  // Ini lapis kedua: kalau suatu saat proxy salah konfigurasi, halaman tetap tertutup.
  if (!admin) redirect("/admin/login");

  return (
    <>
      <header className="border-b border-garis">
        <Container className="flex h-18 items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-mono text-sm font-medium tracking-wide">
              TECHTALK<span className="text-aksen">/26</span> ADMIN
            </span>
            <span className="truncate text-xs text-redup">{admin.email}</span>
          </div>
          <form action={keluar}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-md border border-garis-kuat px-4 py-2.5 text-sm transition-colors hover:border-teks/40"
            >
              <LogOut className="size-4" />
              Keluar
            </button>
          </form>
        </Container>
      </header>
      <main className="py-10 lg:py-14">{children}</main>
    </>
  );
}
