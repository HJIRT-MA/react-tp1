'use client'; 

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
      <h2>Une erreur est survenue</h2>
      <p>{error.message}</p>
      <button 
        onClick={() => reset()} 
        style={{ padding: '0.5rem 1rem', marginTop: '1rem', cursor: 'pointer' }}
      >
        Réessayer
      </button>
    </div>
  );
}