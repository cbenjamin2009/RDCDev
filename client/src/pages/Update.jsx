import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NAVY   = '#1A2340';
const GOLD   = '#B89A5A';
const LIGHT  = '#F6F4F0';
const BORDER = '#E2DDD6';
const MUTED  = '#9A948A';
const SUBTLE = '#C8C2B8';

function todayDateValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isFutureDate(dateStr) {
  if (!dateStr) return false;
  return dateStr > todayDateValue();
}

const labelSt = {
  display: 'flex', flexDirection: 'column', gap: '0.4rem',
  fontSize: '0.72rem', letterSpacing: '0.14em',
  textTransform: 'uppercase', color: MUTED,
  fontFamily: "'DM Sans', sans-serif",
};
const inputBaseSt = {
  padding: '0.65rem 0.9rem', border: `1px solid ${BORDER}`,
  borderRadius: '2px', fontSize: '0.9rem', color: NAVY,
  background: '#fff', outline: 'none', width: '100%',
  fontFamily: "'DM Sans', sans-serif",
};
function inputSt(isCurrent) {
  return {
    ...inputBaseSt,
    borderColor: isCurrent ? GOLD : BORDER,
    background: isCurrent ? '#FFF9EF' : '#fff',
    boxShadow: isCurrent ? '0 0 0 1px rgba(184,154,90,0.18)' : 'none',
  };
}
const currentPillSt = {
  display: 'inline-flex', alignItems: 'center', alignSelf: 'flex-start',
  padding: '0.18rem 0.55rem', borderRadius: '999px',
  background: '#FFF3DA', border: '1px solid rgba(184,154,90,0.35)',
  color: NAVY, fontSize: '0.62rem', letterSpacing: '0.12em',
  textTransform: 'uppercase', fontWeight: 700,
};
const btnPrimary = {
  padding: '0.8rem 2rem', background: NAVY, color: '#fff',
  border: 'none', borderRadius: '2px', cursor: 'pointer',
  fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase',
  fontFamily: "'DM Sans', sans-serif",
};
const btnSecondary = {
  padding: '0.8rem 2rem', background: 'none', color: MUTED,
  border: `1px solid ${BORDER}`, borderRadius: '2px', cursor: 'pointer',
  fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase',
  fontFamily: "'DM Sans', sans-serif",
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function Update() {
  const navigate = useNavigate();
  const today = todayDateValue();

  // Current saved dates
  const [currentMutual,   setCurrentMutual]   = useState(null);
  const [currentPurchase, setCurrentPurchase] = useState(null);

  // Manual form
  const [manualMutual,   setManualMutual]   = useState(today);
  const [manualPurchase, setManualPurchase] = useState(today);

  // Status
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    fetch('/api/dates')
      .then(r => r.json())
      .then(d => {
        const mutual = d.mutualDate || null;
        const purchase = d.purchaseDate || null;
        setCurrentMutual(mutual);
        setCurrentPurchase(purchase);
        setManualMutual(mutual || today);
        setManualPurchase(purchase || today);
      })
      .catch(() => {});
  }, [today]);

  async function save(mutualDate, purchaseDate) {
    setSaving(true);
    setError('');
    try {
      if (isFutureDate(mutualDate) || isFutureDate(purchaseDate)) {
        throw new Error('future-date');
      }
      const res = await fetch('/api/dates', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ mutualDate, purchaseDate }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSuccess(true);
      setTimeout(() => navigate('/'), 1200);
    } catch (e) {
      setError(e?.message === 'future-date'
        ? 'Future dates are not allowed.'
        : 'Could not save. Make sure the server is running.');
    } finally {
      setSaving(false);
    }
  }

  function handleManualSave() {
    const m = manualMutual === '' ? currentMutual : manualMutual;
    const p = manualPurchase === '' ? currentPurchase : manualPurchase;
    save(m, p);
  }

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
            fontSize: '2.08rem', color: GOLD,
            letterSpacing: '0.1em', lineHeight: 1,
          }}>
            RUSH
          </span>
          <div style={{ width: '1px', height: '1.3rem', background: '#2E3D5E' }} />
          <span style={{
            fontWeight: 300, fontSize: '0.88rem',
            letterSpacing: '0.22em', textTransform: 'uppercase', color: '#6A7A9A',
          }}>
            Update Deal Dates
          </span>
        </div>
          <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: '1px solid #2E3D5E',
            borderRadius: '2px', cursor: 'pointer', color: '#6A7A9A',
            padding: '0.46rem 1.17rem', fontSize: '0.88rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
          onMouseOut={e =>  { e.currentTarget.style.borderColor = '#2E3D5E'; e.currentTarget.style.color = '#6A7A9A'; }}
        >
          ← Dashboard
        </button>
      </div>
      <div style={{ height: '3px', background: GOLD }} />

      {/* Body */}
      <div style={{
        flex: 1, display: 'flex', justifyContent: 'center',
        alignItems: 'flex-start', padding: '3rem 2rem',
      }}>
        <div style={{
          background: '#fff', border: `1px solid ${BORDER}`,
          borderRadius: '3px', borderTop: `3px solid ${GOLD}`,
          padding: '2.5rem', width: '100%', maxWidth: '520px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        }}>

          {/* Current values */}
          <div style={{
            display: 'flex', gap: '1rem', marginBottom: '2rem',
            padding: '1rem 1.25rem', background: LIGHT,
            borderRadius: '2px', border: `1px solid ${BORDER}`,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: SUBTLE, marginBottom: '0.3rem' }}>Current Mutual</div>
              <div style={{ fontSize: '0.85rem', color: NAVY, fontWeight: 500 }}>{formatDate(currentMutual) || '—'}</div>
            </div>
            <div style={{ width: '1px', background: BORDER }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: SUBTLE, marginBottom: '0.3rem' }}>Current Purchase</div>
              <div style={{ fontSize: '0.85rem', color: NAVY, fontWeight: 500 }}>{formatDate(currentPurchase) || '—'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <label style={labelSt}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                <span>Last Mutual Date</span>
                {currentMutual && manualMutual === currentMutual && (
                  <span style={currentPillSt}>Current</span>
                )}
                {!currentMutual && manualMutual === today && (
                  <span style={currentPillSt}>Today</span>
                )}
              </div>
              <input
                type="date"
                value={manualMutual}
                onChange={e => setManualMutual(e.target.value)}
                max={today}
                style={inputSt(Boolean(currentMutual && manualMutual === currentMutual) || (!currentMutual && manualMutual === today))}
              />
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'none', color: SUBTLE }}>
                {currentMutual ? `Saved date: ${formatDate(currentMutual)}` : 'No saved mutual date yet'}
              </span>
            </label>
            <label style={labelSt}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                <span>Last Purchase Date</span>
                {currentPurchase && manualPurchase === currentPurchase && (
                  <span style={currentPillSt}>Current</span>
                )}
                {!currentPurchase && manualPurchase === today && (
                  <span style={currentPillSt}>Today</span>
                )}
              </div>
              <input
                type="date"
                value={manualPurchase}
                onChange={e => setManualPurchase(e.target.value)}
                max={today}
                style={inputSt(Boolean(currentPurchase && manualPurchase === currentPurchase) || (!currentPurchase && manualPurchase === today))}
              />
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'none', color: SUBTLE }}>
                {currentPurchase ? `Saved date: ${formatDate(currentPurchase)}` : 'No saved purchase date yet'}
              </span>
            </label>
            <p style={{ fontSize: '0.78rem', color: SUBTLE, lineHeight: 1.6, margin: 0 }}>
              Future dates are blocked. Clear a field only if you want to preserve the current saved value.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button onClick={handleManualSave} disabled={saving} style={btnPrimary}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => navigate('/')} style={btnSecondary}>Cancel</button>
            </div>
          </div>

          {/* Feedback */}
          {success && (
            <div style={{
              marginTop: '1.25rem', padding: '0.75rem 1rem',
              background: '#F0F7F0', border: '1px solid #C3DCC3',
              borderRadius: '2px', fontSize: '0.82rem', color: '#2D6A2D',
            }}>
              Saved. Returning to dashboard…
            </div>
          )}
          {error && (
            <div style={{
              marginTop: '1.25rem', padding: '0.75rem 1rem',
              background: '#FDF0F0', border: '1px solid #DCC3C3',
              borderRadius: '2px', fontSize: '0.82rem', color: '#6A2D2D',
            }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
