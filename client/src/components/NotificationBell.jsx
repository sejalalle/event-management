
import { useState } from "react";
import { useNotifications } from "../context/NotificationContext";

function NotificationBell() {
  const { notifications } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg px-3 py-2 hover:bg-gray-100"
      >
        <span className="text-xl">🔔</span>

        {notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-lg border bg-white p-3 shadow-lg">
          <h3 className="mb-3 font-semibold text-gray-800">
            Notifications
          </h3>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">
              No notifications yet.
            </p>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border-b p-2 text-sm text-gray-700"
                >
                  {item.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
