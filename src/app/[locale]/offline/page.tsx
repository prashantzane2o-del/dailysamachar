export default function Offline() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-6 text-center">
      <div>
        <div className="border-signal mx-auto h-16 w-16 rounded-full border-2 border-dashed" />
        <p className="kicker mt-8">Connection unavailable</p>
        <h1 className="editorial mt-3 text-4xl font-bold">You’re offline.</h1>
        <p className="text-muted mt-3">Reconnect to continue reading the latest reporting.</p>
      </div>
    </main>
  );
}
