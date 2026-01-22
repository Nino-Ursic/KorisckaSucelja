import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center px-6">
        <p className="text-7xl font-bold text-neutral-700 mb-6">404</p>

        <h1 className="text-4xl font-bold mb-4">
          Page not found
        </h1>

        <p className="text-neutral-400 mb-10 max-w-md mx-auto">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-md bg-white text-black font-medium hover:bg-neutral-200 transition"
          >
            Go home
          </Link>

          <Link
            href="/accommodations"
            className="px-6 py-3 rounded-md border border-neutral-700 text-white hover:bg-neutral-900 transition"
          >
            View accommodations
          </Link>
        </div>
      </div>
    </div>
  );
}
