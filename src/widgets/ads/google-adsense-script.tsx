import Script from "next/script";

const ADSENSE_CLIENT = "ca-pub-4608193844622252";

export function GoogleAdSenseScript() {
  return (
    <Script
      id="google-adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
