export default function SectionHeading({ badge, title, description }) {
  return (
    <div className="max-w-2xl space-y-3">
      <span className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{badge}</span>
      <h2 className="text-3xl font-semibold text-slate-950 md:text-4xl">{title}</h2>
      <p className="text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}
