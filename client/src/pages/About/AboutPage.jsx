import { motion } from 'framer-motion';
import SectionHeading from '../../components/common/SectionHeading';

const team = [
  { name: 'Aisha Patel', role: 'Founder & CEO' },
  { name: 'Jay Mehta', role: 'Head of Product' },
  { name: 'Sana Reddy', role: 'Design Lead' },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <SectionHeading
        badge="About"
        title="Building the future of campus discovery"
        description="Campus Hub brings together students, clubs, and events into one premium experience built for modern campus life."
      />

      <div className="mt-16 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Our mission</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">Create a seamless event discovery layer for students and clubs across multiple campuses with beautiful interactions and easy access.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Our vision</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">Empower campus communities to connect, collaborate, and celebrate with confidence through a single polished platform.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Journey</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-950">2024</p>
                <p className="mt-2 text-sm text-slate-600">Founded to solve campus event discovery for students.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-950">2025</p>
                <p className="mt-2 text-sm text-slate-600">Expanded to support multi-college clubs and premium event management.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-950">Team</h2>
            <div className="mt-6 space-y-4">
              {team.map((member) => (
                <div key={member.name} className="rounded-3xl bg-slate-50 p-5">
                  <p className="font-semibold text-slate-950">{member.name}</p>
                  <p className="mt-2 text-sm text-slate-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
            <h2 className="text-2xl font-semibold text-slate-950">Values</h2>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
              <li>Design-forward experiences</li>
              <li>Community-first product decisions</li>
              <li>Fast, intuitive interactions</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
