import React from 'react';
import IllustrationGrid from '../components/IllustrationGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useIllustrationFeed } from '../hooks/useIllustrationFeed';
import './HomePage.css';

const HomePage = () => {
  const { items, loading, error, hasMore, loadMore } = useIllustrationFeed(20);

  return (
    <section className="home-page">
      <div className="page-header">
        <h1>Illustration Feed</h1>
        <p>Browse saved Pixiv artists and view their latest illustrations in a Pinterest-style gallery.</p>
      </div>

      {error && <div className="page-error">{error}</div>}
      {items.length > 0 && <IllustrationGrid illustrations={items} />}
      {loading && <LoadingSkeleton count={8} />}
      {!loading && items.length === 0 && <div className="empty-state">No illustrations available yet. Add an artist to begin.</div>}

      <div className="load-more-row">
        {hasMore ? (
          <button className="load-more-button" onClick={loadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load more'}
          </button>
        ) : (
          items.length > 0 && <p className="end-text">You’ve reached the end of the feed.</p>
        )}
      </div>
    </section>
  );
};

export default HomePage;
