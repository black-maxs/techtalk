import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  // Response ini yang akan membawa cookie sesi yang sudah disegarkan
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet, headers) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers ?? {}).forEach(([nama, nilai]) =>
            response.headers.set(nama, nilai),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const halamanLogin = pathname === "/login-panitia";

  // Belum login → paksa ke halaman login
  if (!user && !halamanLogin)
    return alihkan(request, response, "/login-panitia");

  // Sudah login tapi membuka halaman login → langsung ke dashboard
  if (user && halamanLogin) return alihkan(request, response, "/admin");

  return response;
}

/** Pindah halaman sambil membawa cookie sesi yang baru disegarkan */
function alihkan(request: NextRequest, response: NextResponse, tujuan: string) {
  const url = request.nextUrl.clone();
  url.pathname = tujuan;
  const pengalihan = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => pengalihan.cookies.set(cookie));
  return pengalihan;
}

export const config = {
  matcher: ["/admin/:path*", "/login-panitia"],
};
