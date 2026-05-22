/* App — wires up the wordmark with a replay button and the Tweaks panel.
   Tweaks expose: per-letter drop speed/stagger, knock-off travel duration,
   loop on/off + loop delay.
*/
const { useState, useEffect, useCallback, useMemo } = React;

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "letterDur": 460,
  "letterStagger": 170,
  "shootDur": 780,
  "loop": true,
  "loopDelay": 1400
}/*EDITMODE-END*/;

// Drop sequence — letters fall in left-to-right order. The 4-point star
// does NOT drop in; it bursts open at the moment the flying i-dot lands
// on it. The i-dot drops alongside the i body and is then knocked loose
// when the i bounces on impact.
//
// Order of drops (skipping star):
//   A → r → t → i_body → s1 → D → e1 → s2 → i2 → g → n → e2 → r2
function computeTimings(tw) {
  const stag = tw.letterStagger;
  const base = 80;
  const dropOrder = ["A","r","t","i1_body","s1","D","e1","s2","i2","g","n","e2","r2"];
  const letterDelays = {};
  dropOrder.forEach((id, idx) => {
    letterDelays[id] = base + idx * stag;
  });

  // dot drops with the i body
  const dotDropAt = letterDelays.i1_body;
  // i lands and bounces at (delay + letterDur). The bounce frame is when
  // the dot launches — use ~85% of the drop duration so the launch is
  // synced to the visible squash impact.
  const shootStart = letterDelays.i1_body + Math.round(tw.letterDur * 0.86);
  // star bursts at the moment the dot arrives
  const starBurstAt = shootStart + tw.shootDur - 40;
  // a fresh dot is ejected from the star once it's fully open — lands
  // between the star and the D as the middot punctuation
  const ejectAt = starBurstAt + 240;
  const ejectDur = 620;
  // new replacement dot pops onto the i after the original has cleared
  const newDotAt = shootStart + 220;

  // star doesn't have its own drop slot — burst time is handled separately
  letterDelays.star = starBurstAt;

  // glyph order MUST match the GLYPHS array in wordmark.jsx
  const GLYPHS_ORDER = ["A","r","t","i1_body","s1","star","D","e1","s2","i2","g","n","e2","r2"];
  const letterDelaysArr = GLYPHS_ORDER.map(id => letterDelays[id]);

  const lastDrop = letterDelays.r2 + tw.letterDur;
  const starSettle = starBurstAt + 620;
  const ejectSettle = ejectAt + ejectDur;
  const total = Math.max(lastDrop, starSettle, ejectSettle) + 200;

  return {
    letterDur: tw.letterDur,
    letterDelays: letterDelaysArr,
    dotDropAt,
    shootStart,
    shootDur: tw.shootDur,
    starBurstAt,
    ejectAt,
    ejectDur,
    newDotAt,
    total,
  };
}

function App() {
  const [tw, setTweak] = useTweaks(DEFAULTS);
  const [runKey, setRunKey] = useState(0);

  const timings = useMemo(() => computeTimings(tw), [tw]);

  const replay = useCallback(() => setRunKey(k => k + 1), []);

  // auto-loop
  useEffect(() => {
    if (!tw.loop) return;
    const id = setTimeout(() => setRunKey(k => k + 1), timings.total + tw.loopDelay);
    return () => clearTimeout(id);
  }, [runKey, tw.loop, tw.loopDelay, timings.total]);

  // restart whenever any timing tweak changes
  useEffect(() => {
    setRunKey(k => k + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tw.letterDur, tw.letterStagger, tw.shootDur]);

  const subDelay = timings.total - 200;

  return (
    <React.Fragment>
      <div className="stage">
        <Wordmark runKey={runKey} t={timings} />
        <div className="sub" style={{"--sub-delay": `${subDelay}ms`}} key={`sub-${runKey}`}>
          From one scene to multiple scenarios
        </div>
      </div>

      <button className="replay-btn" onClick={replay}>↻ Replay</button>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Letter drop">
          <TweakSlider label="Per-letter duration"
            value={tw.letterDur} min={200} max={700} step={10}
            unit="ms"
            onChange={v => setTweak("letterDur", v)} />
          <TweakSlider label="Letter stagger"
            value={tw.letterStagger} min={60} max={300} step={10}
            unit="ms"
            onChange={v => setTweak("letterStagger", v)} />
        </TweakSection>

        <TweakSection title="Knock-off → star">
          <TweakSlider label="Dot travel duration"
            value={tw.shootDur} min={400} max={1400} step={20}
            unit="ms"
            onChange={v => setTweak("shootDur", v)} />
        </TweakSection>

        <TweakSection title="Loop">
          <TweakToggle label="Auto replay"
            value={tw.loop}
            onChange={v => setTweak("loop", v)} />
          <TweakSlider label="Loop delay"
            value={tw.loopDelay} min={200} max={4000} step={100}
            unit="ms"
            onChange={v => setTweak("loopDelay", v)} />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
