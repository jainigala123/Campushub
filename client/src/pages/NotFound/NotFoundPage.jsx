import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="grid min-h-[calc(100vh-120px)] place-items-center bg-slate-50 px-6 py-20 text-center md:px-10">
      <div className="max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-16 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">404</p>
        <h1 className="mt-6 text-5xl font-semibold text-slate-950">Page not found</h1>
        <p className="mt-6 text-base leading-7 text-slate-600">The page you are looking for does not exist or has been moved. Return to the Campus Hub dashboard.</p>
        <Link to="/" className="mt-10 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
          Go home
        </Link>
      </div>
    </section>
  );
}
