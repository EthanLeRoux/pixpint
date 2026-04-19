export function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem("userData");
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const user = Array.isArray(parsed) ? parsed[0] : parsed;
    if (!user) return null;

    return {
      ...user,
      uid: user.uid || user.id || "",
      email: user.email || user.emailAddress || "",
    };
  } catch (error) {
    console.error("Failed to parse session user data:", error);
    return null;
  }
}

export function saveCurrentUser(user) {
  if (!user) {
    sessionStorage.removeItem("userData");
    return;
  }

  const normalizedUser = {
    ...user,
    uid: user.uid || user.id || "",
    email: user.email || user.emailAddress || "",
  };

  sessionStorage.setItem("userData", JSON.stringify([normalizedUser]));
}
