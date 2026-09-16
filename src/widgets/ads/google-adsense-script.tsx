const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-4608193844622252";

export function GoogleAdSenseScript() {
  // AdSense requires a native head tag. next/script adds data-nscript,
  // which AdSense reports as unsupported on its head loader.
  return <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`} crossOrigin="anonymous" />;
}
