import { event } from "@/data/event";

/** "2026-10-25T09:00:00+07:00" → "20261025T020000Z" (format Google Calendar, dalam UTC) */
function keFormatKalender(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Link "Add to Google Calendar" berisi detail acara */
export function linkGoogleCalendar(): string {
  const parameter = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.nama} ${event.tahun} — ${event.tema}`,
    dates: `${keFormatKalender(event.mulai)}/${keFormatKalender(event.selesai)}`,
    details: `${event.ringkasan}\n\nInfo lengkap: ${event.url}`,
    location: `${event.venue.nama}, ${event.venue.alamat}`,
  });
  return `https://calendar.google.com/calendar/render?${parameter}`;
}