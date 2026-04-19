import { useEffect, useRef, useState } from 'react';
import { getIllustrations } from '../services/illustrationApi.js';

const STORAGE_KEY = 'pixpint-illustration-feed-state';

export const useIllustrationFeed = (limit = 20) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const loadedPages = useRef({});

  useEffect(() => {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(parsed.items || []);
        setPage(parsed.page || 1);
        setHasMore(parsed.hasMore ?? true);
        if (parsed.page) {
          for (let i = 1; i <= parsed.page; i += 1) {
            loadedPages.current[i] = true;
          }
        }
        if (typeof parsed.scrollY === 'number') {
          window.requestAnimationFrame(() => window.scrollTo(0, parsed.scrollY));
        }
      } catch {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items, page, hasMore })
    );
  }, [items, page, hasMore]);

  useEffect(() => {
    const saveScroll = () => {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : {};
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...parsed, scrollY: window.scrollY })
      );
    };
    window.addEventListener('scroll', saveScroll);
    return () => window.removeEventListener('scroll', saveScroll);
  }, []);

  const loadPage = async (pageToLoad) => {
    if (loadedPages.current[pageToLoad]) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getIllustrations(pageToLoad, limit);
      const newItems = data.items || [];
      loadedPages.current[pageToLoad] = newItems;

      setItems((prev) => {
        if (pageToLoad === 1) {
          return newItems;
        }
        return [...prev, ...newItems];
      });

      setHasMore(Boolean(data.nextPage));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(page);
  }, [page]);

  const loadMore = () => {
    if (!hasMore || loading) {
      return;
    }
    setPage((current) => current + 1);
  };

  return {
    items,
    page,
    loading,
    error,
    hasMore,
    loadMore,
    resetFeed: () => {
      loadedPages.current = {};
      setItems([]);
      setPage(1);
      setHasMore(true);
    },
  };
};