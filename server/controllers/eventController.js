
const mongoose = require("mongoose");
const Event = require("../models/Event");

// GET all events
async function getEvents(req, res) {
  try {
    const events = await Event.find().sort({ date: 1 });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error retrieving events:", error.message);

    res.status(500).json({
      message: "Failed to retrieve events",
    });
  }
}

// GET event by ID
async function getEventById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error retrieving event:", error.message);

    res.status(500).json({
      message: "Failed to retrieve event",
    });
  }
}

// POST - Create event(s)
async function createEvent(req, res) {
  try {
    const inputEvents = Array.isArray(req.body)
      ? req.body
      : [req.body];

    if (inputEvents.length === 0) {
      return res.status(400).json({
        message: "At least one event is required",
      });
    }

    for (const event of inputEvents) {
      if (
        !event ||
        typeof event !== "object" ||
        Array.isArray(event)
      ) {
        return res.status(400).json({
          message: "Invalid event data",
        });
      }

      const {
        title,
        description,
        date,
        time,
        location,
      } = event;

      if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof description !== "string" ||
        !description.trim() ||
        typeof date !== "string" ||
        !date.trim() ||
        typeof time !== "string" ||
        !time.trim() ||
        typeof location !== "string" ||
        !location.trim()
      ) {
        return res.status(400).json({
          message: "All event fields are required",
        });
      }
    }

    const eventsToCreate = inputEvents.map((event) => ({
      title: event.title.trim(),
      description: event.description.trim(),
      date: event.date,
      time: event.time.trim(),
      location: event.location.trim(),
    }));

    const events = await Event.insertMany(eventsToCreate);

    // Emit notification after successful creation
    const io = req.app.get("io");

    if (io) {
      events.forEach((event) => {
        io.emit("eventNotification", {
          message: `New event created: ${event.title}`,
          type: "created",
          eventId: event._id,
        });
      });
    }

    res.status(201).json({
      message: `${events.length} event(s) created successfully`,
      events,
    });
  } catch (error) {
    console.error("Error creating events:", error.message);

    if (
      error.name === "ValidationError" ||
      error.name === "CastError" ||
      error.name === "BulkWriteError"
    ) {
      return res.status(400).json({
        message: "Invalid event data",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to create events",
    });
  }
}

// PUT - Update event
async function updateEvent(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const {
      title,
      description,
      date,
      time,
      location,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof date !== "string" ||
      !date.trim() ||
      typeof time !== "string" ||
      !time.trim() ||
      typeof location !== "string" ||
      !location.trim()
    ) {
      return res.status(400).json({
        message: "All event fields are required",
      });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
        date,
        time: time.trim(),
        location: location.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Emit notification after successful update
    const io = req.app.get("io");

    if (io) {
      io.emit("eventNotification", {
        message: `Event updated: ${event.title}`,
        type: "updated",
        eventId: event._id,
      });
    }

    res.status(200).json({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Error updating event:", error.message);

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        message: "Invalid event data",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to update event",
    });
  }
}

// DELETE - Delete event
async function deleteEvent(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Emit notification after successful deletion
    const io = req.app.get("io");

    if (io) {
      io.emit("eventNotification", {
        message: `Event deleted: ${event.title}`,
        type: "deleted",
        eventId: event._id,
      });
    }

    res.status(200).json({
      message: "Event deleted successfully",
      event,
    });
  } catch (error) {
    console.error("Error deleting event:", error.message);

    res.status(500).json({
      message: "Failed to delete event",
    });
  }
}

// Export controller functions
module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
