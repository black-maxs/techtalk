import QRCode from "qrcode";

type Props = {
  nilai: string;
  className?: string;
};

export default async function KodeQr({ nilai, className = "" }: Props) {
  const svg = await QRCode.toString(nilai, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#0a0c10", light: "#ffffff" },
  });

  return (
    <div
      role="img"
      aria-label={`QR code tiket ${nilai}`}
      className={className}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
