import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const values = [
  {
    tag: 'Local first',
    heading: 'From kitchens that know this city.',
    body: "Every dish on Khaja comes from someone who grew up eating it. Not a cloud kitchen replicating a trend — a home cook who learned this recipe from their ama, or a theka that's been feeding the same neighbourhood for fifteen years.",
  },
  {
    tag: 'No pretense',
    heading: 'Dal bhat is not a trend.',
    body: "We don't dress up Nepali food to make it palatable to someone who's never been here. Sekuwa is smoky and imprecise. Momo achar is aggressively tangy. Chiya is sweet in a way that polite tea isn't. That's the point.",
  },
  {
    tag: 'Actually fast',
    heading: 'Dharan is a small city. Use that.',
    body: "Most of what you order is within 3 kilometres of where you're sitting. We built Khaja around that fact — not despite it. No warehouse. No central hub. Just a direct line between your order and the kitchen that made it.",
  },
]

function About() {
  return (
    <div className="bg-cream dark:bg-surface-dark min-h-screen">
      {/* Hero — editorial opener */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        <p className="font-body text-xs uppercase tracking-[0.22em] text-chili font-semibold mb-8">
          About Khaja
        </p>

        <h1 className="font-display text-4xl md:text-6xl font-bold text-ink dark:text-text-dark leading-none tracking-tight">
          We built this
          <br />
          because we were
          <br />
          tired of bad options.
        </h1>

        <div
          className="h-0.75 w-16 bg-chili mt-10 mb-10"
          style={{
            maskImage:
              'linear-gradient(90deg, black 0%, black 70%, transparent 100%)',
          }}
        />

        <p className="font-body text-lg text-ink/75 dark:text-text-dark/75 leading-relaxed max-w-xl">
          Khaja started in Dharan in 2024. Two friends, one laptop, and a
          genuine frustration that the food this city makes — some of the best
          in the country — was impossible to get delivered without it arriving
          cold, wrong, or from a kitchen you'd never heard of.
        </p>
      </section>

      {/* Thin full-width rule */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="h-px bg-ink/8 dark:bg-border-dark w-full" />
      </div>

      {/* Quote callout */}
      <section className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <blockquote className="relative pl-6 border-l-2 border-chili">
          <p className="font-display text-2xl md:text-3xl font-semibold text-ink dark:text-text-dark leading-snug">
            "The best momo in the city isn't in a restaurant.
            It's in someone's kitchen on a Tuesday afternoon."
          </p>
          <footer className="mt-4 font-body text-sm text-ink/50 dark:text-text-dark/50">
            — What we kept saying until we did something about it
          </footer>
        </blockquote>
      </section>

      {/* Thin rule */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="h-px bg-ink/8 dark:bg-border-dark w-full" />
      </div>

      {/* Values — three stamped blocks */}
      <section className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <p className="font-body text-xs uppercase tracking-[0.22em] text-ink/40 dark:text-text-dark/40 font-semibold mb-12">
          What we actually stand for
        </p>

        <div className="flex flex-col gap-14">
          {values.map((item, i) => (
            <div key={item.tag} className="grid md:grid-cols-[80px_1fr] gap-4 md:gap-10">
              {/* Index number */}
              <div className="hidden md:block font-display text-5xl font-bold text-ink/8 dark:text-text-dark/8 select-none leading-none mt-1">
                {String(i + 1).padStart(2, '0')}
              </div>

              <div>
                {/* Stamped tag */}
                <span className="inline-block font-body text-[10px] uppercase tracking-[0.18em] font-bold text-cardamom border border-cardamom/30 px-2.5 py-1 rounded-full mb-4">
                  {item.tag}
                </span>

                <h2 className="font-display text-2xl md:text-3xl font-bold text-ink dark:text-text-dark leading-tight mb-4">
                  {item.heading}
                </h2>

                <p className="font-body text-base text-ink/65 dark:text-text-dark/65 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Thin rule */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="h-px bg-ink/8 dark:bg-border-dark w-full" />
      </div>

      {/* Closing — personal, not corporate */}
      <section className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <p className="font-body text-base text-ink/65 dark:text-text-dark/65 leading-relaxed max-w-xl mb-8">
          Khaja is still small. We're not trying to be Swiggy. We're trying
          to make sure that the person who makes the best aloo tama in Dharan
          can reach you in thirty minutes, and that you actually know who
          cooked your food.
        </p>

        <p className="font-body text-base text-ink/65 dark:text-text-dark/65 leading-relaxed max-w-xl mb-10">
          If that sounds right to you — order something. If it doesn't arrive
          exactly as promised, tell us. We're still building this.
        </p>

        <Link
          to="/menu"
          className="group inline-flex items-center gap-2 bg-ink dark:bg-chili text-cream font-body font-semibold px-7 py-4 rounded-sm hover:bg-chili dark:hover:bg-chili-dark transition-colors"
        >
          See today's menu
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </Link>
      </section>
    </div>
  )
}

export default About