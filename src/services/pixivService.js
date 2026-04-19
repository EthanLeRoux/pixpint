const serializeApiResponse = async (response) => {
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload?.error || `API request failed with status ${response.status}`;
    throw new Error(message);
  }

  try {
    return await response.json();
  } catch (parseError) {
    const text = await response.text().catch(() => 'Unable to read response body');
    throw new Error(`Invalid JSON response from API: ${text.slice(0, 120)}`);
  }
};

export const getUserDetails = async (userId) => {
  if (!userId) {
    throw new Error('Missing userId');
  }

  const response = await fetch(`/api/user/${encodeURIComponent(userId)}`);
  return serializeApiResponse(response);
};

export const getUserIllustrations = async (userId, page = 1, limit = 20) => {
  if (!userId) {
    throw new Error('Missing userId');
  }

  const response = await fetch(
    `/api/illustrations?userId=${encodeURIComponent(userId)}&page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`
  );
  return serializeApiResponse(response);
};

export const getIllustration = async (illustId) => {
  if (!illustId) {
    throw new Error('Missing illustId');
  }

  const response = await fetch(`/api/illustration?illustId=${encodeURIComponent(illustId)}`);
  return serializeApiResponse(response);
};