import Script from "next/script";

/**
 * Microsoft Clarity — heatmaps and session recordings.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ PASTE YOUR PROJECT ID BELOW.                                    │
 * │ clarity.microsoft.com → your project → Settings → Setup →       │
 * │ "Get tracking code". The ID is the short string at the end of   │
 * │ the snippet's clarity.ms/tag/ URL.                              │
 * │ Until it's filled in, this component renders nothing.           │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * The ID is hardcoded rather than read from an env var on purpose. It
 * isn't a secret — it ships in the page source of every deployed page —
 * and the site builds in GitHub Actions, where an env var would mean
 * adding a repo variable to the workflow for no benefit.
 *
 * Why `afterInteractive` rather than the `<head>` placement Clarity's
 * docs describe: this site's first seconds are animation-heavy (the bag
 * entrance, Lenis init, the hero reveal), and a blocking script in the
 * head competes with all of it. afterInteractive loads Clarity once the
 * page is interactive instead. The tradeoff is real — the first moment
 * or two of a session isn't captured — but for heatmaps and scroll
 * behaviour on a portfolio that costs nothing that matters.
 *
 * The snippet below is Clarity's own. It's kept as-is (rather than just
 * loading clarity.ms/tag/<id> directly) because the IIFE also installs
 * the `window.clarity` command queue, so any later custom calls —
 * clarity("identify", …), clarity("event", …) — are buffered instead of
 * lost if they fire before the tag finishes loading.
 */

/** From Clarity → Settings → Setup. */
const CLARITY_PROJECT_ID = "yj26cq0dps";

/**
 * Clarity is skipped in development so local work doesn't show up as
 * real sessions in the recordings. Flip to true temporarily if you need
 * to verify the install against `npm run dev`.
 */
const LOAD_IN_DEV = false;

export default function Clarity() {
  const configured = CLARITY_PROJECT_ID.length > 0;
  const allowedHere = process.env.NODE_ENV === "production" || LOAD_IN_DEV;

  if (!configured || !allowedHere) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`}
    </Script>
  );
}
