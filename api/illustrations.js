import { fetchUserIllustrations } from './pixivClient.js';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseClient.js';

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

const filterIllustrations = (works) =>
  works.filter((work) => work?.type === 'illust');

const getSavedArtists = async () => {
  const snapshot = await getDocs(collection(db, 'artists'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export default async function handler(req, res) {
  const userId = req.query?.userId;
  const page = Number(req.query?.page || 1);
  const limit = Math.min(Math.max(Number(req.query?.limit || 20), 1), 50);

  try {
    let works = [];
    let nextPage = null;

    if (userId) {
      const result = await fetchUserIllustrations(userId, page, limit);
      works = filterIllustrations(result.works);
      nextPage = result.nextUrl ? page + 1 : null;
    } else {
      const artists = await getSavedArtists();

      for (const artist of artists) {
        try {
          const result = await fetchUserIllustrations(artist.pixivUserId, page, limit);
          const filtered = filterIllustrations(result.works);
          works.push(...filtered);
          if (result.nextUrl) {
            nextPage = page + 1;
          }
        } catch (artistError) {
          console.warn(`Failed to fetch illustrations for ${artist.pixivUserId}:`, artistError.message);
        }
      }
    }

    const uniqueWorks = Array.from(new Map(works.map((item) => [item.id, item])).values());
    const pageItems = uniqueWorks.slice(0, limit);

    return res.status(200).json({
      page,
      limit,
      total: pageItems.length,
      nextPage: pageItems.length === limit && nextPage ? page + 1 : null,
      items: pageItems.map(serializeWork),
    });
  } catch (error) {
    return withErrorHandling(res, error);
  }
}