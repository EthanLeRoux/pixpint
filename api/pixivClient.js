import Pixiv from 'node-pixiv';

const { PIXIV_USERNAME, PIXIV_PASSWORD } = process.env;

let pixivClient = null;
let loginPromise = null;

const createPixivClient = () => {
  pixivClient = new Pixiv();
  return pixivClient;
};

const ensureLoggedIn = async () => {
  if (!PIXIV_USERNAME || !PIXIV_PASSWORD) {
    throw new Error('Missing PIXIV_USERNAME or PIXIV_PASSWORD environment variables');
  }

  if (loginPromise) {
    return loginPromise;
  }

  const client = createPixivClient();
  loginPromise = client
    .login({ username: PIXIV_USERNAME, password: PIXIV_PASSWORD })
    .then(() => client)
    .catch((error) => {
      pixivClient = null;
      loginPromise = null;
      throw error;
    });

  return loginPromise;
};

const retryOnAuthFailure = async (fn) => {
  try {
    const client = await ensureLoggedIn();
    return await fn(client);
  } catch (error) {
    const message = String(error.message || error);
    if (/401|Unauthorized|invalid_token|access_token/i.test(message)) {
      pixivClient = null;
      loginPromise = null;
      const client = await ensureLoggedIn();
      return await fn(client);
    }
    throw error;
  }
};

export const fetchPixivUser = async (userId) => {
  if (!userId) {
    throw new Error('Missing userId');
  }

  return retryOnAuthFailure(async (client) => {
    const result = await client.user(userId);
    if (!result || !result.user) {
      throw new Error('Pixiv user not found');
    }
    return result.user;
  });
};

export const fetchUserIllustrations = async (userId, page = 1, limit = 20) => {
  if (!userId) {
    throw new Error('Missing userId');
  }

  return retryOnAuthFailure(async (client) => {
    const result = await client.search({ user_id: userId, page, per_page: limit });
    return {
      works: Array.isArray(result.works) ? result.works : [],
      total: typeof result.total === 'number' ? result.total : undefined,
      nextUrl: result.next_url || null,
    };
  });
};

export const fetchIllustrationDetails = async (illustId) => {
  if (!illustId) {
    throw new Error('Missing illustId');
  }

  return retryOnAuthFailure(async (client) => {
    const result = await client.work(illustId);
    if (!result || !result.work) {
      throw new Error('Pixiv illustration not found');
    }
    return result.work;
  });
};