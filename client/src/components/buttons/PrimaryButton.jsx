export default function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
