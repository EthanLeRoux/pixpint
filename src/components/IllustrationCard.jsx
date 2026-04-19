import React from 'react';
import './IllustrationCard.css';

const IllustrationCard = ({ illustration }) => {
  const { title, imageUrls, author, tags } = illustration;

  return (
    <article className="illustration-card">
      <div className="illustration-image-wrap">
        <img
          src={imageUrls.medium || imageUrls.large || imageUrls.original}
          alt={title}
          className="illustration-image"
          loading="lazy"
        />
      </div>
      <div className="illustration-body">
        <div className="illustration-meta">
          <span className="illustration-title">{title}</span>
          <span className="illustration-author">{author.name}</span>
        </div>
        {tags?.length > 0 && (
          <div className="illustration-tags">
            {tags.slice(0, 5).map((tag) => (
              <span key={tag} className="illustration-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default IllustrationCard;
