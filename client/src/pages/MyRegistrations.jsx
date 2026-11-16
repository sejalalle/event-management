import { useEvents } from "../context/EventContext";

function MyRegistrations() {
  const { registeredEvents } = useEvents();

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900">
          My Registrations
        </h1>

        <p className="mt-3 text-slate-600">
          Events registered in this browser: {registeredEvents.length}
        </p>
      </div>
    </main>
  );
}

export default MyRegistrations;