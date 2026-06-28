import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ContentLayout.css'

export default function ContentLayout({
  badge,
  category,
  title,
  date,
  lastReviewed,
  lastUpdated,
  authors,
  references,
  children,
  prevChapter,
  nextChapter,
}) {
  const navigate = useNavigate()
  const [expandedMeta, setExpandedMeta] = useState(null)

  function toggleMeta(key) {
    setExpandedMeta(prev => (prev === key ? null : key))
  }

  const hasAuthors = authors?.length > 0
  const hasRefs = references?.length > 0
  const hasDates = date || lastReviewed || lastUpdated

  return (
    <div className="content-layout">

      {badge && (
        <div className={`content-badge content-badge--${badge.color}`}>
          <span className="material-symbols-outlined">
            {badge.color === 'success' ? 'lock_open' : 'lock'}
          </span>
          {badge.label}
        </div>
      )}

      {category && (
        <span className="content-category">{category}</span>
      )}

      <h1 className="content-title">{title}</h1>

      {hasDates && (
        <div className="content-dates">
          {date && <span>{date}</span>}
          {lastReviewed && <span>Last reviewed: {lastReviewed}</span>}
          {lastUpdated && <span>Last updated: {lastUpdated}</span>}
        </div>
      )}

      {(hasAuthors || hasRefs) && (
        <div className="content-meta-toggles">
          {hasAuthors && (
            <div className="content-meta-section">
              <button
                className="content-meta-toggle"
                onClick={() => toggleMeta('authors')}
              >
                Authors
                <span className="material-symbols-outlined content-meta-chevron">
                  {expandedMeta === 'authors' ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {expandedMeta === 'authors' && (
                <div className="content-meta-body">
                  {authors.map((a, i) => (
                    <div key={i} className="content-author-row">
                      <span className="content-author-name">{a.name}</span>
                      {a.role && <span className="content-author-role">{a.role}</span>}
                      {a.institution && <span className="content-author-institution">{a.institution}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {hasRefs && (
            <div className="content-meta-section">
              <button
                className="content-meta-toggle"
                onClick={() => toggleMeta('references')}
              >
                References
                <span className="material-symbols-outlined content-meta-chevron">
                  {expandedMeta === 'references' ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {expandedMeta === 'references' && (
                <div className="content-meta-body">
                  {references.map((ref, i) => (
                    <p key={i} className="content-reference-item">{ref}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <hr className="content-divider" />

      <div className="content-body">
        {children}
      </div>

      {(prevChapter || nextChapter) && (
        <div className="chapter-nav">
          {prevChapter ? (
            <button
              className="chapter-nav-btn chapter-nav-btn--prev"
              onClick={() => navigate(`/reader/${prevChapter.id}`)}
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <div className="chapter-nav-text">
                <span className="chapter-nav-label">Previous</span>
                <span className="chapter-nav-title">{prevChapter.title}</span>
              </div>
            </button>
          ) : <div />}

          {nextChapter && (
            <button
              className="chapter-nav-btn chapter-nav-btn--next"
              onClick={() => navigate(`/reader/${nextChapter.id}`)}
            >
              <div className="chapter-nav-text">
                <span className="chapter-nav-label">Next</span>
                <span className="chapter-nav-title">{nextChapter.title}</span>
              </div>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          )}
        </div>
      )}

    </div>
  )
}
