import { event, speakers, tiket } from "@/data/event";

/** Data terstruktur schema.org/Event, supaya Google mengenali ini sebagai acara */
export function dataEvent() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${event.nama} ${event.tahun}`,
    description: event.deskripsi,
    startDate: event.mulai,
    endDate: event.selesai,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: `${event.url}/opengraph-image`,
    url: event.url,
    maximumAttendeeCapacity: event.kuota,
    location: {
      "@type": "Place",
      name: event.venue.nama,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.venue.alamat,
        addressLocality: event.venue.kota,
        addressCountry: "ID",
      },
    },
    organizer: {
      "@type": "Organization",
      name: event.nama,
      url: event.url,
    },
    performer: speakers.map((s) => ({
      "@type": "Person",
      name: s.nama,
      jobTitle: s.jabatan,
      worksFor: { "@type": "Organization", name: s.perusahaan },
    })),
    offers: tiket.map((t) => ({
      "@type": "Offer",
      name: t.nama,
      price: t.harga,
      priceCurrency: "IDR",
      url: `${event.url}/daftar?tiket=${t.id}`,
      availability: "https://schema.org/InStock",
      ...(t.berlakuSampai ? { validThrough: t.berlakuSampai } : {}),
    })),
  };
}
