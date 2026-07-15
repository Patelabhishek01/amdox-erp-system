import { getToken, logout } from "./auth";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Custom fetch wrapper to handle authorization headers,
 * auto-refreshing expired tokens, and auto-logout on unauthorized requests.
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {};
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  Object.assign(headers, options.headers);
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    let res = await fetch(url, {
      ...options,
      headers,
    });

    // Intercept 401 Unauthorized responses
    if (res.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // Attempt to renew the access token using the refresh token
          const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            
            // Save the new access token
            localStorage.setItem("token", data.accessToken);
            
            // Retry the original request with the new access token
            headers["Authorization"] = `Bearer ${data.accessToken}`;
            res = await fetch(url, {
              ...options,
              headers,
            });
            return res;
          }
        } catch (refreshErr) {
          console.error("Token refresh failed:", refreshErr);
        }
      }

      // If token refresh fails, clear auth data and redirect to login
      logout();
      window.location.href = "/login?expired=true";
      throw new Error("Session expired. Please log in again.");
    }

    return res;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};
