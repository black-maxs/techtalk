import type { Metadata } from "next";
import FormLogin from "@/components/admin/FormLogin";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Login Panitia",
  robots: { index: false, follow: false },
};

export default function HalamanLogin() {
  return (
    <main className="grid min-h-dvh place-items-center py-14">
      <Container className="flex max-w-sm flex-col gap-8">
        <div className="flex flex-col gap-3 text-center">
          <span className="font-mono font-medium tracking-wide">
            TECHTALK<span className="text-aksen">/26</span>
          </span>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">
            Login Panitia
          </h1>
          <p className="text-sm leading-relaxed text-redup">
            Halaman ini khusus panitia untuk melihat data peserta dan check-in.
          </p>
        </div>
        <FormLogin />
      </Container>
    </main>
  );
}
