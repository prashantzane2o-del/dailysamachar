import Script from "next/script";

const VIGNETTE_ZONES = [
  "11452423",
  "11435757",
  "11428928",
  "11428822",
  "11323879",
  "11306788",
  "11285544",
] as const;

/** Loads the approved Monetag zones once for the whole locale layout. */
export function MonetagScripts() {
  return (
    <>
      <Script
        id="monetag-tag-zone-281240"
        src="https://quge5.com/88/tag.min.js"
        data-zone="281240"
        data-cfasync="false"
        strategy="afterInteractive"
      />
      <Script
        id="monetag-tag-zone-253198"
        src="https://quge5.com/88/tag.min.js"
        data-zone="253198"
        data-cfasync="false"
        strategy="afterInteractive"
      />
      {VIGNETTE_ZONES.map((zone) => (
        <Script key={zone} id={`monetag-vignette-${zone}`} strategy="afterInteractive">
          {`(function(s){s.dataset.zone='${zone}';s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement,document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
        </Script>
      ))}
      <Script id="monetag-tag-zone-11196274" strategy="afterInteractive">
        {`(function(s){s.dataset.zone='11196274';s.src='https://al5sm.com/tag.min.js'})([document.documentElement,document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
      </Script>
    </>
  );
}
