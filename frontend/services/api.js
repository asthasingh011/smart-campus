const BASE_URL = "http://localhost:5000";

// Helper (safe fetch)
async function safeFetch(url, options = {}) {
  try {
    console.log(`[API Request] Fetching: ${url}`);
    const res = await fetch(url, options);

    if (!res.ok) {
      console.error(`[API HTTP Error] ${res.status} ${res.statusText} on ${url}`);
    }

    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (err) {
    console.error(`[API Fetch Failed] Unable to connect to ${url}. Is the backend running?`, err);
    return null; // Return null so callers can handle graceful fallback
  }
}

// 🔐 LOGIN
export const loginUser = async (data) => {
  return safeFetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

// 📝 SIGNUP
export const signupUser = async (data) => {
  return safeFetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

// 📦 RESOURCES
export const getResources = async () => {
  const data = await safeFetch(`${BASE_URL}/resources`);
  return Array.isArray(data) ? data : [];
};

export const getResourceTypes = async () => {
  const data = await safeFetch(`${BASE_URL}/resource-types`);
  return Array.isArray(data) ? data : [];
};

// 📅 BOOKINGS
export const getMyBookings = async (userId) => {
  const data = await safeFetch(`${BASE_URL}/my-bookings/${userId}`);
  return Array.isArray(data) ? data : [];
};

export const getAllBookings = async () => {
  const data = await safeFetch(`${BASE_URL}/bookings`);
  return Array.isArray(data) ? data : [];
};

export const getBookingById = async (bookingId) => {
  return safeFetch(`${BASE_URL}/bookings/${bookingId}`);
};

export const getLatestBooking = async (userId) => {
  const data = await safeFetch(`${BASE_URL}/bookings?userId=${userId}`);
  return Array.isArray(data) ? data : [];
};

export const deleteBooking = async (bookingId) => {
  return safeFetch(`${BASE_URL}/bookings/${bookingId}`, {
    method: "DELETE",
  });
};

export const approveBooking = async (bookingId, adminId) => {
  return safeFetch(`${BASE_URL}/approve`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      Booking_ID: bookingId,
      Admin_ID: adminId,
    }),
  });
};

export const rejectBooking = async (bookingId, adminId) => {
  return safeFetch(`${BASE_URL}/reject`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      Booking_ID: bookingId,
      Admin_ID: adminId,
    }),
  });
};

// 🔔 NOTIFICATIONS
export const getNotifications = async (userId) => {
  const data = await safeFetch(`${BASE_URL}/notifications/${userId}`);
  return Array.isArray(data) ? data : [];
};

export const markNotificationRead = async (notifId) => {
  return safeFetch(`${BASE_URL}/notifications/${notifId}/read`, {
    method: "PATCH",
  });
};

export const sendNotification = async (data) => {
  return safeFetch(`${BASE_URL}/notification`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });
};

// 🔧 MAINTENANCE
export const reportMaintenance = async (data) => {
  return safeFetch(`${BASE_URL}/maintenance`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data),
  });
};

// 📊 USAGE LOGS
export const getUsageLogs = async () => {
  const data = await safeFetch(`${BASE_URL}/usage-logs`);
  return Array.isArray(data) ? data : [];
};

// ⏱️ SLOTS
export const getSlots = async () => {
  const data = await safeFetch(`${BASE_URL}/slots`);
  return Array.isArray(data) ? data : [];
};

// 🏷️ BOOK RESOURCE
export const bookResource = async (data) => {
  return safeFetch(`${BASE_URL}/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

// 📈 GET ANALYTICS
export const getAnalytics = async (userId, role) => {
  const url = role === 'Admin' || !userId 
    ? `${BASE_URL}/analytics?role=Admin` 
    : `${BASE_URL}/analytics?userId=${userId}&role=${role}`;
    
  const data = await safeFetch(url);
  return data || { mostUsedResources: [], bookingsPerResource: [], peakHours: [] };
};