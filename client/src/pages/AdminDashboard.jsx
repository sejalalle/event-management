
import { useEffect, useState } from "react";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/api";

const emptyForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
};

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadEvents() {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        await updateEvent(editingId, formData);
        setMessage("Event updated successfully!");
      } else {
        await createEvent(formData);
        setMessage("Event created successfully!");
      }

      setFormData(emptyForm);
      setEditingId(null);
      await loadEvents();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(event) {
    setEditingId(event._id);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 10),
      time: event.time,
      location: event.location,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await deleteEvent(id);
      setMessage("Event deleted successfully!");
      setError("");
      await loadEvents();
    } catch (err) {
      setError(err.message);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData(emptyForm);
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-7xl">

        <h1 className="text-4xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Create, update and manage your events.
        </p>

        {message && (
          <p className="mt-5 rounded-lg bg-green-100 p-3 text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-5 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        <div className="mt-8 rounded-xl bg-white p-8 shadow-md">

          <h2 className="text-2xl font-bold text-slate-900">
            {editingId ? "Update Event" : "Create New Event"}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event Title"
              required
              className="rounded-lg border p-3"
            />

            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              required
              className="rounded-lg border p-3"
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="rounded-lg border p-3"
            />

            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="rounded-lg border p-3"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Event Description"
              required
              rows="4"
              className="rounded-lg border p-3 md:col-span-2"
            />

            <div className="flex flex-wrap gap-3 md:col-span-2">

              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                {editingId ? "Update Event" : "Create Event"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg bg-slate-500 px-6 py-3 text-white"
                >
                  Cancel
                </button>
              )}

            </div>
          </form>
        </div>

        <div className="mt-10">

          <h2 className="text-2xl font-bold text-slate-900">
            Manage Events ({events.length})
          </h2>

          {loading ? (
            <p className="mt-5">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="mt-5 text-slate-600">
              No events available. Create your first event above.
            </p>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {events.map((event) => (
                <div
                  key={event._id}
                  className="rounded-xl bg-white p-6 shadow-md"
                >
                  <h3 className="text-xl font-bold">
                    {event.title}
                  </h3>

                  <p className="mt-2 text-slate-600">
                    {event.description}
                  </p>

                  <p className="mt-3 text-sm">
                    Date: {event.date.slice(0, 10)}
                  </p>

                  <p className="text-sm">
                    Time: {event.time}
                  </p>

                  <p className="text-sm">
                    Location: {event.location}
                  </p>

                  <div className="mt-5 flex gap-3">

                    <button
                      onClick={() => handleEdit(event)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(event._id)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
