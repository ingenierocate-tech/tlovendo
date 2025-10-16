'use client';

export default function GlobalError(
  { error, reset }: { error: Error & { digest?: string }, reset: () => void }
) {
  return (
    <html>
      <body className="min-h-screen grid place-items-center bg-white">
        <div className="max-w-lg rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900">Ocurrió un error</h2>
          <p className="mt-2 text-neutral-600">
            {error?.message ?? 'Algo salió mal.'}
          </p>
          <button
            onClick={() => reset()}
            className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-white"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}