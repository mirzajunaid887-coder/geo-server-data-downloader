import React from 'react';
import { ContentBlock } from '../../types/blog';

const h2Style: React.CSSProperties = {
  fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)',
  fontWeight: 700,
  color: 'var(--text-main)',
  margin: '2rem 0 0.75rem',
  lineHeight: 1.3,
};

const h3Style: React.CSSProperties = {
  fontSize: 'clamp(1rem, 2vw, 1.15rem)',
  fontWeight: 700,
  color: 'var(--text-main)',
  margin: '1.5rem 0 0.5rem',
  lineHeight: 1.35,
};

const paragraphStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  lineHeight: 1.75,
  color: 'var(--text-main)',
  margin: '0 0 1rem',
};

const listStyle: React.CSSProperties = {
  paddingLeft: '1.4rem',
  margin: '0 0 1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
  fontSize: '0.95rem',
  lineHeight: 1.65,
  color: 'var(--text-main)',
};

const codeStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-hover)',
  padding: '0.75rem 1rem',
  borderRadius: '0.4rem',
  fontSize: '0.82rem',
  overflowX: 'auto',
  border: '1px solid var(--border-color)',
  margin: '0 0 1rem',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  color: 'var(--text-main)',
  whiteSpace: 'pre',
};

const calloutVariants: Record<
  'info' | 'warning' | 'tip',
  { bg: string; border: string; color: string }
> = {
  info: {
    bg: 'var(--accent-soft)',
    border: 'var(--accent-color)',
    color: 'var(--text-main)',
  },
  warning: {
    bg: 'var(--danger-soft)',
    border: 'var(--danger-color)',
    color: 'var(--text-main)',
  },
  tip: {
    bg: 'var(--success-soft)',
    border: 'var(--success-color)',
    color: 'var(--text-main)',
  },
};

export const ContentRenderer: React.FC<{ blocks: ContentBlock[] }> = ({ blocks }) => {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return block.level === 2 ? (
              <h2 key={i} style={h2Style}>{block.text}</h2>
            ) : (
              <h3 key={i} style={h3Style}>{block.text}</h3>
            );

          case 'paragraph':
            return (
              <p key={i} style={paragraphStyle}>
                {block.text}
              </p>
            );

          case 'list':
            return block.ordered ? (
              <ol key={i} style={listStyle}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={i} style={listStyle}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );

          case 'code':
            return (
              <pre key={i} style={codeStyle}>
                <code>{block.code}</code>
              </pre>
            );

          case 'callout': {
            const v = calloutVariants[block.variant];
            return (
              <aside
                key={i}
                style={{
                  backgroundColor: v.bg,
                  borderLeft: `4px solid ${v.border}`,
                  padding: '0.85rem 1rem',
                  borderRadius: '0.4rem',
                  margin: '0 0 1rem',
                  color: v.color,
                }}
              >
                {block.title && (
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      marginBottom: '0.35rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                    }}
                  >
                    {block.title}
                  </div>
                )}
                <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {block.text}
                </div>
              </aside>
            );
          }

          case 'table':
            return (
              <div
                key={i}
                style={{
                  overflowX: 'auto',
                  margin: '0 0 1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.4rem',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.85rem',
                    minWidth: '480px',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-hover)' }}>
                      {block.headers.map((h, j) => (
                        <th
                          key={j}
                          style={{
                            textAlign: 'left',
                            padding: '0.6rem 0.75rem',
                            borderBottom: '1px solid var(--border-color)',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j}>
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            style={{
                              padding: '0.55rem 0.75rem',
                              borderBottom:
                                j < block.rows.length - 1
                                  ? '1px solid var(--border-color)'
                                  : 'none',
                              color: 'var(--text-main)',
                              verticalAlign: 'top',
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          default:
            return null;
        }
      })}
    </>
  );
};

export default ContentRenderer;