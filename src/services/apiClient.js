const apiClient = async (path, options = {}) => {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  let body = null;
  try {
    body = await response.json();
  } catch (err) {
    const text = await response.text().catch(() => 'Unable to read response');
    throw new Error(`Invalid JSON response from ${path}: ${text}`);
  }

  if (!response.ok) {
    const message = body?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body;
};

export const get = (path) => apiClient(path, { method: 'GET' });
export const post = (path, body) => apiClient(path, { method: 'POST', body: JSON.stringify(body) });
