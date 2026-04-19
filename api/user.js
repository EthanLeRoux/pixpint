import { fetchPixivUser } from './pixivClient.js';

const withErrorHandling = (res, error) => {
  console.error('/api/user error:', error);
  const message = error?.message || 'Failed to fetch Pixiv user data';
  return res.status(502).json({ error: message });
};

export default async function handler(req, res) {
  const userId = req.query?.userId;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId query parameter' });
  }

  try {
    const user = await fetchPixivUser(userId);
    return res.status(200).json({
      id: user.id,
      name: user.name,
      avatar: user.profile_image_urls?.px_170x170 || user.profile_image_urls?.large || null,
      total_illusts: user.total_illusts ?? 0,
      profile: user.profile || user.comment || ''
    });
  } catch (error) {
    return withErrorHandling(res, error);
  }
}