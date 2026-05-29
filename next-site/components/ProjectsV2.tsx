"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";

/**
 * ProjectsV2 — port of Claude Design Portoflio/work.jsx
 * Folder cards (closed → open on hover) with sparkle accents.
 */

const FolderClosed = ({
  front = "#FFDA85",
  shadow = "#9F5A45",
}: {
  front?: string;
  shadow?: string;
}) => {
  // Unique gradient id per render — otherwise three FolderClosed
  // instances on the page would collide on `fc_grad` and only the
  // first one's shadow stop would apply to all.
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
        stroke="#FBF7EE"
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
}: {
  tint?: string;
  tint2?: string;
  front?: string;
  back?: string;
  shadow?: string;
}) => {
  // unique gradient id per render so multiple cards don't reuse the same defs
  const gid = useId().replace(/:/g, "");
  const gradId = `fo_grad_${gid}`;
  return (
    <svg
      className="open"
      width="410"
      height="324"
      viewBox="0 0 410 324"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* back folder cover — animates in sync with front so both bottoms stay joined */}
      <g className="fo-flap-back">
        <path
          d="M107.138 74.9883C109.281 65.3887 118.799 59.3439 128.399 61.4863L391.84 120.282C401.44 122.425 407.485 131.943 405.342 141.543L370.065 299.607C367.922 309.207 358.404 315.253 348.804 313.11L85.3628 254.314C75.7633 252.172 69.7186 242.653 71.8608 233.054L107.138 74.9883Z"
          fill={back}
          stroke="#FBF7EE"
          strokeWidth="6.6785"
        />
      </g>
      {/* X-star (right side) — wrapped so it can twinkle on idle */}
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
      {/* tint sticky (blue by default) — wrapped so it can drift on idle */}
      <g className="fo-sticky" data-fx-i="0">
      <rect
        x="373.685"
        y="98.1076"
        width="121.247"
        height="119.764"
        rx="6.40023"
        transform="rotate(112.879 373.685 98.1076)"
        fill={tint}
        stroke="#FBF7EE"
        strokeWidth="3.83596"
      />
      </g>
      {/* X-star (left) — wrapped so it can twinkle on idle */}
      <g className="fo-xstar" data-fx-i="2">
      <path
        d="M19.6959 125.721C20.4835 125.401 21.1681 125.708 21.2711 125.753C21.5105 125.856 21.7014 125.987 21.8114 126.068C22.0483 126.241 22.2987 126.466 22.5272 126.681C22.9987 127.127 23.6294 127.774 24.3567 128.52C25.837 130.04 27.8522 132.111 30.2685 134.325C35.1428 138.791 41.4563 143.657 47.9944 145.723C54.3673 147.736 62.0462 147.105 68.4096 146.008C71.5665 145.464 74.3121 144.823 76.3728 144.37C77.3779 144.15 78.2768 143.96 78.9524 143.867C79.2772 143.822 79.6591 143.782 80.0175 143.801C80.1926 143.81 80.4721 143.838 80.7743 143.947C81.0693 144.054 81.6101 144.324 81.9341 144.958C82.268 145.612 82.1448 146.221 82.0853 146.452C82.0136 146.73 81.9005 146.961 81.8188 147.111C81.6505 147.421 81.42 147.739 81.1968 148.028C80.7376 148.622 80.071 149.39 79.3041 150.256C77.741 152.023 75.6345 154.349 73.4274 157.049C68.9555 162.521 64.3879 169.165 63.2225 175.181C61.5999 183.557 62.1107 191.448 62.9398 197.343C63.3542 200.29 63.8442 202.717 64.1881 204.481C64.3556 205.34 64.5008 206.105 64.5723 206.672C64.6064 206.943 64.6388 207.276 64.6216 207.593C64.6133 207.747 64.5891 208.007 64.4887 208.293C64.3936 208.563 64.1353 209.119 63.4892 209.449C62.6544 209.875 61.899 209.557 61.7482 209.493C61.4923 209.383 61.2888 209.24 61.1693 209.151C60.9136 208.961 60.6458 208.711 60.4 208.469C59.8931 207.971 59.2217 207.248 58.4491 206.414C56.8774 204.717 54.7541 202.414 52.2296 199.975C47.1246 195.043 40.6285 189.811 34.0989 187.919C27.9319 186.133 20.6324 186.057 14.6681 186.339C11.69 186.479 9.13456 186.703 7.19171 186.836C6.24718 186.901 5.40591 186.947 4.76951 186.939C4.46126 186.936 4.10926 186.918 3.78437 186.857C3.62403 186.827 3.38609 186.771 3.13538 186.653C2.90725 186.547 2.45064 186.288 2.1567 185.737C1.82728 185.12 1.9069 184.529 1.99519 184.208C2.08237 183.891 2.22572 183.647 2.31895 183.504C2.50927 183.212 2.75645 182.945 2.96272 182.736C3.39461 182.298 4.01537 181.753 4.70241 181.159C6.11736 179.935 8.02363 178.325 10.0662 176.35C14.1853 172.369 18.6122 167.135 20.3788 161.216C22.4938 154.131 21.9164 146.007 20.8278 139.455C20.2874 136.203 19.6313 133.393 19.1471 131.342C18.9096 130.335 18.7005 129.46 18.5781 128.832C18.5189 128.528 18.4628 128.196 18.4444 127.902C18.436 127.767 18.4269 127.525 18.4743 127.257C18.4986 127.119 18.648 126.248 19.5376 125.794L19.6959 125.721Z"
        fill="#F8E0A8"
        stroke="#D59B6E"
        strokeWidth="3.83596"
      />
      </g>
      {/* tint2 sticky (teal by default) — wrapped so it can drift on idle */}
      <g className="fo-sticky" data-fx-i="1">
      <rect
        x="241.092"
        y="30.3229"
        width="151.267"
        height="119.764"
        rx="6.40023"
        transform="rotate(87.5606 241.092 30.3229)"
        fill={tint2}
        stroke="#FBF7EE"
        strokeWidth="3.83596"
      />
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
          stroke="#FBF7EE"
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
  );
};
// Folder cover theme — only the COVER layers (front, back, multiplied
// shadow stop) are themed per project. The contents inside (X-stars,
// stickies, white outline) stay shared across all three folders.
type FolderTheme = {
  front: string;
  back: string;
  shadow: string;
};

type Project = {
  tag: string;
  // Not shown on the card — retained only as the folder link's
  // accessible name (aria-label) so screen-reader users get a
  // meaningful link target.
  // ReactNode (not string) so blurbs can bold the key phrases — what I
  // did, and why it mattered to the project.
  blurb: ReactNode;
  meta: string[];
  accent: [string, string];
  folder: FolderTheme;
  href: string;
  readTime: string;
};

const PROJECTS: Project[] = [
  {
    tag: "inline · Product Design Intern",
    blurb: (
      <>
        I<strong> researched and analyzed competitors</strong> apps to act as
        a advisor for an event organization app to{" "}
        <strong>successfully stand out in the market</strong>
      </>
    ),
    meta: ["NDA", "Product Design", "Competitor Research", "2026"],
    accent: ["#FF8FA8", "#9D9BF5"],
    // Mulled Plum — a warm wine/berry cover that sits apart from the
    // tan, ink-black, and teal folders. Back steps a notch darker; the
    // shadow stop holds just above black so the multiply gradient keeps
    // depth on the open folder without crushing the bottom edge to mud.
    folder: { front: "#7C4A63", back: "#5E3349", shadow: "#39202F" },
    href: "/projects/inline",
    readTime: "3 min read",
  },
  {
    tag: "AI Customer Journey Management Platform · Designer", //need to update name to support NDA
    blurb: (
      <>
        I <strong>led concept ideation and exploration of an AI Journey Map Maintenance Agent</strong>,{" "}
        to ensure its{" "}
        <strong> user trust and usage</strong>
      </>
    ),
    meta: ["NDA", "UI", "Interaction", "User Research", "2026", "CONCEPTUALIZED"],
    accent: ["#D59B6E", "#E8C77C"],
    // Deep Ink — near-black with a navy cast. The back layer steps a
    // notch LIGHTER (inverted from the usual darker-back pattern)
    // because the front is already so dark that a darker back would
    // vanish; lifting the back gives the open folder some depth read.
    // Shadow stop is held a hair below the front so the multiply
    // gradient still tilts the bottom edge without driving it to mud.
    folder: { front: "#C68D5F", back: "#9A6D45", shadow: "#5C3924" },
    href: "/projects/journeytrack",
    readTime: "3 min read",
  },
  {
    tag: "Purdue Stack · Design Engineer",
    blurb: (
      <>
        I <strong> refined the design system's UI and conducted user research to </strong> for feature implementations{" "}
        relevant to the platform users{" "}
      </>
    ),
    meta: ["Design Systems", "UI", "User Research", "2026", "SHIPPED"],
    accent: ["#F5D967", "#F0707C"],
    // Ocean Blue — the dark teal. Shadow held one notch above pitch-
    // black so multiply doesn't drive the bottom edge to mud.
    folder: { front: "#276866", back: "#1A4E4C", shadow: "#163838" },
    href: "/projects/researchhub",
    readTime: "4 min read",
  },
  {
    tag: "Frogslayer · Co-Lead Designer",
    blurb: (
      <>
        I<strong> co-led the team and ran the usability testing</strong>,{" "}
        turning user insights into a kiosk guideline{" "}
        <strong>Frogslayer adopted as their reference</strong>
      </>
    ),
    meta: ["UI", "Interaction Design", "Usability Testing", "2025"],
    accent: ["#84C0FA", "#53EC9D"],
    // Soft Shell — the warm tan from the new palette
    folder: { front: "#0F1217", back: "#1A2028", shadow: "#050608" },
    href: "/projects/frogslayer",
    readTime: "6 min read",
  },
];

// Duration of the closed↔open morph (must match the keyframes in globals.css).
// After this many ms in the "leaving" phase, the card returns to "rest".
const MORPH_MS = 460;

type FolderPhase = "rest" | "hovered" | "leaving";

export default function ProjectsV2() {
  const [hoverPill, setHoverPill] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Per-folder morph phase, keyed by project.tag. Drives the
  // .folder-art--hovered / .folder-art--leaving CSS hooks. Tracked
  // per-folder so two cards can morph independently when the cursor
  // moves directly from one card onto another.
  const [phases, setPhases] = useState<Record<string, FolderPhase>>({});
  // Pending "leaving → rest" timers, keyed by folder id, so a fast
  // re-enter mid-leave cancels the pending reset.
  const leavingTimers = useRef<Record<string, number>>({});
  // The single folder currently holding the open/hovered pose. Only one
  // folder may be open at a time — entering a new folder force-closes
  // whatever this points at, covering cases where onMouseLeave never
  // fired (e.g. a scroll sliding a new folder under a still cursor).
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
    // Magnetic pull toward the cursor + subtle 3-D tilt.
    // translateX/Y moves the folder toward the mouse (±18px / ±14px);
    // rotateY/X adds the depth lean on top.
    // Spring easing gives physical weight — folder lags then overshoots.
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

  // Per-folder scroll reveal. Each folder card runs its entrance bounce
  // only once IT scrolls into view — observed individually so a card
  // further down the page doesn't fire its animation while still
  // off-screen (the old approach staggered every folder at once the
  // moment the top of the row appeared).
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
    // Enforce one-at-a-time: if another folder is still holding the open
    // pose, send it into its closing morph before this one opens — so two
    // folders are never in the hovered state simultaneously.
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

  return (
    <section id="work" className="section work" data-screen-label="02 Work">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <h2 className="h">Projects</h2>
            <div
              style={{
                fontFamily: "var(--f-mono)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.22em",
                color: "var(--muted)",
                textTransform: "uppercase",
                marginTop: 10,
              }}
            >
              projects I&rsquo;ve worked on
            </div>
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
              // .folder is now a plain <div> so clicks on the copy
              // column do NOT navigate — only the <Link> wrapping the
              // artwork is hit-testable. The grid layout still works
              // because `display: grid` is on .folder regardless of
              // element type.
              <div
                className={`folder${revealed[p.tag] ? " in" : ""}`}
                key={p.tag}
                ref={(el) => {
                  folderEls.current[p.tag] = el;
                }}
                data-folder-tag={p.tag}
              >
                {/* Morph triggers, read-time pill, AND the actual
                    navigation hit-area all live on the .folder-art
                    Link — so the folder is the only thing that
                    responds to hover and click. The copy column
                    below is purely informational. */}
                <Link
                  href={p.href}
                  className={folderArtClass}
                  aria-label={`${p.tag} — ${p.readTime}`}
                  onMouseEnter={(e) => {
                    setPos({ x: e.clientX, y: e.clientY });
                    setHoverPill(p.readTime);
                    enterFolder(p.tag);
                  }}
                  onMouseMove={(e) => handleTiltMove(e, p.tag)}
                  onMouseLeave={() => {
                    setHoverPill(null);
                    leaveFolder(p.tag);
                    handleTiltLeave(p.tag);
                  }}
                >
                  <div
                    className="folder-tilt-wrap"
                    ref={(el) => { tiltRefs.current[p.tag] = el; }}
                  >
                    <div className="folder-svg">
                      <FolderClosed
                        front={p.folder.front}
                        shadow={p.folder.shadow}
                      />
                      <FolderOpen
                        tint={p.accent[0]}
                        tint2={p.accent[1]}
                        front={p.folder.front}
                        back={p.folder.back}
                        shadow={p.folder.shadow}
                      />
                    </div>
                  </div>
                </Link>
                {/* Copy column — wrapped so the .folder grid can place
                    all the text in one cell, with the artwork in the
                    other. Inert: no link, no hover handlers. */}
                <div className="folder-copy">
                  <div className="tag">{p.tag}</div>
                  {/* Meta sits directly under the company · position tag,
                      above the title + description — a quick topic
                      read before the headline. */}
                  <div className="meta">
                    {p.meta.map((m) => (
                      <span key={m}>{m}</span>
                    ))}
                  </div>
                  <p className="blurb">{p.blurb}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* cursor-following read-time pill — bottom-right of cursor */}
      {hoverPill && (
        <div
          className="read-pill"
          style={{ left: pos.x + 10, top: pos.y + 15 }}
          aria-hidden="true"
        >
          {hoverPill}
        </div>
      )}
    </section>
  );
}
