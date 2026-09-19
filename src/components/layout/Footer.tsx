import Link from "next/link";
import Container from "@/components/ui/Container";
import { event, kredit, navigasi } from "@/data/event";
import { formatTanggal } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="border-t border-garis pt-16 pb-28 md:pb-12">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-sm flex-col gap-3">
            <Link href="#hero" className="w-fit font-mono font-medium tracking-wide">
              TECHTALK<span className="text-aksen">/26</span>
            </Link>
            <p className="text-sm leading-relaxed text-redup">
              {event.tema}. {formatTanggal(event.mulai)}, {event.venue.kota}.
            </p>
          </div>

          <nav aria-label="Navigasi footer">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-redup sm:grid-cols-3">
              {navigasi.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-teks">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-garis pt-8 font-mono text-xs text-redup sm:flex-row sm:justify-between">
          <span>
            © {event.tahun} {event.nama}. Seluruh hak cipta dilindungi.
          </span>
          <span>{kredit}</span>
        </div>
      </Container>
    </footer>
  );
}