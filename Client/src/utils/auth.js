export const getToken = () => {
  return localStorage.getItem("token");
};

export const getRole = () => {
  return (localStorage.getItem("role") || "").toLowerCase();
};

export const getUser = () => {
  const user = localStorage.getItem("user");

  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const isLoggedIn = () => {
  return !!getToken();
};

export const saveAuthData = ({
  token,
  role,
  user,
}) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);

  if (user) {
    const normalizedUser = {
      ...user,
      id: user.id || user._id,
      _id: user._id || user.id,
    };
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
};

export const clearAuth = () => {
  localStorage.clear();
};