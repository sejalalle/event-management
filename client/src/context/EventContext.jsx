
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

// Create Context
const EventContext = createContext(null);

// Context Provider
export function EventProvider({ children }) {

  // Store registered event IDs
  const [registeredEvents, setRegisteredEvents] = useState(() => {
    try {
      const savedEvents = localStorage.getItem("registeredEvents");
      return savedEvents ? JSON.parse(savedEvents) : [];
    } catch {
      return [];
    }
  });

  // Save registration data whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "registeredEvents",
      JSON.stringify(registeredEvents)
    );
  }, [registeredEvents]);

  // Register or unregister an event
  function toggleRegistration(eventId) {
    const id = String(eventId);

    setRegisteredEvents((previousEvents) => {
      if (previousEvents.includes(id)) {
        return previousEvents.filter(
          (registeredId) => registeredId !== id
        );
      }

      return [...previousEvents, id];
    });
  }

  // Check registration status
  function isRegistered(eventId) {
    return registeredEvents.includes(String(eventId));
  }

  return (
    <EventContext.Provider
      value={{
        registeredEvents,
        toggleRegistration,
        isRegistered
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

// Custom Hook to access Event Context
export function useEvents() {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error("useEvents must be used inside EventProvider");
  }

  return context;
}
