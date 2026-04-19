import { fetchUserIllustrations } from './pixivClient.js';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseClient.js';

// Serialize a raw Pixiv work object into a clean response shape
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
    views: work.total_view ?? work.stats?.views ?? null,
    bookmarks: work.total_bookmarks ?? work.stats?.bookmarks ?? null,
    comments: work.total_comments ?? work.stats?.comments ?? null,
  },
  author: {
    id: work.user?.id ?? null,
    name: work.user?.name ?? null,
    avatar: work.user?.profile_image_urls?.medium ?? work.user?.profile_image_urls?.px_170x170 ?? null,
    pixivUrl: work.user?.id ? `https://www.pixiv.net/users/${work.user.id}` : null,
  },
});

const withErrorHandling = (res, error) => {
  console.error('/api/illustrations error:', error);
  const message = error?.message || 'Failed to fetch Pixiv illustrations';
  return res.status(502).json({ error: message });
};

// Only keep actual illustrations (not manga/ugoira)
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
    let hasNextPage = false;

    if (userId) {
      const result = await fetchUserIllustrations(userId, page, limit);
      works = filterIllustrations(result.works);
      hasNextPage = Boolean(result.nextUrl);
    } else {
      const artists = await getSavedArtists();

      await Promise.all(
        artists.map(async (artist) => {
          try {
            const result = await fetchUserIllustrations(artist.pixivUserId, page, limit);
            const filtered = filterIllustrations(result.works);
            works.push(...filtered);
            if (result.nextUrl) {
              hasNextPage = true;
            }
          } catch (artistError) {
            console.warn(
              `Failed to fetch illustrations for artist ${artist.pixivUserId}:`,
              artistError.message
            );
          }
        })
      );
    }

    // Deduplicate by Pixiv illust ID, then serialize
    const seen = new Map();
    for (const work of works) {
      if (work?.id != null && !seen.has(String(work.id))) {
        seen.set(String(work.id), work);
      }
    }

    const pageItems = Array.from(seen.values()).slice(0, limit);

    return res.status(200).json({
      page,
      limit,
      total: pageItems.length,
      nextPage: pageItems.length === limit && hasNextPage ? page + 1 : null,
      items: pageItems.map(serializeWork),
    });
  } catch (error) {
    return withErrorHandling(res, error);
  }
}
