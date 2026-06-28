import { useNavigate, useParams } from 'react-router-dom'
import { OPEN_ACCESS_VIDEOS } from '../data/openAccessContent'
import ContentLayout from '../components/ContentLayout'

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_VIDEOS = {
  'v-ebm-founder': {
    id: 'v-ebm-founder',
    type: 'video',
    youtubeId: 'I7ouIsFlrps',
    title: "All you need to know about EBM: A founder's guide to evidence, guidelines & getting back to the core",
    category: 'McMaster Perspective',
    publishedDate: '2025/11/05',
    authors: [
      { name: 'Gordon Guyatt' },
      { name: 'Roman Jaeschke' },
    ],
    keywords: ['evidence-based medicine', 'GRADE', 'video'],
    description: "What was medicine like before evidence-based medicine (EBM)? Gordon Guyatt, MD, the pioneer who coined the term EBM, reveals how a revolutionary movement transformed clinical practice from reliance on expert opinion and intuition to systematic evaluation of research evidence. Dr Guyatt candidly discusses both the triumphs and limitations of EBM's evolution while emphasizing a crucial insight that challenges the \"cookbook medicine\" critique: most clinical decisions require personalized shared decision-making between doctors and patients, because evidence alone cannot account for individual values and preferences. Hosted by Roman Jaeschke, MD.",
    outline: [
      "The origins and foundations of EBM: moving beyond traditional clinical decision-making",
      "The structured approach to clinical questions: understanding PICO framework and literature search methods",
      "Evidence evaluation and the importance of trade-offs in clinical decision-making",
      "The evolution from individual evidence appraisal to systematic evidence synthesis and guidelines",
      "Strong vs conditional recommendations: avoiding \"cookbook medicine\" while maintaining evidence-based standards",
      "Managing clinical uncertainty: lessons from hormone replacement therapy and shared decision-making",
      "Patient communication in evidence-based practice: real-world examples of uncertainty and value-based decisions",
      "The development and evolution of GRADE: from GOBSAT to structured evidence assessment",
      "GRADE's global impact",
      "Core GRADE: simplifying complex methodology for practical implementation",
    ],
    references: [
      "Kemp K. Core GRADE: A simpler, stronger approach to evidence assessment. McMaster University Department of Health Research Methods, Evidence, and Impact (HEI). Published June 20, 2025. Accessed March 6, 2026.",
    ],
    relatedContent: [
      { title: 'Evidence-based medicine: Past, present, future', id: 'v-doacs-vte' },
      { title: 'Our deceptive mind: why reasoning methods matter', id: 'v-h5n1' },
      { title: 'GRADE System', id: 'v-obesity-drugs' },
    ],
    transcript: [
      {
        section: "The origins and foundations of EBM: moving beyond traditional clinical decision-making",
        exchanges: [
          {
            speaker: "Roman Jaeschke, MD, MSc, DPharm",
            text: "Good afternoon. Welcome to another edition of McMaster Perspective. We are recording in Krakow, Poland, during the McMaster International Review Conference of Internal Medicine. We have a privilege to host a number of prominent academicians and clinicians, among which we are welcoming Professor Gordon Guyatt from McMaster University. I could say a lot of things about him, but I would consider him a leader in the revolution of evidence-based medicine (EBM), something that we lived through the last few decades.",
          },
          {
            speaker: "Roman Jaeschke",
            text: "Gordon, for the uninitiated, people who hear about EBM for the first time or who heard it many times but don't necessarily think about it, how would you explain the issue of EBM? Where did it come from and where is it today?",
          },
          {
            speaker: "Gordon Guyatt, MD, MSc",
            text: "In terms of where it came from, clinicians nowadays find it hard to imagine what life was like before EBM. And it's only people of our vintage who can really remember what life was like before EBM. When clinicians had a patient with a problem and they weren't sure of what to do, they would rely on 3 things. Number one, they would rely on physiologic rationale.",
          },
        ],
      },
    ],
    isOpenAccess: true,
  },
}

function getVideo(videoId) {
  if (MOCK_VIDEOS[videoId]) return MOCK_VIDEOS[videoId]
  const oa = OPEN_ACCESS_VIDEOS.find(v => v.id === videoId)
  if (oa) {
    return {
      ...oa,
      authors: oa.authors.map(name => ({ name })),
      keywords: [oa.specialty || 'McMaster Perspective', 'video'].filter(Boolean),
      outline: [],
      references: [],
      relatedContent: OPEN_ACCESS_VIDEOS.filter(v => v.id !== videoId).slice(0, 3).map(v => ({ title: v.shortTitle, id: v.id })),
      transcript: [],
    }
  }
  return {
    id: videoId, youtubeId: null, title: 'Video', category: 'McMaster Perspective',
    publishedDate: '', authors: [], keywords: [], description: '', outline: [],
    references: [], relatedContent: [], transcript: [], isOpenAccess: false,
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function VideoPlayer() {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const video = getVideo(videoId)

  return (
    <div style={{ background: 'var(--bg-app)', minHeight: '100dvh' }}>

      {/* Topbar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: '52px', padding: '0 16px',
        display: 'flex', alignItems: 'center',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
        gap: '8px',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-brand)', padding: '4px', display: 'flex' }}
          aria-label="Back"
        >
          <span className="material-symbols-outlined icon-md">arrow_back</span>
        </button>
        <span style={{
          flex: 1, fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 500,
          color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {video.category}
        </span>
      </header>

      {/* ContentLayout with video content as children */}
      <div style={{ paddingBottom: '48px' }}>
        <ContentLayout
          badge={video.isOpenAccess
            ? { label: 'Open access', color: 'success' }
            : { label: 'Premium', color: 'info' }
          }
          category={video.category}
          title={video.title}
          date={video.publishedDate}
          authors={video.authors}
          references={video.references?.length ? video.references : undefined}
        >

          {/* YouTube embed */}
          <div style={{ aspectRatio: '16/9', background: '#000', margin: '0 -20px 20px', width: 'calc(100% + 40px)' }}>
            {video.youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined filled" style={{ fontSize: '64px', color: 'rgba(255,255,255,0.4)' }}>play_circle</span>
              </div>
            )}
          </div>

          {/* Description */}
          {video.description && (
            <p style={{
              fontStyle: 'italic', fontSize: '14px', lineHeight: 1.7,
              color: 'var(--text-secondary)', marginBottom: '24px',
            }}>
              {video.description}
            </p>
          )}

          {/* Outline */}
          {video.outline?.length > 0 && (
            <section style={{ marginBottom: '28px' }}>
              <h2 style={{
                fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.07em',
                color: 'var(--interactive-primary)',
                borderTop: '2px solid var(--interactive-primary)',
                borderBottom: '2px solid var(--interactive-primary)',
                padding: '7px 0', marginBottom: '16px',
              }}>
                Outline
              </h2>
              <ol style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {video.outline.map((item, i) => (
                  <li key={i} style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                    {item}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Transcript */}
          {video.transcript?.length > 0 && (
            <section style={{ marginBottom: '28px' }}>
              <h2 style={{
                fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.07em',
                color: 'var(--interactive-primary)',
                borderTop: '2px solid var(--interactive-primary)',
                borderBottom: '2px solid var(--interactive-primary)',
                padding: '7px 0', marginBottom: '16px',
              }}>
                Transcript
              </h2>
              {video.transcript.map((section, i) => (
                <div key={i} style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 600,
                    fontStyle: 'italic', color: 'var(--interactive-primary)', marginBottom: '12px',
                  }}>
                    {section.section}
                  </h3>
                  {section.exchanges.map((ex, j) => (
                    <p key={j} style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-primary)', marginBottom: '12px' }}>
                      <strong style={{ fontWeight: 600 }}>{ex.speaker}:</strong> {ex.text}
                    </p>
                  ))}
                </div>
              ))}
            </section>
          )}

          {/* Related content */}
          {video.relatedContent?.length > 0 && (
            <section>
              <h2 style={{
                fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.07em',
                color: 'var(--interactive-primary)',
                borderTop: '2px solid var(--interactive-primary)',
                borderBottom: '2px solid var(--interactive-primary)',
                padding: '7px 0', marginBottom: '16px',
              }}>
                Related content
              </h2>
              {video.relatedContent.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/video/${item.id}`)}
                  style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer',
                    background: 'none', border: 'none',
                    borderBottom: i < video.relatedContent.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    padding: '12px 0',
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--interactive-primary)', flexShrink: 0, marginTop: '2px' }}>
                    award_star
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {item.title}
                  </span>
                </button>
              ))}
            </section>
          )}

        </ContentLayout>
      </div>
    </div>
  )
}
