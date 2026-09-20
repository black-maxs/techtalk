import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0c10",
        color: "#5ce1d6",
        fontSize: "22px",
        fontWeight: 700,
        fontFamily: "sans-serif",
        borderRadius: "6px",
      }}
    >
      T
    </div>,
    size,
  );
}
