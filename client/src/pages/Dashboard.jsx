import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NAVY   = '#1A2340';
const GOLD   = '#B89A5A';
const LIGHT  = '#F6F4F0';
const BORDER = '#E2DDD6';
const MUTED  = '#9A948A';
const SUBTLE = '#C8C2B8';

function daysSince(dateStr) {
  if (!dateStr) return null;
  return Math.floor((new Date() - new Date(dateStr)) / 86400000);
}

function formatDate(dateStr) {
  if (!dateStr) return 'No date on record';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function Dashboard() {
  const [mutualDate,   setMutualDate]   = useState(null);
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [, forceUpdate] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/dates')
      .then(r => r.json())
      .then(d => {
        setMutualDate(d.mutualDate     || null);
        setPurchaseDate(d.purchaseDate || null);
      })
      .catch(() => {});

    // Refresh day counters every hour if left open overnight
    const id = setInterval(() => forceUpdate(n => n + 1), 3_600_000);
    return () => clearInterval(id);
  }, []);

  const mutualDays   = daysSince(mutualDate);
  const purchaseDays = daysSince(purchaseDate);

  return (
    <div style={{
      minHeight: '100vh', background: LIGHT,
      fontFamily: "'DM Sans', sans-serif",
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Header */}
      <div style={{
        background: NAVY,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.25rem 3rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.6rem', color: GOLD,
            letterSpacing: '0.1em', lineHeight: 1,
          }}>
            RUSH
          </span>
          <div style={{ width: '1px', height: '1rem', background: '#2E3D5E' }} />
          <span style={{
            fontWeight: 300, fontSize: '0.68rem',
            letterSpacing: '0.22em', textTransform: 'uppercase', color: '#6A7A9A',
          }}>
            Land Acquisition &nbsp;/&nbsp; Deal Activity
          </span>
        </div>
        <button
          onClick={() => navigate('/update')}
          style={{
            background: 'none', border: '1px solid #2E3D5E',
            borderRadius: '2px', cursor: 'pointer', color: '#6A7A9A',
            padding: '0.35rem 0.9rem', fontSize: '0.68rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s',
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
          onMouseOut={e =>  { e.currentTarget.style.borderColor = '#2E3D5E'; e.currentTarget.style.color = '#6A7A9A'; }}
        >
          Update Dates
        </button>
      </div>

      {/* Gold accent line */}
      <div style={{ height: '3px', background: GOLD }} />

      {/* Two panels */}
      <div style={{ flex: 1, display: 'flex' }}>

        <Panel
          label="Days Since Last Mutual"
          days={mutualDays}
          date={formatDate(mutualDate)}
        />

        <div style={{ width: '1px', background: BORDER, margin: '4rem 0' }} />

        <Panel
          label="Days Since Last Purchase"
          days={purchaseDays}
          date={formatDate(purchaseDate)}
        />

      </div>
    </div>
  );
}

function Panel({ label, days, date }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      padding: '2rem 3rem 4rem',
    }}>
      <div style={{
        fontSize: '0.7rem', letterSpacing: '0.3em',
        textTransform: 'uppercase', color: MUTED,
        marginBottom: '1rem', fontWeight: 500,
      }}>
        {label}
      </div>

      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 'clamp(4rem, 22vw, 22rem)',
        lineHeight: 0.86,
        color: days === null ? SUBTLE : '#1A2340',
        letterSpacing: '-0.01em', userSelect: 'none',
      }}>
        {days !== null ? days : '—'}
      </div>

      <div style={{
        fontSize: 'clamp(0.65rem, 1vw, 0.9rem)', letterSpacing: '0.25em',
        textTransform: 'uppercase', color: SUBTLE,
        fontWeight: 400, marginTop: '0.75rem',
      }}>
        days
      </div>

      <div style={{
        fontSize: 'clamp(0.78rem, 0.85vw, 0.9rem)',
        color: MUTED, marginTop: '2rem', letterSpacing: '0.04em',
      }}>
        {date}
      </div>
    </div>
  );
}
