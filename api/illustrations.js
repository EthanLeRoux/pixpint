import { fetchUserIllustrations } from './pixivClient.js';

const serializeWork = (work) => ({
  id: work.id,
  title: work.title,
  description: work.caption || '',
  imageUrls: {
    squareMedium: work.image_urls?.square_medium || null,
    medium: work.image_urls?.medium || work.image_urls?.large || null,
    large: work.image_urls?.large || null,
    original: work.image_urls?.original || null,
  },
  tags: Array.isArray(work.tags) ? work.tags.map((tag) => tag.name) : [],
  stats: {
    views: work.stats?.views ?? null,
    bookmarks: work.stats?.bookmarks ?? null,
    comments: work.stats?.comments ?? null,
  },
  author: {
    id: work.user?.id ?? null,
    name: work.user?.name ?? null,
    avatar: work.user?.profile_image_urls?.px_170x170 ?? null,
    pixivUrl: work.user?.id ? `https://www.pixiv.net/users/${work.user.id}` : null,
  },
});

const withErrorHandling = (res, error) => {
  console.error('/api/illustrations error:', error);
  const message = error?.message || 'Failed to fetch Pixiv illustrations';
  return res.status(502).json({ error: message });
};

export default async function handler(req, res) {
  const userId = req.query?.userId;
  const page = Number(req.query?.page || 1);
  const limit = Math.min(Math.max(Number(req.query?.limit || 20), 1), 50);

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId query parameter' });
  }

  try {
    const result = await fetchUserIllustrations(userId, page, limit);
    return res.status(200).json({
      page,
      limit,
      total: result.total,
      nextPage: result.nextUrl ? page + 1 : null,
      items: result.works.map(serializeWork),
    });
  } catch (error) {
    return withErrorHandling(res, error);
  }
}