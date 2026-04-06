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

export default function Dashboard() {
  const [mutualDate,   setMutualDate]   = useState(null);
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [, forceUpdate] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    const loadDates = () => {
      fetch('/api/dates')
        .then(r => r.json())
        .then(d => {
          if (!alive) return;
          setMutualDate(d.mutualDate || null);
          setPurchaseDate(d.purchaseDate || null);
        })
        .catch(() => {});
    };

    loadDates();

    // Refresh day counters every hour if left open overnight
    const id = setInterval(() => forceUpdate(n => n + 1), 3_600_000);
    const pollId = setInterval(loadDates, 60_000);

    return () => {
      alive = false;
      clearInterval(id);
      clearInterval(pollId);
    };
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
        padding: '1.65rem 3.9rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.3rem' }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '2.08rem', color: '#FFFFFF',
            letterSpacing: '0.1em', lineHeight: 1,
          }}>
            RUSH
          </span>
          <div style={{ width: '1px', height: '1.3rem', background: '#2E3D5E' }} />
          <span style={{
            fontWeight: 400, fontSize: '1.01rem',
            letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D7DFF0',
          }}>
            Land Acquisition &nbsp;/&nbsp; Deal Activity
          </span>
        </div>
          <button
          onClick={() => navigate('/update')}
          style={{
            background: 'none', border: '1px solid #2E3D5E',
            borderRadius: '2px', cursor: 'pointer', color: '#6A7A9A',
            padding: '0.46rem 1.17rem', fontSize: '0.88rem',
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
        />

        <div style={{ width: '1px', background: BORDER, margin: '4rem 0' }} />

        <Panel
          label="Days Since Last Purchase"
          days={purchaseDays}
        />

      </div>
    </div>
  );
}

function Panel({ label, days }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      padding: '2rem 3rem 4rem',
    }}>
      <div style={{
        fontSize: 'clamp(1rem, 1.15vw, 1.45rem)',
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: NAVY, marginBottom: '1.15rem', fontWeight: 700,
      }}>
        {label}
      </div>

      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 'clamp(4.5rem, 23vw, 23rem)',
        lineHeight: 0.84,
        color: days === null ? SUBTLE : '#1A2340',
        letterSpacing: '-0.01em', userSelect: 'none',
      }}>
        {days !== null ? days : '—'}
      </div>

      <div style={{
        fontSize: 'clamp(0.95rem, 1.1vw, 1.35rem)',
        letterSpacing: '0.24em', textTransform: 'uppercase',
        color: NAVY, fontWeight: 700, marginTop: '0.9rem',
      }}>
        days
      </div>
    </div>
  );
}
