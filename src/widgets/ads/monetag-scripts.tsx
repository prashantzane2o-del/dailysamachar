import Script from "next/script";

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
      <Script id="monetag-tag-zone-11196220" strategy="afterInteractive">
        {`(function(s){s.dataset.zone='11196220';s.src='https://al5sm.com/tag.min.js'})([document.documentElement,document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
      </Script>
      <Script
        id="monetag-tag-zone-11196222"
        src="https://5gvci.com/act/files/tag.min.js?z=11196222"
        data-cfasync="false"
        strategy="afterInteractive"
      />
      <Script id="monetag-tag-zone-11196223" strategy="afterInteractive">
        {`(function(s){s.dataset.zone='11196223';s.src='https://nap5k.com/tag.min.js'})([document.documentElement,document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
      </Script>
      <Script id="monetag-vignette-primary" strategy="afterInteractive">
        {`(function(s){s.dataset.zone='11196225';s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement,document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
      </Script>
      <Script
        id="monetag-tag-zone-253184"
        src="https://quge5.com/88/tag.min.js"
        data-zone="253184"
        data-cfasync="false"
        strategy="afterInteractive"
      />
      <Script id="monetag-tag-zone-11196274" strategy="afterInteractive">
        {`(function(s){s.dataset.zone='11196274';s.src='https://al5sm.com/tag.min.js'})([document.documentElement,document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
      </Script>
    </>
  );
}
