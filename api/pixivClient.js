import Pixiv from 'node-pixiv';

const { PIXIV_USERNAME, PIXIV_PASSWORD } = process.env;

if (!PIXIV_USERNAME || !PIXIV_PASSWORD) {
  throw new Error('Missing PIXIV_USERNAME or PIXIV_PASSWORD environment variables');
}

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
    // node-pixiv wraps the response; user detail is at result.user
    const result = await client.userDetail(userId);
    const user = result?.user ?? result;
    if (!user) {
      throw new Error('Pixiv user not found');
    }
    return user;
  });
};

export const fetchUserIllustrations = async (userId, page = 1, limit = 20) => {
  if (!userId) {
    throw new Error('Missing userId');
  }

  return retryOnAuthFailure(async (client) => {
    // Use userIllusts (not search) to list a specific user's illustrations
    const result = await client.userIllusts(userId, {
      type: 'illust',
      offset: (page - 1) * limit,
    });

    // node-pixiv may return illusts[] or works[] depending on version
    const works = Array.isArray(result?.illusts)
      ? result.illusts
      : Array.isArray(result?.works)
      ? result.works
      : [];

    return {
      works,
      total: typeof result?.total === 'number' ? result.total : undefined,
      nextUrl: result?.next_url || null,
    };
  });
};

export const fetchIllustrationDetails = async (illustId) => {
  if (!illustId) {
    throw new Error('Missing illustId');
  }

  return retryOnAuthFailure(async (client) => {
    const result = await client.illustDetail(illustId);
    const work = result?.illust ?? result?.work ?? result;
    if (!work) {
      throw new Error('Pixiv illustration not found');
    }
    return work;
  });
};
