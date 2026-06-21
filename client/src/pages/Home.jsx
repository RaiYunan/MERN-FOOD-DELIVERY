import { ArrowRight, Flame, Leaf, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

const categories = [
  { label: 'Momo & dumplings', count: 12 },
  { label: 'Sekuwa & grill', count: 8 },
  { label: 'Dal bhat sets', count: 6 },
  { label: 'Newari khaja', count: 9 },
  { label: 'Chiya & drinks', count: 7 },
]

const featured = [
  {
    name: 'Chicken Sekuwa',
    tag: 'Smoky favourite',
    price: 350,
    icon: Flame,
  },
  {
    name: 'Veg Momo',
    tag: "Chef's pick",
    price: 150,
    icon: Leaf,
  },
  {
    name: 'Newari Khaja Set',
    tag: 'Top rated',
    price: 450,
    icon: Star,
  },
]

function Home() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  return (
    <div className="bg-cream dark:bg-surface-dark transition-colors">
      {/* Hero */}
      <section className="relative px-6 pt-20 pb-24 md:pt-28 md:pb-32 max-w-5xl mx-auto">
        <p className="font-body text-sm tracking-[0.2em] uppercase text-chili font-semibold mb-6">
          {isAuthenticated
            ? `Welcome back, ${user?.name?.split(' ')[0]}`
            : "Dharan's table, delivered"}
        </p>

        <h1 className="font-display text-[15vw] leading-[0.92] md:text-[6.5rem] font-bold text-ink dark:text-text-dark tracking-tight">
          {isAuthenticated ? (
            <>
              Hungry
              <br />
              again
              <br />
              already?
            </>
          ) : (
            <>
              Eat what
              <br />
              this city
              <br />
              actually cooks.
            </>
          )}
        </h1>

        <div className="mt-8 max-w-md">
          <div
            className="h-0.75 w-24 bg-chili mb-6"
            style={{
              maskImage:
                'linear-gradient(90deg, black 0%, black 70%, transparent 100%)',
            }}
          />
          <p className="font-body text-ink/70 dark:text-text-dark/70 text-lg leading-relaxed">
            {isAuthenticated
              ? 'Pick up where you left off, or see what just landed on the board today.'
              : 'Momo from the corner steamer, sekuwa off the coal, dal bhat the way your hajurama makes it. No stock photos, no fusion nonsense — just the menu Dharan already loves.'}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 bg-ink dark:bg-chili text-cream font-body font-semibold px-7 py-4 rounded-sm hover:bg-chili dark:hover:bg-chili-dark transition-colors duration-200"
          >
            See today's menu
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>

          {isAuthenticated ? (
            <Link
              to="/orders"
              className="font-body font-semibold text-ink/70 dark:text-text-dark/70 hover:text-ink dark:hover:text-text-dark px-2 py-4 underline decoration-clay decoration-2 underline-offset-4 hover:decoration-chili transition-colors"
            >
              View my orders
            </Link>
          ) : (
            <Link
              to="/register"
              className="font-body font-semibold text-ink/70 dark:text-text-dark/70 hover:text-ink dark:hover:text-text-dark px-2 py-4 underline decoration-clay decoration-2 underline-offset-4 hover:decoration-chili transition-colors"
            >
              Create an account
            </Link>
          )}
        </div>
      </section>

      {/* Category strip */}
      <section className="border-y border-clay dark:border-border-dark bg-clay-light/40 dark:bg-card-dark/40">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              to="/menu"
              className="group inline-flex items-center gap-2 bg-cream dark:bg-surface-dark border border-ink/15 dark:border-border-dark px-4 py-2 rounded-full font-body text-sm font-medium text-ink/80 dark:text-text-dark/80 hover:border-chili hover:text-chili transition-colors"
            >
              {cat.label}
              <span className="text-ink/40 dark:text-text-dark/40 group-hover:text-chili/60 text-xs">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink dark:text-text-dark">
            On the board today
          </h2>
          <Link
            to="/menu"
            className="font-body text-sm font-semibold text-chili hover:text-chili-dark hidden md:inline"
          >
            Full menu →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-ink/10 dark:bg-border-dark border border-ink/10 dark:border-border-dark">
          {featured.map((item) => {
            const Icon = item.icon
            return (
              <Link
                to="/menu"
                key={item.name}
                className="bg-cream dark:bg-surface-dark p-8 hover:bg-clay-light/50 dark:hover:bg-card-dark/50 transition-colors group cursor-pointer"
              >
                <Icon
                  size={22}
                  className="text-chili mb-6"
                  strokeWidth={1.75}
                />
                <p className="font-body text-xs uppercase tracking-wider text-cardamom font-semibold mb-2">
                  {item.tag}
                </p>
                <h3 className="font-display text-2xl font-semibold text-ink dark:text-text-dark mb-3">
                  {item.name}
                </h3>
                <p className="font-body text-ink/60 dark:text-text-dark/60 font-medium">
                  Rs. {item.price}
                </p>
              </Link>
            )
          })}
        </div>
      </section>

    
      {!isAuthenticated && (
        <section className="bg-ink dark:bg-card-dark text-cream px-6 py-16">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <h2 className="font-display text-3xl md:text-4xl font-semibold max-w-md">
              Hungry already? Good — that was the plan.
            </h2>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-turmeric text-ink font-body font-semibold px-7 py-4 rounded-sm hover:bg-cream transition-colors whitespace-nowrap"
            >
              Get started
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home