
import { useEffect, useState } from "react";

import EventCard from "../components/EventCard";
import Loading from "../components/Loading";
import { getEvents } from "../services/api";
import { useEvents } from "../context/EventContext";

// Assign categories on the frontend.
function getCategory(event) {
  const title = event.title.toLowerCase();

  if (title.includes("workshop")) {
    return "Workshop";
  }

  if (
    title.includes("fest") ||
    title.includes("hackathon")
  ) {
    return "Competition";
  }

  if (
    title.includes("conference") ||
    title.includes("seminar")
  ) {
    return "Seminar";
  }

  if (
    title.includes("technology") ||
    title.includes("tech") ||
    title.includes("ai")
  ) {
    return "Technology";
  }

  return "Other";
}

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  const { registeredEvents } = useEvents();

  // Fetch events from MongoDB through the backend API.
  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message || "Unable to load events.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  // Search and category filtering.
  const filteredEvents = events.filter((event) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      event.title.toLowerCase().includes(search) ||
      event.description.toLowerCase().includes(search) ||
      event.location.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === "All Categories" ||
      getCategory(event) === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <header className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              EventHub
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
              Explore Events
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Discover workshops, conferences, and experiences worth attending.
            </p>
          </div>

          <div className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
            {registeredEvents.length} Registered
          </div>
        </header>

        {/* Search and Filter */}
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Search events by title or location..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />

          <select
            value={selectedCategory}
            onChange={(event) =>
              setSelectedCategory(event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          >
            <option value="All Categories">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Workshop">Workshop</option>
            <option value="Competition">Competition</option>
            <option value="Seminar">Seminar</option>
            <option value="Other">Other</option>
          </select>
        </section>

        {/* Loading */}
        {loading && <Loading />}

        {/* Error */}
        {!loading && error && (
          <p className="mt-8 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </p>
        )}

        {/* No Events */}
        {!loading && !error && filteredEvents.length === 0 && (
          <p className="mt-8 rounded-lg bg-white p-6 text-slate-600 shadow-sm">
            No matching events found.
          </p>
        )}

        {/* Event Cards */}
        {!loading && !error && filteredEvents.length > 0 && (
          <section
            aria-label="Available events"
            className="mt-8 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                id={event._id}
                title={event.title}
                description={event.description}
                date={event.date}
                time={event.time}
                location={event.location}
              />
            ))}
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-200 pt-5 text-center text-sm text-slate-500">
          EventHub · Discover your next experience
        </footer>

      </div>
    </main>
  );
}

export default Events;
