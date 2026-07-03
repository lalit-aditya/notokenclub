# notokenclub — Site Refinement Ideas

> Direction: keep the brutalist mono + acid-yellow (#e8ff47) arcade personality, but push it from "fun demos on a page" to "one coherent playable world." Every idea below is chosen to fit what already exists (Pac-Man runner, knight arena, typewriter, Web-Audio SFX) — not to replace it.

---

## 1. What the site already has (audit)

| Feature | State | Verdict |
|---|---|---|
| Splash gate + Enter button | Works, unlocks audio | Keep — upgrade to terminal boot sequence |
| Hero typewriter + per-char SFX | Strong signature moment | Keep, add scramble-decode variant |
| Proximity word highlight (rough SVG rects) | Unique, tactile | Keep — this is brand DNA |
| Draggable Pac-Man + snake + screen shake | Best easter egg on the site | Keep, promote it (see §4) |
| Knight fight arena (pixel sprites) | Charming, self-running | Keep, make interactive (see §6) |
| GSAP ScrollTrigger reveals + parallax | Standard fade/slide-up | Weakest part — most generic. Replace per §3 |
| Custom yellow cursor + fake grab hand | Good | Extend with cursor states |
| Web-Audio synth SFX (glass/wood/click) | Rare level of sound design | Keep, add audio-reactive layer |
| Stats count-up | Generic | Replace with odometer/split-flap |
| Instagram iframe embeds | Heavy, off-brand chrome | Restyle wrapper, lazy-mount on scroll |

---

## 2. Global motion system (foundation first)

These make everything else feel award-tier. Do these before adding new toys.

- **Lenis smooth scroll** (darkroom.engineering — used on most Awwwards SOTD winners). Single script, syncs with ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`. Instantly makes existing parallax feel intentional instead of janky.
- **One shared easing + duration scale.** Right now durations are ad-hoc (0.4/0.55/0.7/1.1s). Define tokens: `--ease-out: cubic-bezier(0.16,1,0.3,1)`, snappy `0.3s` / standard `0.6s` / dramatic `1.0s`. Award sites read as "designed" because motion is consistent.
- **Cursor states.** Custom cursor already exists — grow it: scale-up + "DRAG" label over Pac-Man, sword icon over the fight arena, `✦` particle burst on click. Reference: rauno.me interaction craft, lusion.co cursor morphing.
- **Scroll progress as game HUD.** Thin fixed bar where a tiny Pac-Man eats dots as you scroll the page (dots = sections). On 100%: "LEVEL CLEAR" flash + jingle. Turns a boring progress bar into brand.
- **Reduced-motion + mobile budget.** Every idea below must no-op under `prefers-reduced-motion` (pattern already in the code — keep it). Cap simultaneous rAF loops; pause Pac-Man/knights via IntersectionObserver when off-screen (currently they run forever).

---

## 3. Splash + Hero

- **Terminal boot splash.** Before the copy fades in: fast fake-boot log in Geist Mono — `> initializing notokenclub… > tokens found: 0 > humans found: 20+ > chai: ready ✦` — then the existing splash copy types in. References: poolsuite.net (retro OS boot, FWA winner), basement.studio (brutalist terminal vibes).
- **Text scramble decode on section titles.** Instead of generic slide-up, titles decode from random glyphs (`Ξ∆K7…` → `EVENTS`) over ~0.6s when scrolled into view. Codrops classic, seen on Active Theory work. Cheap (one small class), massive perceived polish, and it matches the mono font perfectly.
- **Kinetic hero on scroll.** Replace the plain `yPercent` parallax: as you scroll past the hero, the typed copy lines shear/slide at different velocities (GSAP `skewY` proportional to scroll velocity — Studio Freight signature). The inline SVG icons pop out and fall with slight rotation (gsap physics or simple gravity tween).
- **Logo dot-matrix reveal.** LOGO.png reconstructed from a grid of `✦` particles that assemble on load and repel from the cursor (canvas, ~200 particles). Reference: Vercel Ship dot-matrix, igloo.inc particle assembly (Awwwards SOTY 2024).

## 4. Community section — promote the Pac-Man

This is the site's best idea; give it stakes.

- **Actual dots to eat.** Scatter pellet dots along the waypoint path; Pac-Man eats them with the classic `waka` synth (Web-Audio already in place). Counter in corner: `PELLETS: 34/120`. When all eaten → the "Coming Soon" events stat flips to reveal the real number — pays off the existing "( once the pacman wins )" copy that currently never resolves.
- **Ghost = token.** One ghost sprite labeled `$TOKEN` chases Pac-Man on the alt path. Pac-Man eating the ghost = the brand joke ("no tokens") made playable. Reference: basement.studio's playable easter eggs, bruno-simon.com's drive-to-explore ethos.
- **Stat odometer.** Replace count-up with mechanical odometer/slot-machine digits (each digit column slides with overshoot + tick SFX). Reference: linear.app number treatments, split-flap departure boards on watches.com-style award sites.
- **Members as pixel crowd.** `40+ members` stat: 40 tiny 8-px pixel humans assemble into the number shape, scatter on hover. Data as playful visualization instead of dead text.

## 5. Events section

- **Split-flap departure board.** Events list rendered as an airport split-flap display: rows flip letter-by-letter into place on scroll (clack SFX from the existing wood-knock synth). "COMING SOON" flipping endlessly is *more* on-brand than a static card while there are no events. Reference: Lufthansa/Vercel conf sites, oh.studio project switcher.
- **Marquee ticker.** Infinite scrolling ticker between sections: `NO TOKENS ✦ JUST HUMANS ✦ CHENNAI ✦ CHAI ✦` — velocity reacts to scroll speed and reverses with scroll direction (GSAP `Observer`). Studio Freight / basement.studio staple.
- **Event cards: image-trail hover.** On card hover, small event photos trail the cursor and fall away (Codrops image-trail pattern, seen across Awwwards SOTD). Works once real events with photos exist.

## 6. Fight arena

- **Betting mini-game.** Before a bout: "PICK YOUR KNIGHT" (A/B). Win = confetti of `✦` + streak counter in `localStorage` (`W3 STREAK`). Loss = the existing chill-popup sass. Zero new assets — pure choreography reuse.
- **Scroll-triggered entrances.** Knights sprint in from opposite edges of the viewport when the section enters view (they already have run GIFs + sprint-in code — wire it to ScrollTrigger instead of autoplay).
- **Health bars.** Tiny retro HP bars above each knight during exchanges, chipping per hit. Sells the fight as a real system, costs ~30 lines.

## 7. Motive / Barter section

- **Two-column tug-of-war.** The Newbie/Expert toggle becomes a physical metaphor: cards sit on a seesaw/scale SVG that tilts toward the selected side with spring physics (`back.out` overshoot). "Knowledge barter" literally visualized as balancing scales.
- **Line-by-line manifesto reveal.** Manifesto text reveals per-line with a masked slide-up (SplitText or manual `<span>` wrap + `overflow:hidden` lines) as you scroll — the standard on typography-led Awwwards winners (family.co, humaan.com) and far stronger than the current blur-fade.

## 8. Social + Join

- **Restyled reel frames.** Wrap Instagram iframes in CRT bezels: scanline overlay + slight barrel curve + phosphor-green glow on hover — turns off-brand embeds into on-brand arcade cabinets. Mount iframes only when scrolled near (they're currently the heaviest thing on the page).
- **"WANT IN?" magnetic buttons.** Buttons attract the cursor within ~80px and depress like arcade buttons on click (existing SFX already differentiates them). Magnetic buttons: seen on virtually every SOTD since 2020 (dennissnellenberg.com is the canonical reference).
- **Join = INSERT COIN.** The primary CTA styled as `INSERT COIN ▮` with blinking cursor; on click, coin-drop synth + screen flash before the form link opens. The whole arcade metaphor converges on the conversion point.

## 9. Ambient / easter eggs

- **Audio-reactive background.** While bg music plays: a faint waveform/starfield of `✦` in the page background pulses to an AnalyserNode on the existing `<audio>`. Sound design is already the site's differentiator — make it visible. Reference: poolsuite.net, Active Theory audio work.
- **Konami code.** `↑↑↓↓←→←→BA` → all knights on screen multiply to max and a `GOD MODE` toast appears. Costs 15 lines, earns screenshots.
- **CRT flicker on idle.** After 60s idle: subtle scanline + flicker overlay, "STILL THERE? PRESS ANY KEY" in mono. Any input clears it.
- **404 page = playable snake** using the existing snake segments. neal.fun energy; people share 404s like this.

---

## 10. Reference shelf (award-winning)

| Site | Steal this |
|---|---|
| **lusion.co** (Awwwards SOTY '23) | Cursor morphing, physics playfulness, restraint between set-pieces |
| **igloo.inc** (Awwwards SOTY '24) | Particle assembly, scroll-as-narrative pacing |
| **basement.studio** | Brutalist arcade tone, playable easter eggs, marquee tickers |
| **poolsuite.net** (FWA) | Retro OS boot, sound-first identity |
| **bruno-simon.com** | "The site is a game" conviction |
| **darkroom.engineering (Lenis)** | Smooth scroll foundation |
| **dennissnellenberg.com** (SOTD) | Magnetic buttons, page transitions |
| **family.co / humaan.com** | Masked line-by-line type reveals |
| **rauno.me** | Micro-interaction craft, cursor states |
| **neal.fun** | Toys people share |
| **Codrops (tympanus.net)** | Text scramble, image trail — ready-made patterns |

---

## 11. Build order

**Quick wins (a weekend, no new deps beyond Lenis):**
1. Lenis smooth scroll + easing tokens
2. Text scramble on section titles
3. Marquee ticker
4. Magnetic buttons + INSERT COIN CTA
5. Konami code + 404 snake

**Signature upgrades (next):**
6. Pac-Man pellets + ghost + events-stat payoff
7. Split-flap events board
8. Scroll-HUD Pac-Man progress bar
9. Knight betting + health bars

**Big bets (only if time):**
10. Dot-matrix logo particles
11. Audio-reactive background
12. CRT reel frames

**Guardrails:** everything behind `prefers-reduced-motion` checks; rAF loops pause off-screen; no WebGL/three.js — the brand is 2D pixel arcade, and staying dependency-light keeps the single-file architecture.

---

## 12. Data updates (refined from data.md)

Facts: **two events done — Chennai and Coimbatore.** Zero papers published so far. Gallery needed.

- **Footprint section — pixel India map.** India rendered as a dot-matrix pixel grid (on-brand, no SVG geodata needed). Chennai and Coimbatore blink hard yellow with glow + labels; districts within 2 cells pulse low-yellow with randomized delays ("waking up"). Legend: two events ✦ two cities, "your city next?" CTA → join.
- **Stats updated.** Members 40+, cities = 2 (chennai ✦ coimbatore), events stat reveals **02** when the pac-man wins.
- **Research section.** Big "00▮" papers-published counter (blinking cursor), copy: "we read papers every week. wrote zero… try to publish one na ✦", and a **mail us @** button → `mailto:` (subject prefilled "notokenclub ✦ research").
- **Gallery section — futuristic memory cards.** Holo/CRT slot cards: scanline overlay + diagonal light-sweep on hover. Event 01 — Chennai and Event 02 — Coimbatore slots ("memory card loading…") + empty future slots. Drop real photos in later; the frame system is ready.
- **Scroll HUD strip** is a thin blue rectangular bar (user request) with pac-man + section dots riding it.
