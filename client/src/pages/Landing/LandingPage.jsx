import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';
import SectionHeading from '../../components/common/SectionHeading';
import StatCard from '../../components/common/StatCard';
import EventCard from '../../components/cards/EventCard';
import CategoryCard from '../../components/cards/CategoryCard';
import ClubCard from '../../components/cards/ClubCard';
import TestimonialCard from '../../components/common/TestimonialCard';
import { collegeLogos, stats, featuredEvents, categories, features, clubs, testimonials, heroCards } from '../../data/dummyData';
import { useAuth } from '../../context/AuthContext';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function LandingPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="overflow-hidden bg-slate-50">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.14),transparent_30%)] pt-28 pb-24">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-white/90 to-transparent" />
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }} className="space-y-8">
              <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">New campus experience</span>
              <div className="space-y-6">
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                  Discover. Participate. Connect.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Find intercollegiate events, workshops, hackathons, cultural festivals and competitions across campuses.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/events" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-blue-600">
                  Explore Events
                  <FiArrowRight className="ml-3" />
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                  Create Event
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {heroCards.map((card) => (
                  <motion.div key={card.title} whileHover={{ y: -6 }} className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-soft backdrop-blur-xl">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{card.title}</p>
                    <h3 className="mt-3 text-xl font-semibold text-slate-950">{card.subtitle}</h3>
                    <span className="mt-4 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{card.accent}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative">
              <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -right-8 top-28 h-24 w-24 rounded-full bg-secondary/10 blur-3xl" />
              <div className="rounded-[2.5rem] border border-slate-200 bg-white/90 p-8 shadow-soft backdrop-blur-xl">
                <div className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-slate-950 to-slate-800 p-8 text-white shadow-xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.15),transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.18),transparent_25%)]" />
                  <div className="relative space-y-5">
                    <div className="space-y-2">
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Campus Hub</p>
                      <h2 className="text-4xl font-semibold">Find your next event</h2>
                    </div>
                    <p className="max-w-xl text-sm leading-7 text-slate-200">
                      Browse curated campus events with premium visuals, smooth motion, and a polished discovery flow.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl bg-white/10 p-4">
                        <p className="text-sm uppercase tracking-[0.22em] text-slate-300">Upcoming</p>
                        <p className="mt-3 font-semibold text-white">Design Sprint</p>
                      </div>
                      <div className="rounded-3xl bg-white/10 p-4">
                        <p className="text-sm uppercase tracking-[0.22em] text-slate-300">Live</p>
                        <p className="mt-3 font-semibold text-white">Cultural Fest</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-slate-300 bg-white/90 shadow-soft">
            <FiChevronDown className="text-slate-700" />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-8 rounded-[2rem] bg-white p-8 shadow-soft md:grid-cols-5 md:items-center">
          {collegeLogos.map((logo) => (
            <div key={logo} className="flex items-center justify-center text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              {logo}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <SectionHeading
          badge="Trusted by students"
          title="Campus life powered by smarter discovery"
          description="The platform trusted by college clubs and student communities to find and manage events across campuses."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.label} value={item.value} label={item.label} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <SectionHeading
          badge="Featured events"
          title="Events to join this semester"
          description="Browse the top events across campus categories with premium card previews and quick actions."
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <SectionHeading
          badge="Categories"
          title="Browse events by category"
          description="Search smarter with category filters that match your interests and campus life."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category} title={category} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <SectionHeading
          badge="Why Campus Hub"
          title="Built for campus communities and student leaders"
          description="Our premium UX helps students discover events, clubs, and opportunities with fast interactions and polished design."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <motion.article whileHover={{ y: -8 }} key={feature.title} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft transition-shadow duration-300">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-soft">
                <span className="text-xl font-semibold">•</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-950">{feature.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <SectionHeading
          badge="Featured clubs"
          title="Top student clubs hosting the best campus events"
          description="Explore clubs that are driving innovation, culture, and student connection across campuses."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <SectionHeading
          badge="Testimonials"
          title="What students and organizers are saying"
          description="A premium experience that feels polished, fast, and easy to use."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
        <div className="rounded-[2.5rem] bg-gradient-to-r from-primary to-secondary px-8 py-14 text-white shadow-soft shadow-primary/20 md:px-12">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-100">Ready to showcase your next event?</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight">Join Campus Hub</h2>
            </div>
            <div className="flex items-center justify-end pr-6 md:pr-12">
              <Link
                to="/signup"
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-950 shadow transition hover:bg-slate-100"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
