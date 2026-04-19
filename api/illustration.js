import { fetchIllustrationDetails } from './pixivClient.js';

const withErrorHandling = (res, error) => {
  console.error('/api/illustration error:', error);
  const message = error?.message || 'Failed to fetch Pixiv illustration details';
  return res.status(502).json({ error: message });
};

export default async function handler(req, res) {
  const illustId = req.query?.illustId;

  if (!illustId) {
    return res.status(400).json({ error: 'Missing illustId query parameter' });
  }

  try {
    const work = await fetchIllustrationDetails(illustId);
    return res.status(200).json({
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
  } catch (error) {
    return withErrorHandling(res, error);
  }
}