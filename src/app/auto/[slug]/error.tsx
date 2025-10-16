'use client';
export default function AutoError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Error en detalle de auto</h2>
      <p className="mt-2 text-red-600 text-sm">{error?.message}</p>
      <button className="mt-4 rounded bg-black px-3 py-2 text-white" onClick={() => reset()}>
        Reintentar
      </button>
    </div>
  );
}