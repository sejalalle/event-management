
import { useEvents } from "../context/EventContext";

function EventCard({
  id,
  title,
  description,
  date,
  time,
  location
}) {
  const {
    toggleRegistration,
    isRegistered
  } = useEvents();

  const registered = isRegistered(id);

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">

      <div className="bg-indigo-600 p-5 text-white">
        <p className="text-sm font-medium uppercase tracking-wider text-indigo-100">
          Upcoming Event
        </p>

        <h2 className="mt-2 text-xl font-bold">
          {title}
        </h2>
      </div>

      <div className="flex flex-1 flex-col p-5">

        <p className="flex-1 text-sm leading-6 text-slate-600">
          {description}
        </p>

        <div className="mt-5 space-y-2 text-sm text-slate-700">
          <p>
            <strong>Date:</strong> {date}
          </p>

          <p>
            <strong>Time:</strong> {time}
          </p>

          <p>
            <strong>Location:</strong> {location}
          </p>
        </div>

        {registered ? (
          <button
            type="button"
            onClick={() => toggleRegistration(id)}
            className="mt-6 w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Registered ✓
          </button>
        ) : (
          <button
            type="button"
            onClick={() => toggleRegistration(id)}
            className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Register Now
          </button>
        )}

      </div>
    </article>
  );
}

export default EventCard;
