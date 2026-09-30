import io

def patch(path, pairs):
    s = io.open(path, encoding="utf-8").read()
    for i, (o, n) in enumerate(pairs):
        assert o in s, f"{path} #{i}: {o[:70]!r}"
        s = s.replace(o, n)
    io.open(path, "w", encoding="utf-8").write(s)
    print("ok", path)

# ---------------------------------------------------------------- CSS clean-up
patch("src/app/motion-hero.css", [
    ('''/* The gradient word in the H1 drifts slowly across its own gradient. */
.hero-gradient-word {
  background-size: 200% 100%;
}

.js .hero-gradient-word {
  animation: gradient-drift 7s ease-in-out infinite alternate;
}

@keyframes gradient-drift {
  from {
    background-position: 0% 50%;
  }
  to {
    background-position: 100% 50%;
  }
}

''', ''),
    ('''  .js .dash-float em i,
  .js .hero-gradient-word {''', '''  .js .dash-float em i {'''),
])

patch("src/app/motion-brand.css", [
    ('''    #040d1c navy -> black; white strokes and blue glow survive. The hue shift
    moves the video's blue glow toward the brand violet. (A drop-shadow here''',
     '''    #040d1c navy -> black; white strokes and blue glow survive. No hue shift:
    the video's own blue IS the palette now. (A drop-shadow here'''),
    ("filter: contrast(1.45) saturate(1.25) hue-rotate(24deg);", "filter: contrast(1.45) saturate(1.15);"),
])

# ---------------------------------------------------------------- buttons, fills
patch("src/components/ui/index.tsx", [
    ('''  /** Purple -> blue gradient pill with a soft violet bloom — the primary
   *  conversion action. White text on #7C3AED..#2563EB clears 4.5:1 end to end. */
  primary:
    "bg-ai-gradient text-white shadow-glow hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0",
  /** Solid white pill, near-black text — the highest-contrast action on a
   *  black page. `bg-ink` is white on this theme (see globals.css). */
  ink: "bg-ink text-page shadow-pill hover:bg-ink-700 hover:-translate-y-0.5 active:translate-y-0",''',
     '''  /** Solid white pill, navy text — the primary conversion action. The most
   *  contrast on the page without needing a colour to shout; hover warms it
   *  to ice, the brand's signature. (`bg-ink` is white on this theme.) */
  primary:
    "bg-ink text-page shadow-[0_12px_32px_-14px_rgba(108,203,245,0.5)] hover:bg-lime-300 hover:-translate-y-0.5 active:translate-y-0",
  /** Solid royal navy, white text (6.2:1) — for actions on the lighter
   *  surfaces where a white pill would be too loud. */
  ink: "bg-royal text-white shadow-pill hover:bg-brand-500 hover:-translate-y-0.5 active:translate-y-0",'''),
])

patch("src/app/layout.tsx", [
    ('className="bg-ai-gradient rounded-pill sr-only z-[100] px-5 py-3 text-sm font-semibold text-white',
     'className="bg-ink text-page rounded-pill sr-only z-[100] px-5 py-3 text-sm font-semibold'),
])

patch("src/components/sections/common.tsx", [
    ("group-open:bg-ai-gradient group-open:border-transparent", "group-open:bg-royal group-open:border-transparent"),
])

# ---------------------------------------------------------------- homepage copy
patch("src/app/page.tsx", [
    ("      {/* Hero — the command center                                         */}",
     "      {/* Hero                                                              */}"),
    ('''              AI-Powered Digital Transformation Partner''',
     '''              Digital agency &middot; Delhi NCR &amp; across India'''),
    ('''              <span className="text-gradient hero-gradient-word">''',
     '''              <span className="text-signature">'''),
    ('''              {SITE.proposition} Intelligent workflows and digital systems
              designed to raise productivity, cut complexity and scale.''',
     '''              {SITE.proposition} Sites that load fast and get found, apps
              people keep using, and automation that takes repetitive work off
              your team.'''),
    ('''                Start Your AI Journey''', '''                Start a project'''),
    ('''                Explore Solutions''', '''                See our services'''),
    ('''                <p className="stat-num text-gradient">''', '''                <p className="stat-num text-ink">'''),
])

# ---------------------------------------------------------------- header
patch("src/components/layout/Header.tsx", [
    ('''  Navigation from the "Command Center" theme brief. Every label points at a
  real, indexable page:
    Solutions     -> /services, and carries the mega-menu linking all eight''',
     '''  Every label points at a real, indexable page, in plain words:
    Services      -> /services, and carries the mega-menu linking all eight'''),
    ('''  { label: "Solutions", href: "/services", mega: true },''',
     '''  { label: "Services", href: "/services", mega: true },'''),
    ('''                  Build With AI''', '''                  Start a project'''),
])

# ---------------------------------------------------------------- footer
patch("src/components/layout/Footer.tsx", [
    ('''            Aivorraa builds intelligent digital ecosystems for businesses
            entering <span className="text-gradient">the AI era.</span>''',
     '''            Websites that get found, apps that get used, and automation
            that gives your team <span className="text-signature">its week back.</span>'''),
    ('''              Build With AI''', '''              Start a project'''),
    ('''          The closing line from the theme brief, as a statement rather than the
          proposition. PRD §5's one proposition is still stated verbatim in the
          brand column below -- this sits above it as a headline.''',
     '''          A closing line that says what the work does, in plain words. PRD
          §5's one proposition is still stated verbatim in the brand column
          below -- this sits above it as a headline.'''),
])

# ---------------------------------------------------------------- sections
patch("src/components/sections/HorizontalServices.tsx", [
    ('''                Everything you need to build{" "}
                <span className="text-gradient">the AI future</span>''',
     '''                Eight services.{" "}
                <span className="text-signature">One team</span> accountable
                for all of them.'''),
    ('"group-hover:bg-ai-gradient flex h-12', '"group-hover:bg-royal flex h-12'),
])

patch("src/components/sections/WorkflowOS.tsx", [
    ('''                <span className="text-gradient">business result</span>''',
     '''                <span className="text-signature">business result</span>'''),
    ('''            lede="What an Aivorraa automation actually does, step by step. Scroll, and watch the pipeline come online."''',
     '''            lede="What an Aivorraa automation actually does, step by step — built in n8n or Make, with a language model only where it earns its place."'''),
])

patch("src/components/sections/Blueprints.tsx", [
    ('''<span className="text-gradient">in practice</span>''', '''<span className="text-signature">in practice</span>'''),
])

patch("src/components/sections/HeroDashboard.tsx", [
    ("aivorraa &middot; command center", "aivorraa &middot; workflow monitor"),
])
