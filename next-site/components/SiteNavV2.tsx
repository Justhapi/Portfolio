"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const SECTIONS = ["hero", "work", "about", "connect"] as const;
type SectionId = (typeof SECTIONS)[number];

const LABELS: Record<SectionId, string> = {
  hero: "Index",
  work: "Work",
  about: "About",
  connect: "Connect",
};

type NavDropdownItem = { name: string; slug: string; icon?: React.ReactNode };

/** Work submenu — project names. Selecting one scrolls to that
    project's own folder card inside the Work section (matched via
    ProjectsV2's data-slug) instead of navigating to its full
    case-study page. Desktop hover/focus only — see the
    .nav-dropdown-mask mobile override in globals.css; the hamburger
    menu's own vertical dropdown isn't rebuilt to nest this. */
const WORK_ITEMS: NavDropdownItem[] = [
  { name: "inline", slug: "inline" },
  { name: "AI Journey Agent", slug: "ai-journey-agent" },
  { name: "Purdue Stack", slug: "researchhub" },
  { name: "Frogslayer", slug: "frogslayer" },
];

/** Connect submenu — Resume / Email / LinkedIn. Selecting one scrolls
    to that row inside the Connect section (matched via ConnectV2's
    data-slug) instead of opening the resource directly. */
const CONNECT_ITEMS: NavDropdownItem[] = [
  {
    name: "Resume",
    slug: "resume",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2h5l3 3v9H4z" />
        <path d="M9 2v3h3" />
      </svg>
    ),
  },
  {
    name: "Email",
    slug: "email",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3.5" width="12" height="9" rx="1.2" />
        <path d="M2.5 4.5 8 9l5.5-4.5" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    slug: "linkedin",
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M3.6 5.9H1.3V13h2.3V5.9ZM2.45 4.9a1.35 1.35 0 1 0 0-2.7 1.35 1.35 0 0 0 0 2.7ZM5.3 5.9h2.2v1h.03c.31-.58 1.06-1.2 2.18-1.2 2.33 0 2.76 1.5 2.76 3.45V13H10.2V9.6c0-.83-.02-1.9-1.18-1.9-1.18 0-1.36.9-1.36 1.83V13H5.3V5.9Z" />
      </svg>
    ),
  },
];

function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("hero");

  useEffect(() => {
    const update = () => {
      const probeY = window.innerHeight * 0.35;
      let current: SectionId = "hero";

      for (const id of SECTIONS) {
        if (id === "connect") {
          const scene = document.querySelector<HTMLElement>(".ac-scene");
          const aboutEl = document.querySelector<HTMLElement>(".about");
          if (scene && aboutEl) {
            const threshold =
              scene.offsetTop + aboutEl.offsetHeight * 0.5;
            if (window.scrollY >= threshold) {
              current = "connect";
            }
          }
          continue;
        }
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY) current = id;
      }

      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return active;
}

function smoothScrollTo(id: string) {
  if (id === "hero") {
    // #hero is position: sticky, top: 0 — meaning when the user is
    // scrolled down the hero element is "pinned" at the top of the
    // viewport. scrollIntoView reads the element's rendered position
    // (top: 0 in viewport coords) and thinks it's already in view,
    // so the page never scrolls. Scroll the window to absolute top
    // instead — the hero will smoothly come back into focus and any
    // sections layered on top of it will scroll off.
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if (id === "about") {
    // #about is position:absolute inside .ac-scene, so its offsetTop is
    // 0 relative to ac-scene rather than an absolute page Y. Using
    // offsetTop directly would send the user back to the very top of
    // the page. The "About" moment is when ac-scene enters the viewport
    // (About covers Connect from the top of the scene), so scroll to
    // ac-scene's offsetTop instead.
    const scene = document.querySelector<HTMLElement>(".ac-scene");
    if (scene) {
      window.scrollTo({ top: scene.offsetTop, behavior: "smooth" });
      return;
    }
  }
  if (id === "connect") {
    // #connect is sticky behind About — scrollIntoView lands at the top of
    // .ac-scene (About still covering it). We need to scroll past About's
    // full height so Connect is completely revealed.
    const scene = document.querySelector<HTMLElement>(".ac-scene");
    const about = document.querySelector<HTMLElement>(".about");
    if (scene && about) {
      window.scrollTo({ top: scene.offsetTop + about.offsetHeight, behavior: "smooth" });
      return;
    }
  }
  const el = document.getElementById(id);
  if (!el) return;
  // Prefer window.scrollTo over scrollIntoView so Lenis's smooth-scroll
  // wrapper reliably picks up the scroll intent — scrollIntoView can
  // race against Lenis's own RAF loop on some browsers. offsetTop is
  // relative to the offsetParent (usually body), so it maps directly
  // to the absolute Y position we need.
  window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
}

/** Scroll a specific element (e.g. one project's folder card, or one
    Connect row) into view, centered — used by the Work/Connect submenu
    items. Same Lenis-safe approach as smoothScrollTo above: computed
    via getBoundingClientRect + window.scrollY rather than offsetTop,
    since these targets sit inside sections (.ac-scene's sticky/absolute
    stack) where offsetTop is relative to the wrong ancestor; and via
    window.scrollTo rather than el.scrollIntoView, since scrollIntoView
    can race Lenis's own RAF loop. */
function scrollElementIntoView(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const target = rect.top + window.scrollY - window.innerHeight / 2 + rect.height / 2;
  window.scrollTo({ top: Math.max(target, 0), behavior: "smooth" });
}

/** 4-pointed sparkle SVG used as the bullet on each nav option. */
const NavSpark = () => (
  <svg
    className="nav-spark"
    viewBox="0 0 100 100"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M48 6 C48 26 26 48 6 48 Q2 50 6 52 C26 52 48 74 48 94 Q50 98 52 94 C52 74 74 52 94 52 Q98 50 94 48 C74 48 52 26 52 6 Q50 2 48 6 Z" />
  </svg>
);

/** Hamburger / close icon for the mobile menu toggle. */
const MenuIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`nav-menu-icon${open ? " is-open" : ""}`}
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    {/* Top bar → becomes top arm of X */}
    <line
      className="bar bar-1"
      x1="3" y1="5.5" x2="17" y2="5.5"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
    />
    {/* Middle bar → fades out when open */}
    <line
      className="bar bar-2"
      x1="3" y1="10" x2="17" y2="10"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
    />
    {/* Bottom bar → becomes bottom arm of X */}
    <line
      className="bar bar-3"
      x1="3" y1="14.5" x2="17" y2="14.5"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
    />
  </svg>
);

/** Hover/focus-driven open state for a Work/Connect submenu — desktop
    only (mobile hides .nav-dropdown-mask entirely; see globals.css).
    Hover-capable pointers open on mouseenter with a short grace-period
    close, so crossing the gap from the nav-link down to the panel
    doesn't dismiss it. This only adds that reveal on top of the
    section link's existing click behavior — its onClick (scroll to
    that section) is left completely untouched. */
function useSubmenu(
  id: "work" | "connect",
  openId: "work" | "connect" | null,
  setOpenId: (v: "work" | "connect" | null | ((prev: "work" | "connect" | null) => "work" | "connect" | null)) => void
) {
  const closeTimer = useRef<number | null>(null);
  const [hoverCapable, setHoverCapable] = useState(false);
  useEffect(() => {
    setHoverCapable(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);
  const isOpen = openId === id;
  const open = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenId(id);
  };
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenId((v) => (v === id ? null : v)), 150);
  };
  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };
  return { isOpen, hoverCapable, open, scheduleClose, cancelClose };
}

export default function SiteNavV2() {
  const active = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  // sliding highlight — measure the active link and translate to it.
  const pillRef = useRef<HTMLDivElement | null>(null);
  const [hl, setHl] = useState({ x: 0, y: 0, w: 0, h: 0, visible: false });

  // Work / Connect hover submenus.
  const [subOpenId, setSubOpenId] = useState<"work" | "connect" | null>(null);
  const work = useSubmenu("work", subOpenId, setSubOpenId);
  const connect = useSubmenu("connect", subOpenId, setSubOpenId);

  // Close the open submenu on outside click or Escape — same pattern as
  // the mobile menu's own effect below, kept separate since the two
  // are independent (a submenu can be open without the mobile menu).
  useEffect(() => {
    if (!subOpenId) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest(".nav-dropdown-trigger")) return;
      setSubOpenId(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSubOpenId(null);
    };
    document.addEventListener("click", onDocClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [subOpenId]);

  // While the mobile menu is open: Esc closes, outside click closes, and
  // Tab is trapped within the nav so keyboard users can't escape into the
  // visually-hidden page behind the overlay. Scroll no longer closes —
  // that was killing the menu whenever a user hit Space / PageDown while
  // still inside it. Esc + outside click already cover intent.
  useEffect(() => {
    if (!menuOpen) return;
    const nav = navRef.current;
    if (!nav) return;

    const getFocusable = () =>
      Array.from(
        nav.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ),
      ).filter((el) => !el.hasAttribute("aria-hidden"));

    const focusable = getFocusable();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    // Move focus into the menu so keyboard users land inside it on open.
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab" || focusable.length === 0) return;
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    const onOutside = (e: MouseEvent) => {
      if (!nav.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onOutside);
    };
  }, [menuOpen]);

  useLayoutEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;
    const measure = () => {
      const el = pill.querySelector<HTMLElement>(".nav-link.active");
      if (!el) {
        setHl((s) => ({ ...s, visible: false }));
        return;
      }
      // getBoundingClientRect deltas instead of offsetLeft/offsetTop:
      // Work/Connect's nav-link now sits inside a position:relative
      // .nav-dropdown-trigger wrapper (the submenu's anchor point),
      // which makes that wrapper the link's offsetParent instead of
      // nav-pill — offsetLeft/offsetTop would measure relative to the
      // wrong box for those two links specifically. getBoundingClientRect
      // is immune to any intermediate positioned ancestors.
      const pillRect = pill.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setHl({
        x: elRect.left - pillRect.left,
        y: elRect.top - pillRect.top,
        w: el.offsetWidth,
        h: el.offsetHeight,
        visible: true,
      });
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(pill);
    pill.querySelectorAll<HTMLElement>(".nav-link").forEach((el) => ro.observe(el));

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  return (
    <nav
      className={`nav${menuOpen ? " is-menu-open" : ""}`}
      aria-label="Section navigation"
      ref={navRef}
    >
      <div className="nav-inner">
        <a
          className="nav-mark"
          href="#hero"
          onClick={(e) => {
            // #hero is position:sticky so scrollIntoView never fires — we
            // need window.scrollTo(0). Intercept, then clear the URL hash
            // via history.replaceState so the visible URL stays at "/".
            e.preventDefault();
            smoothScrollTo("hero");
            history.replaceState(null, "", window.location.pathname);
            setMenuOpen(false);
          }}
        >
          <span>
            <em style={{ fontStyle: "italic" }}>Kathleen</em>&nbsp;Li
          </span>
        </a>

        {/* Desktop pill — hidden on mobile unless menu is open */}
        <div className="nav-pill" ref={pillRef}>
          <span
            className="nav-pill-highlight"
            aria-hidden="true"
            style={{
              transform: `translate(${hl.x}px, ${hl.y}px)`,
              width: hl.w,
              height: hl.h,
              opacity: hl.visible ? 1 : 0,
            }}
          />
          {SECTIONS.slice(1).map((id) => {
            const linkClick = (e: React.MouseEvent) => {
              // Intercept the browser's native anchor jump for every
              // section link so scrolling flows through smoothScrollTo,
              // which uses window.scrollTo(smooth) — Lenis-friendly and
              // consistent across links. #connect needs a bespoke jump
              // target (past About's height), and other sections need
              // window.scrollTo instead of scrollIntoView to avoid
              // racing Lenis. history.pushState preserves the URL hash
              // so Back / Forward and share-links still work.
              e.preventDefault();
              smoothScrollTo(id);
              history.pushState(null, "", `#${id}`);
              setMenuOpen(false);
            };

            if (id !== "work" && id !== "connect") {
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`nav-link ${active === id ? "active" : ""}`}
                  aria-current={active === id ? "page" : undefined}
                  onClick={linkClick}
                >
                  <NavSpark />
                  <span className="nav-link-label">{LABELS[id]}</span>
                </a>
              );
            }

            // Work / Connect additionally get a hover/focus submenu.
            // Wrapped in .nav-dropdown-trigger (position:relative) so
            // the dropdown anchors under this specific word rather than
            // the whole pill — the link's own click behavior above is
            // untouched, this only layers a hover/focus reveal on top.
            const sub = id === "work" ? work : connect;
            const items = id === "work" ? WORK_ITEMS : CONNECT_ITEMS;
            return (
              <div
                key={id}
                className="nav-dropdown-trigger"
                onMouseEnter={sub.cancelClose}
                onMouseLeave={() => sub.hoverCapable && sub.scheduleClose()}
              >
                <a
                  href={`#${id}`}
                  className={`nav-link ${active === id ? "active" : ""}`}
                  aria-current={active === id ? "page" : undefined}
                  aria-expanded={sub.isOpen}
                  onClick={linkClick}
                  onMouseEnter={() => sub.hoverCapable && sub.open()}
                  onFocus={sub.open}
                >
                  <NavSpark />
                  <span className="nav-link-label">{LABELS[id]}</span>
                </a>
                <div className={`nav-dropdown-mask${sub.isOpen ? " is-open" : ""}`}>
                  <div className="nav-dropdown-panel">
                    {items.map((item, i) => (
                      <a
                        key={item.slug}
                        href={`#${id}`}
                        className="nav-dropdown-tile"
                        style={{ transitionDelay: sub.isOpen ? `${i * 40}ms` : "0ms" }}
                        tabIndex={sub.isOpen ? 0 : -1}
                        onClick={(e) => {
                          // Jump to this item's own element inside the
                          // section (a project's folder card, or a
                          // Connect row) instead of navigating away or
                          // opening the resource directly.
                          e.preventDefault();
                          setSubOpenId(null);
                          if (id === "work") {
                            const el = document.querySelector<HTMLElement>(`[data-slug="${item.slug}"]`);
                            if (el) scrollElementIntoView(el);
                            else smoothScrollTo(id);
                          } else {
                            // Connect's rows live inside the pinned
                            // .ac-scene reveal stack that smoothScrollTo's
                            // own "connect" branch has to special-case
                            // (scrolling past About's full height, not to
                            // Connect's own offsetTop). A generic
                            // getBoundingClientRect offset for one row
                            // doesn't account for that scroll-jacking and
                            // undershoots — landing between About and
                            // Connect instead of on the fully revealed
                            // section. The three rows sit close together
                            // anyway, so just land on the section itself.
                            smoothScrollTo("connect");
                          }
                          history.pushState(null, "", `#${id}`);
                          setMenuOpen(false);
                        }}
                      >
                        {item.icon && (
                          <span className="nav-dropdown-icon" aria-hidden="true">
                            {item.icon}
                          </span>
                        )}
                        <span className="nav-dropdown-tile-name">{item.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile menu toggle — only shown on narrow viewports */}
        <button
          type="button"
          className={`nav-menu-toggle${menuOpen ? " is-open" : ""}`}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>
    </nav>
  );
}
