import { Metadata } from "next";

import Completion from "./_completion";

export default function Page() {
  return <Completion />;
}

const title = "aitl at joulev.dev";
const description = "Translate light novels with AI.";
const url = "https://aitl.joulev.dev";
export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  robots: { index: false },
  twitter: { card: "summary_large_image", creator: "@joulev_3" },
  openGraph: {
    title,
    description,
    url,
    siteName: title,
    images: [
      {
        url: "https://static.joulev.dev/og?title=aitl",
        alt: title,
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  alternates: { canonical: url },
  icons: {
    icon: [
      { url: "https://static.joulev.dev/images/favicon.svg", type: "image/svg+xml" },
      { url: "https://static.joulev.dev/favicon.ico", type: "image/x-icon", sizes: "any" },
    ],
    apple: [{ url: "https://static.joulev.dev/images/apple-touch-icon.png", sizes: "180x180" }],
  },
};
