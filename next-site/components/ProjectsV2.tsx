"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { saveHomeScroll } from "@/components/ScrollRestore";

/**
 * ProjectsV2 — port of Claude Design Portoflio/work.jsx
 * Folder cards (closed → open on hover) with sparkle accents.
 */

/**
 * Folder-card thumbnails — sponsor / project marks that peek out of the
 * opened folder. Each file in /public/img/folders/ is a pre-framed 120×120
 * square SVG with its own rounded corners (rx=10) — vector, infinitely
 * crisp at any display size, no raster resolution ceiling.
 *
 * Per-project NDA rationale:
 *   - Frogslayer / Purdue Stack / inline: sponsors named publicly on the
 *     site (folder tag, case body, or a public HoverWord link), so brand
 *     marks are fine.
 *   - JT / AI Journey Agent: sponsor deliberately anonymized on the site,
 *     so a hand-designed "Anonymous" sticky replaces a brand logo (a real
 *     logo would break the anonymization via reverse image search).
 *
 * BASE_PATH — raw <img>/<image> srcs need the /Portfolio prefix in
 * production (Next auto-applies to next/image and routing but NOT to raw
 * SVG <image> href attributes). Same pattern used in HoverBag.
 */
const BASE_PATH = process.env.NODE_ENV === "production" ? "/Portfolio" : "";
const FOLDER_THUMB = {
  frogslayer: `${BASE_PATH}/img/folders/frogslayer.svg`,
  stack:      `${BASE_PATH}/img/folders/stack.svg`,
  inline:     `${BASE_PATH}/img/folders/inline.svg`,
  anonymous:  `${BASE_PATH}/img/folders/anonymous.svg`,
} as const;

/* Each cover has both an MP4 (H.264) and a WebM (VP9) source. iOS
   Safari's VP9-in-WebM decoding is unreliable — autoplay silently
   fails and the video renders as an empty box on the folder sticky.
   MP4/H.264 is universally supported on every browser we care about
   (iOS Safari, Chrome, Firefox, Edge, macOS Safari). Providing both
   as <source> elements lets the browser pick the format it can
   actually decode. */
/* Each cover ships in three forms:
     mp4/webm — live <video> for the desktop <foreignObject> path.
     anim     — ANIMATED WebP for the touch path. This is the key to
                getting motion AND correct layering on iOS: a native
                SVG <image> obeys SVG paint order (so it tucks behind
                the folder's front flap), and Safari 14+ animates
                animated-WebP inside <image>. A <foreignObject> video
                would animate but iOS layer-promotes it in front of
                the whole folder.
     poster   — static first frame, used as the <video> poster on
                desktop and as a graceful fallback. */
const FOLDER_COVER = {
  frogslayer:  { mp4: `${BASE_PATH}/img/cover/Frogslayer.mp4`,  webm: `${BASE_PATH}/img/cover/Frogslayer.webm`,  anim: `${BASE_PATH}/img/cover/Frogslayer-anim.webp`,  poster: `${BASE_PATH}/img/cover/Frogslayer-poster.webp` },
  researchhub: { mp4: `${BASE_PATH}/img/cover/ResearchHub.mp4`, webm: `${BASE_PATH}/img/cover/ResearchHub.webm`, anim: `${BASE_PATH}/img/cover/ResearchHub-anim.webp`, poster: `${BASE_PATH}/img/cover/ResearchHub-poster.webp` },
  inline:      { mp4: `${BASE_PATH}/img/cover/inline.mp4`,      webm: `${BASE_PATH}/img/cover/inline.webm`,      anim: `${BASE_PATH}/img/cover/inline-anim.webp`,      poster: `${BASE_PATH}/img/cover/inline-poster.webp` },
  aiAgent:     { mp4: `${BASE_PATH}/img/cover/Ai_Agent.mp4`,    webm: `${BASE_PATH}/img/cover/Ai_Agent.webm`,    anim: `${BASE_PATH}/img/cover/Ai_Agent-anim.webp`,    poster: `${BASE_PATH}/img/cover/Ai_Agent-poster.webp` },
} as const;

type CoverVideo = { mp4: string; webm: string; anim: string; poster: string };

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const FolderClosed = ({
  front = "#FFDA85",
  shadow = "#9F5A45",
  outline = "#FBF7EE",
}: {
  front?: string;
  shadow?: string;
  outline?: string;
}) => {
  const gid = useId().replace(/:/g, "");
  const gradId = `fc_grad_${gid}`;
  return (
    <svg
      className="closed"
      width="376"
      height="304"
      viewBox="0 0 376 304"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M87.9258 10.4043C88.9592 5.77375 93.5511 2.85743 98.1816 3.89062L202.989 27.2822C207.62 28.3157 210.536 32.9074 209.503 37.5381L206.048 53.0146L356.964 86.6973C367.548 89.0596 374.214 99.5544 371.852 110.139L332.955 284.419C330.593 295.003 320.097 301.669 309.513 299.307L19.0459 234.479C8.46147 232.117 1.79593 221.622 4.1582 211.037L43.0547 36.7568C45.417 26.1724 55.9126 19.5069 66.4971 21.8691L84.4717 25.8799L87.9258 10.4043Z"
        fill={front}
      />
      <path
        d="M87.9258 10.4043C88.9592 5.77375 93.5511 2.85743 98.1816 3.89062L202.989 27.2822C207.62 28.3157 210.536 32.9074 209.503 37.5381L206.048 53.0146L356.964 86.6973C367.548 89.0596 374.214 99.5544 371.852 110.139L332.955 284.419C330.593 295.003 320.097 301.669 309.513 299.307L19.0459 234.479C8.46147 232.117 1.79593 221.622 4.1582 211.037L43.0547 36.7568C45.417 26.1724 55.9126 19.5069 66.4971 21.8691L84.4717 25.8799L87.9258 10.4043Z"
        fill={`url(#${gradId})`}
        style={{ mixBlendMode: "multiply" }}
      />
      <path
        d="M87.9258 10.4043C88.9592 5.77375 93.5511 2.85743 98.1816 3.89062L202.989 27.2822C207.62 28.3157 210.536 32.9074 209.503 37.5381L206.048 53.0146L356.964 86.6973C367.548 89.0596 374.214 99.5544 371.852 110.139L332.955 284.419C330.593 295.003 320.097 301.669 309.513 299.307L19.0459 234.479C8.46147 232.117 1.79593 221.622 4.1582 211.037L43.0547 36.7568C45.417 26.1724 55.9126 19.5069 66.4971 21.8691L84.4717 25.8799L87.9258 10.4043Z"
        stroke={outline}
        strokeWidth="6"
        vectorEffect="non-scaling-stroke"
      />
      <defs>
        <linearGradient
          id={gradId}
          x1="242.388"
          y1="27.922"
          x2="205.876"
          y2="359.592"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.59647" stopColor="#FBF7EE" />
          <stop offset="0.962107" stopColor={shadow} />
        </linearGradient>
      </defs>
    </svg>
  );
};

const FolderOpen = ({
  tint = "#5D8EF4",
  tint2 = "#96C5C6",
  front = "#FFDA85",
  back = "#E19F7E",
  shadow = "#9F5A45",
  folderOutline = "#FBF7EE",
  sponsorOutline = "#FBF7EE",
  videoOutline = "#FBF7EE",
  thumbnail,
  thumbnailAlt = "",
  coverVideo,
  isOpen = false,
}: {
  tint?: string;
  tint2?: string;
  front?: string;
  back?: string;
  shadow?: string;
  folderOutline?: string;
  sponsorOutline?: string;
  videoOutline?: string;
  thumbnail?: string;
  thumbnailAlt?: string;
  coverVideo?: CoverVideo;
  isOpen?: boolean;
}) => {
  const gid = useId().replace(/:/g, "");
  const gradId = `fo_grad_${gid}`;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /* iOS Safari promotes <foreignObject> contents into their own
     compositing layer that paints ON TOP OF the entire SVG, ignoring
     document paint order. That's why the cover video was rendering in
     FRONT of the folder body on mobile instead of tucked behind the
     front flap like it does on desktop. No amount of clipping or
     wrapper markup fixes it — it's a layer-order problem, not a
     bounds problem.
     Solution: on touch devices, render the cover as a native SVG
     <image> (a poster frame extracted from the video). SVG <image>
     is a real SVG element, so it obeys paint order and sits behind
     the fo-flap-front group exactly like the company sticky does.
     Desktop keeps the live foreignObject video. */
  const [isTouch, setIsTouch] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = window.matchMedia("(hover: none), (pointer: coarse)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setIsTouch(q.matches);
      setReducedMotion(rm.matches);
    };
    update();
    q.addEventListener("change", update);
    rm.addEventListener("change", update);
    return () => {
      q.removeEventListener("change", update);
      rm.removeEventListener("change", update);
    };
  }, []);

  /* Play the cover video when the folder opens; pause and rewind
     when it closes. Reduced-motion users never see the video play.
     Both desktop and mobile hit this same effect — the video lives
     inside a foreignObject sticky slot in the SVG regardless of
     device, so there's one code path. iOS Safari renders the
     foreignObject correctly because the video element sets its
     xhtml xmlns via ref (see the fo-sticky[data-fx-i="1"] group). */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !coverVideo) return;
    if (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    if (isOpen) {
      v.play().catch(() => {});
    } else {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {
        void 0;
      }
    }
  }, [isOpen, coverVideo]);
  return (
    <>
    <svg
      className="open"
      width="410"
      height="324"
      viewBox="0 0 410 324"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="fo-flap-back">
        <path
          d="M107.138 74.9883C109.281 65.3887 118.799 59.3439 128.399 61.4863L391.84 120.282C401.44 122.425 407.485 131.943 405.342 141.543L370.065 299.607C367.922 309.207 358.404 315.253 348.804 313.11L85.3628 254.314C75.7633 252.172 69.7186 242.653 71.8608 233.054L107.138 74.9883Z"
          fill={back}
          stroke={folderOutline}
          strokeWidth="6.6785"
        />
      </g>
      <g className="fo-xstar" data-fx-i="0">
      <path
        d="M383.405 176.641C384.09 177.145 384.186 177.889 384.202 178C384.24 178.258 384.227 178.49 384.216 178.625C384.193 178.918 384.132 179.249 384.068 179.556C383.935 180.191 383.713 181.067 383.457 182.077C382.936 184.134 382.225 186.935 381.602 190.152C380.344 196.643 379.499 204.569 381.158 211.222C382.776 217.707 387.33 223.921 391.593 228.771C393.708 231.177 395.69 233.182 397.154 234.702C397.868 235.443 398.499 236.11 398.933 236.637C399.141 236.89 399.375 237.195 399.546 237.51C399.629 237.664 399.752 237.917 399.817 238.232C399.88 238.539 399.933 239.141 399.562 239.749C399.179 240.375 398.596 240.589 398.368 240.659C398.093 240.744 397.837 240.768 397.666 240.777C397.315 240.795 396.923 240.765 396.56 240.726C395.813 240.646 394.811 240.479 393.671 240.279C391.347 239.87 388.263 239.291 384.807 238.823C377.804 237.873 369.753 237.455 364.016 239.609C356.028 242.606 349.57 247.169 344.979 250.959C342.685 252.853 340.872 254.541 339.548 255.756C338.903 256.349 338.328 256.872 337.882 257.23C337.668 257.401 337.402 257.602 337.122 257.754C336.987 257.827 336.753 257.942 336.457 258.006C336.176 258.067 335.568 258.137 334.948 257.759C334.149 257.271 334.025 256.46 334.001 256.298C333.96 256.023 333.975 255.775 333.989 255.626C334.018 255.308 334.09 254.95 334.168 254.614C334.327 253.921 334.592 252.971 334.899 251.876C335.523 249.649 336.376 246.634 337.134 243.207C338.668 236.276 339.729 228.003 337.926 221.449C336.223 215.258 332.47 208.997 329.111 204.061C327.433 201.596 325.906 199.535 324.776 197.949C324.227 197.178 323.747 196.485 323.421 195.938C323.263 195.674 323.094 195.365 322.976 195.056C322.918 194.903 322.842 194.671 322.81 194.396C322.782 194.146 322.763 193.622 323.079 193.083C323.433 192.479 323.979 192.238 324.298 192.145C324.614 192.054 324.897 192.048 325.067 192.053C325.416 192.063 325.773 192.133 326.059 192.2C326.658 192.339 327.447 192.583 328.313 192.858C330.096 193.424 332.465 194.206 335.217 194.914C340.765 196.342 347.541 197.378 353.509 195.788C360.655 193.885 367.276 189.144 372.291 184.789C374.781 182.627 376.832 180.599 378.328 179.113C379.061 178.384 379.698 177.748 380.169 177.315C380.397 177.106 380.651 176.885 380.892 176.715C381.003 176.637 381.204 176.503 381.458 176.403C381.588 176.351 382.408 176.023 383.261 176.544L383.405 176.641Z"
        fill="#F8E0A8"
        stroke="#D59B6E"
        strokeWidth="3.83596"
      />
      </g>
      {/* X-star (top) — wrapped so it can twinkle on idle */}
      <g className="fo-xstar" data-fx-i="1">
      <path
        d="M105.094 7.08122C105.939 6.98293 106.516 7.46228 106.604 7.53257C106.807 7.69599 106.955 7.87395 107.04 7.98072C107.222 8.21067 107.403 8.49446 107.565 8.76349C107.901 9.31864 108.335 10.1108 108.836 11.0247C109.856 12.8849 111.244 15.4194 112.98 18.1993C116.482 23.8068 121.264 30.1843 127.011 33.9235C132.613 37.5682 140.181 39.0139 146.606 39.6593C149.793 39.9795 152.611 40.0964 154.717 40.2112C155.745 40.2672 156.662 40.3255 157.338 40.4159C157.663 40.4594 158.041 40.523 158.381 40.6373C158.548 40.6932 158.81 40.7946 159.072 40.9809C159.327 41.1627 159.776 41.5673 159.919 42.2651C160.066 42.9844 159.784 43.5387 159.665 43.7452C159.521 43.994 159.35 44.1864 159.232 44.3091C158.987 44.5619 158.68 44.8069 158.387 45.0257C157.786 45.4758 156.938 46.0367 155.967 46.6668C153.989 47.9512 151.337 49.6285 148.488 51.6403C142.715 55.7166 136.537 60.8968 133.805 66.3818C130.001 74.0183 128.382 81.758 127.604 87.6603C127.215 90.6102 127.038 93.0803 126.898 94.8722C126.829 95.745 126.765 96.5205 126.682 97.086C126.642 97.3565 126.584 97.6859 126.483 97.9868C126.434 98.1326 126.341 98.3766 126.168 98.6252C126.004 98.8606 125.606 99.3269 124.895 99.472C123.977 99.6595 123.334 99.1507 123.206 99.0484C122.989 98.8747 122.831 98.6824 122.74 98.5645C122.544 98.3125 122.353 98.0003 122.181 97.7019C121.825 97.0862 121.372 96.2101 120.851 95.1996C119.79 93.144 118.36 90.3567 116.58 87.3312C112.98 81.2134 108.121 74.4345 102.335 70.8653C96.8705 67.4943 89.8574 65.4683 84.035 64.1446C81.1278 63.4836 78.6056 63.0156 76.6979 62.6243C75.7705 62.4341 74.9474 62.2537 74.3364 62.0758C74.0404 61.9896 73.7058 61.8789 73.4092 61.7328C73.2628 61.6607 73.0485 61.543 72.8383 61.363C72.647 61.1991 72.2761 60.8283 72.1403 60.2187C71.9881 59.5353 72.2229 58.9872 72.3938 58.7018C72.5625 58.42 72.7659 58.2232 72.894 58.1103C73.1554 57.8799 73.4651 57.6885 73.7198 57.5421C74.2531 57.2355 74.9971 56.8764 75.818 56.4878C77.5086 55.6875 79.7762 54.6457 82.2726 53.2894C87.3066 50.5544 92.9722 46.6953 96.2576 41.4653C100.191 35.2037 101.807 27.2218 102.511 20.6175C102.86 17.3389 102.98 14.4562 103.062 12.35C103.102 11.3164 103.135 10.4174 103.185 9.77929C103.209 9.47081 103.244 9.13602 103.305 8.84783C103.333 8.71514 103.389 8.4799 103.506 8.23359C103.567 8.10738 103.944 7.30812 104.922 7.10833L105.094 7.08122Z"
        fill="#F8E0A8"
        stroke="#D59B6E"
        strokeWidth="3.83596"
      />
      </g>
      <g className="fo-sticky" data-fx-i="0">
      {thumbnail ? (
        <>
          <image
            href={thumbnail}
            x="235.12"
            y="70.82"
            width="119.764"
            height="119.764"
            preserveAspectRatio="xMidYMid meet"
          >
            {thumbnailAlt ? <title>{thumbnailAlt}</title> : null}
          </image>
          <rect
            x="235.12"
            y="70.82"
            width="119.764"
            height="119.764"
            rx="9.9803"
            fill="none"
            stroke={sponsorOutline}
            strokeWidth="3.83596"
          />
        </>
      ) : (
        <rect
          x="373.685"
          y="98.1076"
          width="121.247"
          height="119.764"
          rx="6.40023"
          transform="rotate(112.879 373.685 98.1076)"
          fill={tint}
          stroke={sponsorOutline}
          strokeWidth="3.83596"
        />
      )}
      </g>
      <g className="fo-xstar" data-fx-i="2">
      <path
        d="M19.6959 125.721C20.4835 125.401 21.1681 125.708 21.2711 125.753C21.5105 125.856 21.7014 125.987 21.8114 126.068C22.0483 126.241 22.2987 126.466 22.5272 126.681C22.9987 127.127 23.6294 127.774 24.3567 128.52C25.837 130.04 27.8522 132.111 30.2685 134.325C35.1428 138.791 41.4563 143.657 47.9944 145.723C54.3673 147.736 62.0462 147.105 68.4096 146.008C71.5665 145.464 74.3121 144.823 76.3728 144.37C77.3779 144.15 78.2768 143.96 78.9524 143.867C79.2772 143.822 79.6591 143.782 80.0175 143.801C80.1926 143.81 80.4721 143.838 80.7743 143.947C81.0693 144.054 81.6101 144.324 81.9341 144.958C82.268 145.612 82.1448 146.221 82.0853 146.452C82.0136 146.73 81.9005 146.961 81.8188 147.111C81.6505 147.421 81.42 147.739 81.1968 148.028C80.7376 148.622 80.071 149.39 79.3041 150.256C77.741 152.023 75.6345 154.349 73.4274 157.049C68.9555 162.521 64.3879 169.165 63.2225 175.181C61.5999 183.557 62.1107 191.448 62.9398 197.343C63.3542 200.29 63.8442 202.717 64.1881 204.481C64.3556 205.34 64.5008 206.105 64.5723 206.672C64.6064 206.943 64.6388 207.276 64.6216 207.593C64.6133 207.747 64.5891 208.007 64.4887 208.293C64.3936 208.563 64.1353 209.119 63.4892 209.449C62.6544 209.875 61.899 209.557 61.7482 209.493C61.4923 209.383 61.2888 209.24 61.1693 209.151C60.9136 208.961 60.6458 208.711 60.4 208.469C59.8931 207.971 59.2217 207.248 58.4491 206.414C56.8774 204.717 54.7541 202.414 52.2296 199.975C47.1246 195.043 40.6285 189.811 34.0989 187.919C27.9319 186.133 20.6324 186.057 14.6681 186.339C11.69 186.479 9.13456 186.703 7.19171 186.836C6.24718 186.901 5.40591 186.947 4.76951 186.939C4.46126 186.936 4.10926 186.918 3.78437 186.857C3.62403 186.827 3.38609 186.771 3.13538 186.653C2.90725 186.547 2.45064 186.288 2.1567 185.737C1.82728 185.12 1.9069 184.529 1.99519 184.208C2.08237 183.891 2.22572 183.647 2.31895 183.504C2.50927 183.212 2.75645 182.945 2.96272 182.736C3.39461 182.298 4.01537 181.753 4.70241 181.159C6.11736 179.935 8.02363 178.325 10.0662 176.35C14.1853 172.369 18.6122 167.135 20.3788 161.216C22.4938 154.131 21.9164 146.007 20.8278 139.455C20.2874 136.203 19.6313 133.393 19.1471 131.342C18.9096 130.335 18.7005 129.46 18.5781 128.832C18.5189 128.528 18.4628 128.196 18.4444 127.902C18.436 127.767 18.4269 127.525 18.4743 127.257C18.4986 127.119 18.648 126.248 19.5376 125.794L19.6959 125.721Z"
        fill="#F8E0A8"
        stroke="#D59B6E"
        strokeWidth="3.83596"
      />
      </g>
      {/* VIDEO STICKY — reimplemented as a single foreignObject with a
         raw HTML <video> whose xhtml namespace is set via ref callback.
         iOS Safari refuses to render HTML descendants inside a
         foreignObject unless the outermost HTML element carries the
         XHTML xmlns attribute, and TypeScript's HTMLVideoElement type
         doesn't expose that attribute — so we set it imperatively.
         MP4 source is listed first so iOS Safari (which can't decode
         VP9-in-WebM reliably) picks the format it can actually play.
         The outline rect sits on top so the sticky border wraps the
         video cleanly at any scale. */}
      <g className="fo-sticky" data-fx-i="1">
      {coverVideo && isTouch ? (
        /* TOUCH — native SVG <image> pointing at an ANIMATED WebP.
           This gets motion AND correct layering: <image> is a real
           SVG element so it obeys paint order (tucks behind the
           fo-flap-front group like the desktop video does), and
           Safari 14+ / Chrome / Firefox all animate animated-WebP
           inside an SVG <image>. Reduced-motion users get the static
           poster instead. */
        <>
          {/* clipPath rounds the poster's corners. The clip rect is
              INSET by half the outline's stroke-width (3.83596 / 2 ≈
              1.92) and given a correspondingly larger corner radius,
              because an SVG stroke straddles its path — half paints
              outward, half inward. Clipping to the exact same rect as
              the stroke leaves the image's square corner visible in
              that inner half. Insetting tucks the image fully under
              the stroke so no corner can poke out. */}
          <defs>
            <clipPath id={`fo_clip_${gid}`}>
              <rect
                x="126.521"
                y="50.473"
                width="115.928"
                height="115.928"
                rx="11.9"
              />
            </clipPath>
          </defs>
          <image
            href={reducedMotion ? coverVideo.poster : coverVideo.anim}
            x="124.603"
            y="48.555"
            width="119.764"
            height="119.764"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#fo_clip_${gid})`}
          >
            {thumbnailAlt ? <title>{thumbnailAlt}</title> : null}
          </image>
          <rect
            x="124.603"
            y="48.555"
            width="119.764"
            height="119.764"
            rx="9.9803"
            fill="none"
            stroke={videoOutline}
            strokeWidth="3.83596"
          />
        </>
      ) : coverVideo ? (
        <>
          <foreignObject
            x="124.603"
            y="48.555"
            width="119.764"
            height="119.764"
          >
            <div
              ref={(el) => {
                if (el) {
                  el.setAttribute(
                    "xmlns",
                    "http://www.w3.org/1999/xhtml"
                  );
                }
              }}
              style={{
                width: "119.764px",
                height: "119.764px",
                overflow: "hidden",
                borderRadius: "9.98px",
                position: "relative",
                display: "block",
              }}
            >
              <video
                ref={(el) => {
                  videoRef.current = el;
                }}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={coverVideo.poster}
                aria-label={thumbnailAlt || undefined}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              >
                <source src={coverVideo.mp4} type="video/mp4" />
                <source src={coverVideo.webm} type="video/webm" />
              </video>
            </div>
          </foreignObject>
          <rect
            x="124.603"
            y="48.555"
            width="119.764"
            height="119.764"
            rx="9.9803"
            fill="none"
            stroke={videoOutline}
            strokeWidth="3.83596"
          />
        </>
      ) : (
        <rect
          x="241.092"
          y="30.3229"
          width="151.267"
          height="119.764"
          rx="6.40023"
          transform="rotate(87.5606 241.092 30.3229)"
          fill={tint2}
          stroke={videoOutline}
          strokeWidth="3.83596"
        />
      )}
      </g>
      {/* front folder cover — same float as back cover so both bottoms stay joined */}
      <g className="fo-flap-front">
        <path
          d="M74.3975 77.3926L74.7295 77.4268L74.8184 77.4395L74.9053 77.4561L175.14 96.6309C177.546 97.0187 179.333 98.7419 180.421 100.582C181.546 102.484 182.186 104.895 182.218 107.543L183.015 115.071L326.721 141.54L326.761 141.547L326.801 141.556C331.518 142.544 335.292 145.06 337.819 148.936C340.252 152.667 341.378 157.42 341.417 162.808L363.455 298.693L363.562 299.352L363.407 300.001C361.209 309.245 351.604 314.758 342.21 312.79L78.9277 257.625L78.8584 257.61L78.79 257.593C73.8675 256.342 69.5145 254.918 66.1172 251.907C62.644 248.829 60.5773 244.481 59.2158 238.3L23.7461 104.127L23.7236 104.042L23.7061 103.955C23.0214 100.672 22.4543 98.0073 22.1533 95.9756C22.0014 94.9502 21.8991 93.9714 21.8984 93.0771C21.8978 92.2038 21.991 91.1979 22.3828 90.2295C22.8136 89.1647 23.5605 88.2621 24.623 87.667C25.5928 87.1239 26.6135 86.9569 27.4502 86.9092C28.6362 86.8416 30.0529 86.9957 31.5518 87.2168L33.0732 87.4551L33.1094 87.4609L33.1465 87.4678L70.7285 94.3896L69.0938 87.958L69.0352 87.7266L69.0098 87.4893C68.8611 86.0936 68.7472 84.0296 69.0801 82.2334C69.2407 81.3668 69.5742 80.1582 70.3984 79.1396C71.3329 77.9848 72.752 77.2759 74.3975 77.3926Z"
          fill={front}
        />
        <path
          d="M74.3975 77.3926L74.7295 77.4268L74.8184 77.4395L74.9053 77.4561L175.14 96.6309C177.546 97.0187 179.333 98.7419 180.421 100.582C181.546 102.484 182.186 104.895 182.218 107.543L183.015 115.071L326.721 141.54L326.761 141.547L326.801 141.556C331.518 142.544 335.292 145.06 337.819 148.936C340.252 152.667 341.378 157.42 341.417 162.808L363.455 298.693L363.562 299.352L363.407 300.001C361.209 309.245 351.604 314.758 342.21 312.79L78.9277 257.625L78.8584 257.61L78.79 257.593C73.8675 256.342 69.5145 254.918 66.1172 251.907C62.644 248.829 60.5773 244.481 59.2158 238.3L23.7461 104.127L23.7236 104.042L23.7061 103.955C23.0214 100.672 22.4543 98.0073 22.1533 95.9756C22.0014 94.9502 21.8991 93.9714 21.8984 93.0771C21.8978 92.2038 21.991 91.1979 22.3828 90.2295C22.8136 89.1647 23.5605 88.2621 24.623 87.667C25.5928 87.1239 26.6135 86.9569 27.4502 86.9092C28.6362 86.8416 30.0529 86.9957 31.5518 87.2168L33.0732 87.4551L33.1094 87.4609L33.1465 87.4678L70.7285 94.3896L69.0938 87.958L69.0352 87.7266L69.0098 87.4893C68.8611 86.0936 68.7472 84.0296 69.0801 82.2334C69.2407 81.3668 69.5742 80.1582 70.3984 79.1396C71.3329 77.9848 72.752 77.2759 74.3975 77.3926Z"
          fill={`url(#${gradId})`}
          style={{ mixBlendMode: "multiply" }}
        />
        <path
          d="M74.3975 77.3926L74.7295 77.4268L74.8184 77.4395L74.9053 77.4561L175.14 96.6309C177.546 97.0187 179.333 98.7419 180.421 100.582C181.546 102.484 182.186 104.895 182.218 107.543L183.015 115.071L326.721 141.54L326.761 141.547L326.801 141.556C331.518 142.544 335.292 145.06 337.819 148.936C340.252 152.667 341.378 157.42 341.417 162.808L363.455 298.693L363.562 299.352L363.407 300.001C361.209 309.245 351.604 314.758 342.21 312.79L78.9277 257.625L78.8584 257.61L78.79 257.593C73.8675 256.342 69.5145 254.918 66.1172 251.907C62.644 248.829 60.5773 244.481 59.2158 238.3L23.7461 104.127L23.7236 104.042L23.7061 103.955C23.0214 100.672 22.4543 98.0073 22.1533 95.9756C22.0014 94.9502 21.8991 93.9714 21.8984 93.0771C21.8978 92.2038 21.991 91.1979 22.3828 90.2295C22.8136 89.1647 23.5605 88.2621 24.623 87.667C25.5928 87.1239 26.6135 86.9569 27.4502 86.9092C28.6362 86.8416 30.0529 86.9957 31.5518 87.2168L33.0732 87.4551L33.1094 87.4609L33.1465 87.4678L70.7285 94.3896L69.0938 87.958L69.0352 87.7266L69.0098 87.4893C68.8611 86.0936 68.7472 84.0296 69.0801 82.2334C69.2407 81.3668 69.5742 80.1582 70.3984 79.1396C71.3329 77.9848 72.752 77.2759 74.3975 77.3926Z"
          stroke={folderOutline}
          strokeWidth="6.6785"
        />
      </g>
      <defs>
        <linearGradient
          id={gradId}
          x1="243.113"
          y1="97.0329"
          x2="218.231"
          y2="361.08"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.59647" stopColor="#FBF7EE" />
          <stop offset="0.962107" stopColor={shadow} />
        </linearGradient>
      </defs>
    </svg>
    </>
  );
};
type FolderTheme = {
  front: string;
  back: string;
  shadow: string;
  outlines: {
    folder: string;
    company: string;
    video: string;
  };
};

type Project = {
  tag: string;
  blurb: ReactNode;
  meta: string[];
  accent: [string, string];
  folder: FolderTheme;
  href: string;
  readTime: string;
  thumbnail?: string;
  thumbnailAlt?: string;
  coverVideo?: CoverVideo;
  outcome?: string;
};

const PROJECTS: Project[] = [
  {
    tag: "inline · Product Design Intern · 2026 · Recommended Features Handed Off ",
    blurb: (
      <>
        I conducted <strong>early-stage exploration for a B2B2C consumer product</strong> by auditing the industry, then verifying{" "}
        <strong>popular patterns and opportunity gaps</strong> through prototyping and multiple rounds of usability testing.
      </>
    ),
    meta: ["NDA", "Product Design", "Competitive Analysis", "Usability Testing", "Iterations"],
    accent: ["#F5B8CB", "#9D9BF5"],
    folder: {
      front: "#7C4A63",
      back: "#5E3349",
      shadow: "#39202F",
      outlines: {
        folder:  "#3B1A26",
        company: "#AF1408",
        video:   "#CFA287",
      },
    },
    href: "/projects/inline",
    readTime: "4 min read",
    thumbnail: FOLDER_THUMB.inline,
    thumbnailAlt: "inline — sponsor logo",
    coverVideo: FOLDER_COVER.inline,
  },
  {
    tag: "Customer Journey Platform · 2026 · Concept Shipped to Beta",
    blurb: (
      <>
        I led concept ideation for an <strong>agentic AI maintenance agent</strong> for a <strong>customer journey
          management platform</strong>, with the sponsor taking the concept to beta a month after handoff.
      </>
    ),
    meta: ["NDA", "UI", "Competitive Analysis", "User Research", "Wireframing", "User Testing"],
    accent: ["#D59B6E", "#E8C77C"],
    folder: {
      front: "#C68D5F",
      back: "#9A6D45",
      shadow: "#5C3924",
      outlines: {
        folder:  "#6E4A28", // ← folder body outline (hand-pick)
        company: "#544F4F", // ← company sticky outline — anonymous mark
        video:   "#CFA287", // ← video sticky outline (shared across all folders)
      },
    },
    href: "/projects/ai-journey-agent",
    readTime: "3 min read",
    thumbnail: FOLDER_THUMB.anonymous,
    thumbnailAlt: "Sponsor anonymized under NDA",
    coverVideo: FOLDER_COVER.aiAgent,
  },
  {
    tag: "Purdue Stack · Design Engineer · 2026 · Platform Ships Fall",
    blurb: (
      <>
        I redesigned Purdue&rsquo;s <strong>student–faculty research collaboration platform</strong>, owning
        design decisions and also contributing <strong>front-end React</strong> alongside a 5-engineer team.
      </>
    ),
    meta: ["Design Systems", "UI", "Design Engineering", "User Research", "User Interviews"],
    accent: ["#F5D967", "#F0707C"],
    folder: {
      front: "#276866",
      back: "#1A4E4C",
      shadow: "#163838",
      outlines: {
        folder:  "#0C2E2D", // ← folder body outline (hand-pick)
        company: "#283370", // ← company sticky outline — Stack
        video:   "#CFA287", // ← video sticky outline (shared across all folders)
      },
    },
    href: "/projects/researchhub",
    readTime: "4 min read",
    thumbnail: FOLDER_THUMB.stack,
    thumbnailAlt: "Purdue Stack — sponsor logo",
    coverVideo: FOLDER_COVER.researchhub,
  },
  {
    tag: "Frogslayer · Co-lead Designer and Researcher · 2025 · Guidelines Shipped ",
    blurb: (
      <>
        I shipped a set of <strong>evidence-based design guidelines</strong> for entertainment and hospitality 
        kiosks, verified from <strong>user research and three rounds of usability testing</strong>.
      </>
    ),
    meta: ["UI", "Interaction Design", "User Research", "Prototyping" ,"Usability Testing"],
    accent: ["#84C0FA", "#53EC9D"],
    folder: {
      front: "#262E3A",
      back: "#171C24",
      shadow: "#3F444E",
      outlines: {
        folder:  "#10141C", // ← folder body outline (hand-pick)
        company: "#897DD5", // ← company sticky outline — Frogslayer
        video:   "#CFA287", // ← video sticky outline (shared across all folders)
      },
    },
    href: "/projects/frogslayer",
    readTime: "6 min read",
    thumbnail: FOLDER_THUMB.frogslayer,
    thumbnailAlt: "Frogslayer — sponsor logo",
    coverVideo: FOLDER_COVER.frogslayer,
  },
];

const MORPH_MS = 460;

type FolderPhase = "rest" | "hovered" | "leaving";

/**
 * ReadPill — cursor-following read-time pill with viewport clamping.
 *
 * Default position is bottom-right of the cursor (x+14, y+18) — reads as
 * "attached to the pointer". When the cursor approaches the viewport
 * right or bottom edge, the pill flips to the LEFT / UP side of the
 * cursor so the pill body never spills off-screen. A small 12px safety
 * margin keeps the pill visually inset from the browser edge.
 *
 * Measurement runs in useLayoutEffect on every position change: cheap
 * getBoundingClientRect() reads, no layout thrash since the pill is
 * position:fixed on its own layer.
 */
function ReadPill({ x, y, label }: { x: number; y: number; label: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [xy, setXy] = useState<{ left: number; top: number }>({
    left: x + 14,
    top: y + 18,
  });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const MARGIN = 12; // safety inset from the browser edge
    const GAP = 14;    // default offset from the cursor tip
    /* Smooth edge clamp — the pill sits at (cursor + GAP) most of the
       time. As the cursor approaches the right/bottom edge, the pill
       slides just enough to keep its far edge at (viewport - MARGIN),
       so it appears to "brake" gracefully rather than flip to the
       other side of the cursor. Math.min caps the position at that
       boundary; Math.max prevents it from going past the near edge
       when the pill is wider than the remaining viewport space. */
    const left = Math.max(
      MARGIN,
      Math.min(x + GAP, vw - w - MARGIN)
    );
    const top = Math.max(
      MARGIN,
      Math.min(y + GAP + 4, vh - h - MARGIN)
    );

    setXy({ left, top });
  }, [x, y, label]);
  return (
    <div
      ref={ref}
      className="read-pill"
      style={{ left: xy.left, top: xy.top }}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

export default function ProjectsV2() {
  const [hoverPill, setHoverPill] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [phases, setPhases] = useState<Record<string, FolderPhase>>({});
  const leavingTimers = useRef<Record<string, number>>({});
  const hoveredId = useRef<string | null>(null);

  // ── 3-D tilt: direct DOM writes so mouse-move never triggers a re-render ──
  const tiltRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleTiltMove = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tag: string
  ) => {
    const wrap = tiltRefs.current[tag];
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;  // −1 → 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;  // −1 → 1
    wrap.style.transition =
      "transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1)";
    wrap.style.transform =
      `perspective(800px) translateX(${x * 18}px) translateY(${y * 14}px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
  };

  const handleTiltLeave = (tag: string) => {
    const wrap = tiltRefs.current[tag];
    if (!wrap) return;
    // Longer spring on leave so it visibly overshoots back to rest
    wrap.style.transition =
      "transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)";
    wrap.style.transform =
      "perspective(800px) translateX(0px) translateY(0px) rotateY(0deg) rotateX(0deg)";
  };
  useEffect(() => {
    return () => {
      Object.values(leavingTimers.current).forEach((t) =>
        window.clearTimeout(t)
      );
    };
  }, []);

  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const folderEls = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setRevealed(Object.fromEntries(PROJECTS.map((p) => [p.tag, true])));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const tag = (e.target as HTMLElement).dataset.folderTag;
          if (tag) setRevealed((r) => (r[tag] ? r : { ...r, [tag]: true }));
          io.unobserve(e.target);
        });
      },
      { rootMargin: "-12% 0px", threshold: 0.12 }
    );
    Object.values(folderEls.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Manual-hover override — set when a user actively hovers a folder
     on any device with hover capability (including narrow PC where
     auto-open is also enabled). While set, the scroll-driven
     pickCentered() below no-ops so the user's explicit choice wins
     over the "which folder is at viewport center" heuristic. Cleared
     the moment the mouse leaves that folder — auto-open then resumes
     and re-selects the currently-centered folder on the next scroll
     tick. */
  const manualHoverRef = useRef<string | null>(null);

  const leaveFolder = (id: string) => {
    if (hoveredId.current === id) hoveredId.current = null;
    setPhases((p) => ({ ...p, [id]: "leaving" }));
    const pending = leavingTimers.current[id];
    if (pending) window.clearTimeout(pending);
    leavingTimers.current[id] = window.setTimeout(() => {
      setPhases((p) => ({ ...p, [id]: "rest" }));
      delete leavingTimers.current[id];
    }, MORPH_MS);
  };
  const enterFolder = (id: string) => {
    const pending = leavingTimers.current[id];
    if (pending) {
      window.clearTimeout(pending);
      delete leavingTimers.current[id];
    }
    if (hoveredId.current && hoveredId.current !== id) {
      leaveFolder(hoveredId.current);
    }
    hoveredId.current = id;
    setPhases((p) => ({ ...p, [id]: "hovered" }));
  };

  // track mouse globally only while a pill is showing
  useEffect(() => {
    if (!hoverPill) return;
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [hoverPill]);

  /* Auto-open on scroll — fires on any layout that stacks the folder
     vertically (single-column). When a folder enters the middle 60% of
     the viewport, enterFolder fires and the folder opens same as
     desktop hover. As the user scrolls past, leaveFolder fires and it
     closes.

     Two gates trigger this behavior:
       (a) Touch devices — (hover: none) OR (pointer: coarse). iOS
           Safari can report (hover: hover) with an external keyboard
           attached, so we broaden to (pointer: coarse) too.
       (b) Narrow desktop viewports — (max-width: 820px). When the PC
           browser is resized to a phone-width vertical shape, the
           layout stacks to single-column and hover cursor targeting
           becomes awkward on a small target; auto-open keeps the
           experience continuous with the mobile-stacked layout.

     The chip vs cursor-follow-pill split is handled purely in CSS:
       - .folder .meta__read (the STATIC chip) is scoped inside
         @media (hover: none) and (pointer: coarse) — so it only shows
         on genuine touch devices.
       - .read-pill (the cursor-following pill) works whenever hover
         is capable, so narrow-desktop viewers still get the follow
         pill behavior — matching what the user asked for. */
  /* Auto-open now runs on ALL viewport widths — the wide-desktop
     horizontal layout gets the same "folder nearest viewport center
     opens" behavior that touch/narrow layouts already had. Manual
     hover still wins over auto-open via `manualHoverRef` (see
     pickCentered's early-return below), so a mouse user pointing at
     a different folder immediately closes the auto-opened one and
     opens the hovered one — the vertical-format interaction now
     applies to horizontal-format too.

     Reactive matchMedia listener on prefers-reduced-motion so users
     who toggle their OS setting mid-session get the correct behavior
     without a reload. */
  const [autoOpenEnabled, setAutoOpenEnabled] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reducedQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAutoOpenEnabled(!reducedQ.matches);
    update();
    reducedQ.addEventListener("change", update);
    return () => reducedQ.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!autoOpenEnabled) return;

    /* Sequential open/close: the currently-open folder must fully
       finish closing BEFORE the newly-centered one opens. Avoids the
       "two folders animating simultaneously" uncanny beat.
       - pendingTagRef: the tag that WANTS to open (updated on every
         pickCentered call, so if the centered folder changes mid-
         close, the latest one wins when the close finishes).
       - closeTimer: null unless a close is in progress. When null,
         pickCentered can trigger a new close+open sequence. When set,
         pickCentered only updates pendingTagRef — the timer callback
         reads the latest value when it fires. */
    let pendingTag: string | null = null;
    let closeTimer: number | null = null;
    const CLOSE_BUFFER_MS = MORPH_MS + 40;

    const pickCentered = () => {
      /* Manual-hover override — the user is actively hovering a folder
         on a narrow PC (auto-open + hover both enabled). Their explicit
         choice wins; skip the "which folder is centered" logic entirely
         until the mouse leaves that folder. */
      if (manualHoverRef.current) return;
      const viewportCenter = window.innerHeight / 2;
      const bandTop = window.innerHeight * 0.2;
      const bandBottom = window.innerHeight * 0.8;
      let bestTag: string | null = null;
      let bestDistance = Infinity;
      Object.entries(folderEls.current).forEach(([tag, el]) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // Skip folders entirely outside the middle 60% band
        if (rect.bottom < bandTop || rect.top > bandBottom) return;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.abs(centerY - viewportCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestTag = tag;
        }
      });

      // Update the target the sequence will resolve to.
      pendingTag = bestTag;

      // Already correctly open — nothing to do.
      if (bestTag && bestTag === hoveredId.current) return;

      // A close sequence is already running — the timer will pick up
      // the latest pendingTag when it fires; don't stack more closes.
      if (closeTimer !== null) return;

      if (hoveredId.current) {
        // Close currently-open folder, then open pendingTag after
        // the close animation completes.
        leaveFolder(hoveredId.current);
        closeTimer = window.setTimeout(() => {
          closeTimer = null;
          if (pendingTag && pendingTag !== hoveredId.current) {
            enterFolder(pendingTag);
          }
        }, CLOSE_BUFFER_MS);
      } else if (bestTag) {
        // Nothing open — open immediately.
        enterFolder(bestTag);
      }
    };

    /* Scroll-driven tracking with rAF throttling. IntersectionObserver
       was missing re-evaluations when two folders both sat inside the
       middle 60% band simultaneously — the observer only fires on
       band boundary crossings, so as the user kept scrolling and one
       folder became MORE centered than the other, no callback fired
       to update. Scroll listener fires on every scroll event, rAF-
       throttled to once per frame max for perf. */
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        pickCentered();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    /* Initial pick on mount so the first-centered folder opens
       without waiting for a scroll event. */
    requestAnimationFrame(pickCentered);
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (closeTimer !== null) window.clearTimeout(closeTimer);
      /* If auto-open leaves a folder open when the user resizes to a
         wide viewport, snap it closed so the desktop hover-driven flow
         takes over from a clean slate. */
      if (hoveredId.current) {
        leaveFolder(hoveredId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenEnabled]);

  return (
    <section id="work" className="section work" data-screen-label="02 Work">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <h2 className="h">Projects</h2>
            <div className="section-subhead">projects I&rsquo;ve worked on</div>
          </div>
        </div>

        <div className="folder-row">
          {PROJECTS.map((p) => {
            const phase = phases[p.tag] ?? "rest";
            const folderArtClass =
              phase === "rest"
                ? "folder-art"
                : `folder-art folder-art--${phase}`;
            return (
              <div
                className={`folder${revealed[p.tag] ? " in" : ""}`}
                key={p.tag}
                ref={(el) => {
                  folderEls.current[p.tag] = el;
                }}
                data-folder-tag={p.tag}
                style={{
                  /* Blurb tint uses the folder's SHADOW color (the
                     darkest of front/back/shadow) at 55% opacity — the
                     earlier `folder.front @ 30%` was too light on
                     amber-toned folders like AI Journey, dropping the
                     white blurb text well under WCAG AA 4.5:1 on cream.
                     Shadow at 55% preserves per-folder color language
                     while producing a rich, dark backdrop that carries
                     white text at any of the 4 folder palettes. */
                  ["--folder-blurb-bg" as string]:
                    hexToRgba(p.folder.shadow, 0.55),
                } as CSSProperties}
              >
                <Link
                  href={p.href}
                  className={folderArtClass}
                  aria-label={`${p.tag} — ${p.readTime}`}
                  onClick={saveHomeScroll}
                  onMouseEnter={(e) => {
                    setPos({ x: e.clientX, y: e.clientY });
                    setHoverPill(p.readTime);
                    /* Flag this as a MANUAL hover so pickCentered
                       (auto-open on narrow PC) yields to the user's
                       explicit choice for as long as the cursor stays
                       on this folder. */
                    manualHoverRef.current = p.tag;
                    enterFolder(p.tag);
                  }}
                  onMouseMove={(e) => handleTiltMove(e, p.tag)}
                  onMouseLeave={() => {
                    setHoverPill(null);
                    /* Release the manual override — the next scroll
                       tick's pickCentered() will re-select whichever
                       folder currently sits closest to viewport
                       center and re-open it. */
                    if (manualHoverRef.current === p.tag) {
                      manualHoverRef.current = null;
                    }
                    leaveFolder(p.tag);
                    handleTiltLeave(p.tag);
                  }}
                  /* Keyboard focus parity — a Tab-navigating user gets
                     the same folder-open, blurb-reveal, follow-pill
                     experience a mouse user does. Without this, the
                     folder just sits closed and keyboard-only visitors
                     have to click through blind. Focus is treated as
                     a manual signal so auto-open on narrow PC also
                     yields to the user's Tab position.
                     Pill is anchored to the folder's top-right corner
                     (via getBoundingClientRect) rather than to a
                     cursor coordinate that focus events don't carry. */
                  onFocus={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPos({ x: rect.right - 8, y: rect.top + 8 });
                    setHoverPill(p.readTime);
                    manualHoverRef.current = p.tag;
                    enterFolder(p.tag);
                  }}
                  onBlur={() => {
                    setHoverPill(null);
                    if (manualHoverRef.current === p.tag) {
                      manualHoverRef.current = null;
                    }
                    leaveFolder(p.tag);
                  }}
                >
                  <div
                    className="folder-tilt-wrap"
                    ref={(el) => { tiltRefs.current[p.tag] = el; }}
                  >
                    <div
                      className="folder-svg"
                      style={{
                        ["--folder-halo" as string]:
                          hexToRgba(p.folder.outlines.folder, 0.42),
                        ["--folder-halo-far" as string]:
                          hexToRgba(p.folder.outlines.folder, 0.22),
                      } as CSSProperties}
                    >
                      <FolderClosed
                        front={p.folder.front}
                        shadow={p.folder.shadow}
                        outline={p.folder.outlines.folder}
                      />
                      <FolderOpen
                        tint={p.accent[0]}
                        tint2={p.accent[1]}
                        front={p.folder.front}
                        back={p.folder.back}
                        shadow={p.folder.shadow}
                        folderOutline={p.folder.outlines.folder}
                        sponsorOutline={p.folder.outlines.company}
                        videoOutline={p.folder.outlines.video}
                        thumbnail={p.thumbnail}
                        thumbnailAlt={p.thumbnailAlt}
                        coverVideo={p.coverVideo}
                        isOpen={phase === "hovered"}
                      />
                    </div>
                  </div>
                </Link>
                <div className="folder-copy">
                  <div className="tag">
                    {p.tag}
                    {p.outcome && (
                      <span className="tag-outcome">
                        <span className="tag-outcome-arrow" aria-hidden="true">→</span>
                        {p.outcome}
                      </span>
                    )}
                  </div>
                  <div className="meta">
                    {p.meta.map((m) => (
                      <span
                        key={m}
                        className={m === "NDA" ? "meta__nda" : undefined}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  {/* Read-time chip — sits just BELOW the meta strip
                      in the copy column flow. On mobile, only visible
                      when the folder is in its "hovered" open state
                      (from the scroll auto-open observer above). CSS
                      gates visibility via .folder:has(.folder-art--hovered). */}
                  <span className="meta__read" aria-label="Estimated read time">
                    {p.readTime}
                  </span>
                  <p className="blurb">{p.blurb}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {hoverPill && (
        <ReadPill x={pos.x} y={pos.y} label={hoverPill} />
      )}
    </section>
  );
}
