import { addPropertyControls, ControlType } from "framer"
import { useEffect, useRef, useState } from "react"

/**
 * SpotlightOverlay
 *
 * A cursor-driven spotlight reveal. Drop it above any layer in
 * Framer (or use it as a standalone overlay in a React project)
 * and the parent area is dimmed by default; a soft radial pocket
 * at the cursor reveals content beneath at full clarity.
 *
 * Three independent layers, all toggleable from the Framer
 * inspector:
 *
 *   1. DIM           — solid dark layer with a radial-gradient
 *                      mask. Transparent at the cursor pocket,
 *                      opaque outside.
 *   2. HALFTONE EDGE — Lichtenstein dot pattern painted in a ring
 *                      around the spotlight, masked to a band so
 *                      dots only appear at the rim. Adds a printed-
 *                      paper feel to the dim/spotlight transition.
 *   3. WARM GLOW     — soft cream radial light underneath the dim
 *                      that shines through the mask hole. Uses
 *                      mix-blend-mode: screen so it brightens the
 *                      content below it without washing it out.
 *
 * Cursor tracking is attached to the overlay's PARENT so the
 * spotlight follows the mouse anywhere over the layer this is
 * dropped on. When the cursor leaves the parent, the spotlight
 * pocket moves off-screen and the overlay re-dims everything.
 *
 * Reduced-motion users get a static, fully-opaque dim with no
 * mouse tracking (the spotlight effect is purely decorative).
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function SpotlightOverlay(props) {
    const {
        // Overlay sizing
        width,
        height,
        // Unhovered (outside the spotlight)
        dimColor,
        dimOpacity,
        dimBlur,
        // Spotlight shape
        spotlightWidth,
        spotlightHeight,
        spotlightCoreSize,
        edgeSoftness,
        spotlightFade,
        // Halftone edge band
        halftoneEnabled,
        halftoneDotColor,
        halftoneDotSize,
        // Hovered (inside the spotlight)
        glowEnabled,
        glowColor,
        glowIntensity,
        glowSize,
        // Behavior
        followCursor,
        transitionMs,
    } = props

    const rootRef = useRef<HTMLDivElement | null>(null)
    const [pos, setPos] = useState<{ x: number; y: number; active: boolean }>(
        { x: -9999, y: -9999, active: false }
    )

    useEffect(() => {
        if (!followCursor) return
        const el = rootRef.current
        if (!el) return
        // Listen on the PARENT so the spotlight tracks the mouse
        // across the full layer this overlay is dropped on, not
        // just the small interactive surface of the overlay itself.
        const parent = el.parentElement
        if (!parent) return

        // Respect reduced-motion — skip mouse tracking entirely
        // for users who prefer reduced animation. The dim stays
        // fully opaque with no spotlight pocket.
        if (
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return
        }

        const onMove = (e: MouseEvent) => {
            const r = parent.getBoundingClientRect()
            setPos({
                x: e.clientX - r.left,
                y: e.clientY - r.top,
                active: true,
            })
        }
        const onLeave = () => {
            setPos({ x: -9999, y: -9999, active: false })
        }

        parent.addEventListener("mousemove", onMove, { passive: true })
        parent.addEventListener("mouseleave", onLeave)
        return () => {
            parent.removeEventListener("mousemove", onMove)
            parent.removeEventListener("mouseleave", onLeave)
        }
    }, [followCursor])

    // ── Mask geometry ──
    // Spotlight is elliptical (separate width and height) so users
    // can create a circle, a tall vertical beam, or a wide slash.
    // spotlightFade extends the soft falloff beyond the bright
    // core for a gentler transition.
    const coreStop = Math.max(0, Math.min(80, spotlightCoreSize))
    const fadeStop = Math.min(
        100,
        coreStop + (100 - coreStop) * (0.3 + spotlightFade * 0.5)
    )
    const dimMask = `radial-gradient(ellipse ${spotlightWidth}px ${spotlightHeight}px at ${pos.x}px ${pos.y}px, transparent 0%, transparent ${coreStop}%, rgba(0,0,0,${0.4 + edgeSoftness * 0.3}) ${fadeStop}%, black 100%)`

    // ── Halftone EDGE mask ──
    // The halftone layer's mask is a tight RING that hugs the
    // spotlight edge — wider than the bright core, narrower than
    // the dim outside. Dots are visible only inside this ring.
    // Tightened (and slightly larger than the dim's spotlight) so
    // the dot pattern lands precisely on the dim/spotlight
    // transition rather than scattering across the dark area.
    const haloW = Math.round(spotlightWidth * 1.18)
    const haloH = Math.round(spotlightHeight * 1.18)
    const haloInner = Math.max(0, coreStop - 4)
    const haloOuter = Math.min(95, coreStop + 38)
    const halftoneMask = `radial-gradient(ellipse ${haloW}px ${haloH}px at ${pos.x}px ${pos.y}px, transparent 0%, transparent ${haloInner}%, rgba(0,0,0,0.55) ${(haloInner + coreStop) / 2}%, black ${coreStop + 6}%, black ${coreStop + 18}%, rgba(0,0,0,0.4) ${haloOuter}%, transparent 100%)`

    return (
        <div
            ref={rootRef}
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                pointerEvents: "none",
                width: typeof width === "number" ? `${width}px` : width || "100%",
                height: typeof height === "number" ? `${height}px` : height || "100%",
                overflow: "hidden",
            }}
        >
            {/* ── DIM + BLUR LAYER ──
                The primary dark cover. Mask-image cuts a transparent
                pocket at the cursor; outside the pocket the dim is
                fully visible AND `backdrop-filter: blur()` softens
                the content beneath. Because the mask makes this
                element transparent inside the spotlight, the
                backdrop-filter is also "masked off" there — content
                inside the spotlight stays crisp; content outside is
                dimmed AND out-of-focus. */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: dimColor,
                    opacity: dimOpacity,
                    WebkitMaskImage: dimMask,
                    maskImage: dimMask,
                    WebkitBackdropFilter: dimBlur > 0 ? `blur(${dimBlur}px)` : undefined,
                    backdropFilter: dimBlur > 0 ? `blur(${dimBlur}px)` : undefined,
                    transition: `opacity ${transitionMs}ms cubic-bezier(0.16, 1, 0.3, 1)`,
                }}
            />

            {/* ── HALFTONE EDGE ──
                Two stacked radial-dot grids painted in a RING
                around the spotlight (mask is transparent in the
                bright center, opaque in the edge band, transparent
                again outside). Adds a printed-paper transition
                between the bright pocket and the dim outside. */}
            {halftoneEnabled && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `
              radial-gradient(circle, ${halftoneDotColor} ${halftoneDotSize * 0.2}px, transparent ${halftoneDotSize * 0.24}px),
              radial-gradient(circle, ${halftoneDotColor} ${halftoneDotSize * 0.13}px, transparent ${halftoneDotSize * 0.17}px)
            `,
                        backgroundSize: `${halftoneDotSize}px ${halftoneDotSize}px, ${halftoneDotSize * 1.7}px ${halftoneDotSize * 1.7}px`,
                        backgroundPosition: `0 0, ${halftoneDotSize * 0.5}px ${halftoneDotSize * 0.5}px`,
                        WebkitMaskImage: halftoneMask,
                        maskImage: halftoneMask,
                        opacity: pos.active ? 1 : 0,
                        transition: `opacity ${transitionMs}ms cubic-bezier(0.16, 1, 0.3, 1)`,
                    }}
                />
            )}

            {/* ── WARM GLOW ──
                A soft warm radial gradient that brightens the
                spotlight pocket (using mix-blend-mode: screen so it
                only LIFTS what's beneath, never adds harsh color).
                Sits ABOVE the dim so it shines through the mask
                hole, and z-index keeps it below interactive content. */}
            {glowEnabled && (
                <div
                    style={{
                        position: "absolute",
                        left: pos.x,
                        top: pos.y,
                        width: glowSize,
                        height: glowSize,
                        borderRadius: "50%",
                        transform: "translate(-50%, -50%)",
                        background: `radial-gradient(circle, ${withAlpha(glowColor, glowIntensity)} 0%, ${withAlpha(glowColor, glowIntensity * 0.55)} 25%, ${withAlpha(glowColor, glowIntensity * 0.22)} 55%, transparent 80%)`,
                        mixBlendMode: "screen",
                        opacity: pos.active ? 1 : 0,
                        transition: `opacity ${transitionMs}ms cubic-bezier(0.16, 1, 0.3, 1)`,
                        pointerEvents: "none",
                    }}
                />
            )}
        </div>
    )
}

/**
 * Replace the alpha channel of an "rgb(...)" or "rgba(...)" color
 * string with a new alpha value. Used for the warm-glow gradient
 * stops so a single color picker drives multiple gradient stops.
 */
function withAlpha(color: string, alpha: number): string {
    if (typeof color !== "string") return `rgba(255, 222, 158, ${alpha})`
    const rgbaMatch = color.match(
        /^rgba?\(([^)]+)\)$/i
    )
    if (rgbaMatch) {
        const parts = rgbaMatch[1].split(",").map((s) => s.trim())
        const [r, g, b] = parts
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    if (color.startsWith("#")) {
        const hex = color.slice(1)
        const expanded =
            hex.length === 3
                ? hex
                      .split("")
                      .map((c) => c + c)
                      .join("")
                : hex
        const r = parseInt(expanded.slice(0, 2), 16)
        const g = parseInt(expanded.slice(2, 4), 16)
        const b = parseInt(expanded.slice(4, 6), 16)
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    return color
}

SpotlightOverlay.defaultProps = {
    width: "100%",
    height: "100%",
    dimColor: "rgb(8, 6, 5)",
    dimOpacity: 0.78,
    dimBlur: 6,
    spotlightWidth: 520,
    spotlightHeight: 520,
    spotlightCoreSize: 38,
    edgeSoftness: 0.5,
    spotlightFade: 0.5,
    halftoneEnabled: true,
    halftoneDotColor: "rgba(8, 6, 5, 0.95)",
    halftoneDotSize: 7,
    glowEnabled: true,
    glowColor: "rgb(255, 222, 158)",
    glowIntensity: 0.4,
    glowSize: 720,
    followCursor: true,
    transitionMs: 350,
}

addPropertyControls(SpotlightOverlay, {
    // ── Overlay sizing ─────────────────────────────────────────
    width: {
        type: ControlType.String,
        title: "Width",
        defaultValue: "100%",
        description:
            'Overlay width. Use "100%" to fill the parent or a px value (e.g. "800px") for a fixed size.',
    },
    height: {
        type: ControlType.String,
        title: "Height",
        defaultValue: "100%",
        description:
            'Overlay height. Use "100%" to fill the parent or a px value.',
    },

    // ── Unhovered (outside the spotlight) ──────────────────────
    dimColor: {
        type: ControlType.Color,
        title: "Unhovered Color",
        defaultValue: "rgb(8, 6, 5)",
        description: "Color painted over the area OUTSIDE the spotlight.",
    },
    dimOpacity: {
        type: ControlType.Number,
        title: "Unhovered Opacity",
        defaultValue: 0.78,
        min: 0,
        max: 1,
        step: 0.02,
        displayStepper: true,
    },
    dimBlur: {
        type: ControlType.Number,
        title: "Unhovered Blur",
        defaultValue: 6,
        min: 0,
        max: 32,
        step: 0.5,
        unit: "px",
        description:
            "Blurs content beneath the unhovered area. The spotlight pocket stays sharp.",
    },

    // ── Spotlight shape ────────────────────────────────────────
    spotlightWidth: {
        type: ControlType.Number,
        title: "Spotlight Width",
        defaultValue: 520,
        min: 60,
        max: 2000,
        step: 10,
        unit: "px",
    },
    spotlightHeight: {
        type: ControlType.Number,
        title: "Spotlight Height",
        defaultValue: 520,
        min: 60,
        max: 2000,
        step: 10,
        unit: "px",
        description:
            "Set different from Width for an elliptical spotlight (vertical beam, wide slash, etc.).",
    },
    spotlightCoreSize: {
        type: ControlType.Number,
        title: "Bright Core",
        defaultValue: 38,
        min: 0,
        max: 80,
        step: 2,
        unit: "%",
        description:
            "How wide the fully transparent center of the spotlight is.",
    },
    edgeSoftness: {
        type: ControlType.Number,
        title: "Edge Softness",
        defaultValue: 0.5,
        min: 0,
        max: 1,
        step: 0.05,
        description: "0 = hard rim. 1 = very gradual fade.",
    },
    spotlightFade: {
        type: ControlType.Number,
        title: "Spotlight Fade",
        defaultValue: 0.5,
        min: 0,
        max: 1,
        step: 0.05,
        description:
            "How far the soft falloff extends past the bright core. 0 = quick cutoff, 1 = long gentle fade.",
    },

    // ── Halftone edge band ─────────────────────────────────────
    halftoneEnabled: {
        type: ControlType.Boolean,
        title: "Halftone Edge",
        defaultValue: true,
    },
    halftoneDotColor: {
        type: ControlType.Color,
        title: "Dot Color",
        defaultValue: "rgba(8, 6, 5, 0.95)",
        hidden: (props: any) => !props.halftoneEnabled,
    },
    halftoneDotSize: {
        type: ControlType.Number,
        title: "Dot Spacing",
        defaultValue: 7,
        min: 4,
        max: 18,
        step: 1,
        unit: "px",
        hidden: (props: any) => !props.halftoneEnabled,
    },

    // ── Hovered (inside the spotlight) ─────────────────────────
    glowEnabled: {
        type: ControlType.Boolean,
        title: "Hovered Light",
        defaultValue: true,
    },
    glowColor: {
        type: ControlType.Color,
        title: "Hovered Color",
        defaultValue: "rgb(255, 222, 158)",
        description:
            "Color of the warm light inside the spotlight pocket.",
        hidden: (props: any) => !props.glowEnabled,
    },
    glowIntensity: {
        type: ControlType.Number,
        title: "Hovered Intensity",
        defaultValue: 0.4,
        min: 0,
        max: 1,
        step: 0.02,
        hidden: (props: any) => !props.glowEnabled,
    },
    glowSize: {
        type: ControlType.Number,
        title: "Hovered Size",
        defaultValue: 720,
        min: 100,
        max: 2000,
        step: 10,
        unit: "px",
        hidden: (props: any) => !props.glowEnabled,
    },

    // ── Behavior ───────────────────────────────────────────────
    followCursor: {
        type: ControlType.Boolean,
        title: "Follow Cursor",
        defaultValue: true,
        description:
            "Off → static dim with no spotlight (useful for previews).",
    },
    transitionMs: {
        type: ControlType.Number,
        title: "Fade Speed",
        defaultValue: 350,
        min: 0,
        max: 1200,
        step: 25,
        unit: "ms",
        description: "How quickly the spotlight fades in / out.",
    },
})
