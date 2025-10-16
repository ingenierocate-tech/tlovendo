'use client';
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Error global</h1>
          <p className="mt-2 text-red-600 text-sm">{error?.message}</p>
          <button className="mt-4 rounded bg-black px-3 py-2 text-white" onClick={() => reset()}>
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}