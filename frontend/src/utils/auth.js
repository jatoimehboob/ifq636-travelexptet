// Decodes the JWT stored in localStorage to read the current user's
// id and role, without pulling in a library like jwt-decode.
// Returns null if there's no token or it can't be parsed.
export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return decoded; // { id, role, iat, exp }
  } catch (error) {
    return null;
  }
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === "admin";
};
