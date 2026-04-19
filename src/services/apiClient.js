const apiClient = async (path, options = {}) => {
  let response;
  try {
    response = await fetch(path, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
  } catch (networkErr) {
    throw new Error(`Network error fetching ${path}: ${networkErr.message}`);
  }

  // Read the body once as text so we never hit "body already consumed"
  const text = await response.text().catch(() => '');

  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      // Server returned non-JSON (HTML error page, empty body, etc.)
      throw new Error(
        `Invalid JSON response from ${path}: ${text.slice(0, 200)}`
      );
    }
  }

  if (!response.ok) {
    const message = body?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body;
};

export const get = (path) => apiClient(path, { method: 'GET' });
export const post = (path, body) =>
  apiClient(path, { method: 'POST', body: JSON.stringify(body) });
