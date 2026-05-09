'use client';

interface ImageCreditProps {
  photographerName?: string;
  photographerUrl?: string;
  imageSourceUrl?: string;
  imageSource?: string;
  variant?: 'article' | 'card';
}

export default function ImageCredit({
  photographerName,
  photographerUrl,
  imageSourceUrl,
  imageSource,
  variant = 'article',
}: ImageCreditProps) {
  // If internal or no credits, show minimal attribution
  if (!photographerName || imageSource === 'internal') {
    return null;
  }

  if (variant === 'article') {
    return (
      <div className="bg-bg-card/80 backdrop-blur-sm border-t border-accent-neon-pink/20 px-4 md:px-8 py-3">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-text-muted">
            <span className="text-text-secondary">Photo by </span>
            {photographerUrl ? (
              <a
                href={photographerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-neon-pink hover:text-accent-neon-cyan transition-colors font-semibold"
              >
                {photographerName}
              </a>
            ) : (
              <span className="text-accent-neon-pink font-semibold">{photographerName}</span>
            )}
            {imageSource === 'unsplash' && (
              <>
                <span className="text-text-secondary"> on </span>
                {imageSourceUrl ? (
                  <a
                    href={imageSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-neon-pink hover:text-accent-neon-cyan transition-colors font-semibold"
                  >
                    Unsplash
                  </a>
                ) : (
                  <span className="text-accent-neon-pink font-semibold">Unsplash</span>
                )}
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  // Card variant - minimal, appears as footer overlay
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
      <p className="text-xs text-text-muted truncate">
        {photographerUrl ? (
          <a
            href={photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-neon-pink hover:text-accent-neon-cyan transition-colors"
            title={`Photo by ${photographerName}`}
          >
            {photographerName}
          </a>
        ) : (
          <span className="text-accent-neon-pink" title={`Photo by ${photographerName}`}>
            {photographerName}
          </span>
        )}
        {imageSource === 'unsplash' && <span className="text-text-muted"> • Unsplash</span>}
      </p>
    </div>
  );
}
