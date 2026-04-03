import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const NAVY   = '#1A2340';
const GOLD   = '#B89A5A';
const LIGHT  = '#F6F4F0';
const BORDER = '#E2DDD6';
const MUTED  = '#9A948A';
const SUBTLE = '#C8C2B8';

const labelSt = {
  display: 'flex', flexDirection: 'column', gap: '0.4rem',
  fontSize: '0.72rem', letterSpacing: '0.14em',
  textTransform: 'uppercase', color: MUTED,
  fontFamily: "'DM Sans', sans-serif",
};
const inputSt = {
  padding: '0.65rem 0.9rem', border: `1px solid ${BORDER}`,
  borderRadius: '2px', fontSize: '0.9rem', color: NAVY,
  background: '#fff', outline: 'none', width: '100%',
  fontFamily: "'DM Sans', sans-serif",
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

function getMostRecent(rows, colIdx) {
  let latest = null;
  for (const row of rows) {
    const val = row[colIdx];
    if (!val) continue;
    const d = val instanceof Date ? val : new Date(val);
    if (!isNaN(d) && (!latest || d > latest)) latest = d;
  }
  return latest ? latest.toISOString().split('T')[0] : null;
}

export default function Update() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('manual');

  // Current saved dates
  const [currentMutual,   setCurrentMutual]   = useState(null);
  const [currentPurchase, setCurrentPurchase] = useState(null);

  // Manual form
  const [manualMutual,   setManualMutual]   = useState('');
  const [manualPurchase, setManualPurchase] = useState('');

  // Excel
  const [headers,     setHeaders]     = useState([]);
  const [rows,        setRows]        = useState([]);
  const [fileReady,   setFileReady]   = useState(false);
  const [mutualCol,   setMutualCol]   = useState('');
  const [purchaseCol, setPurchaseCol] = useState('');
  const [fileName,    setFileName]    = useState('');

  // Status
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    fetch('/api/dates')
      .then(r => r.json())
      .then(d => {
        setCurrentMutual(d.mutualDate     || null);
        setCurrentPurchase(d.purchaseDate || null);
      })
      .catch(() => {});
  }, []);

  async function save(mutualDate, purchaseDate) {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/dates', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ mutualDate, purchaseDate }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSuccess(true);
      setTimeout(() => navigate('/'), 1200);
    } catch (e) {
      setError('Could not save. Make sure the server is running.');
    } finally {
      setSaving(false);
    }
  }

  function handleManualSave() {
    const m = manualMutual   || currentMutual;
    const p = manualPurchase || currentPurchase;
    save(m, p);
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb   = XLSX.read(evt.target.result, { type: 'array', cellDates: true });
      const ws   = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (data.length < 2) return;
      setHeaders((data[0] || []).map(String));
      setRows(data.slice(1));
      setFileReady(true);
    };
    reader.readAsArrayBuffer(file);
  }

  function handleExcelSave() {
    const mIdx = headers.indexOf(mutualCol);
    const pIdx = headers.indexOf(purchaseCol);
    const newM = mIdx >= 0 ? getMostRecent(rows, mIdx) : null;
    const newP = pIdx >= 0 ? getMostRecent(rows, pIdx) : null;
    save(newM || currentMutual, newP || currentPurchase);
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
            Update Deal Dates
          </span>
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: '1px solid #2E3D5E',
            borderRadius: '2px', cursor: 'pointer', color: '#6A7A9A',
            padding: '0.35rem 0.9rem', fontSize: '0.68rem',
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

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, marginBottom: '1.75rem' }}>
            {[['manual', 'Manual Entry'], ['upload', 'Upload Excel']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.5rem 1.25rem', marginBottom: '-1px',
                fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: tab === key ? NAVY : MUTED,
                borderBottom: tab === key ? `2px solid ${GOLD}` : '2px solid transparent',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Manual tab */}
          {tab === 'manual' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <label style={labelSt}>
                Last Mutual Date
                <input
                  type="date"
                  value={manualMutual}
                  onChange={e => setManualMutual(e.target.value)}
                  style={inputSt}
                />
              </label>
              <label style={labelSt}>
                Last Purchase Date
                <input
                  type="date"
                  value={manualPurchase}
                  onChange={e => setManualPurchase(e.target.value)}
                  style={inputSt}
                />
              </label>
              <p style={{ fontSize: '0.78rem', color: SUBTLE, lineHeight: 1.6, margin: 0 }}>
                Leave a field blank to keep its current value.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button onClick={handleManualSave} disabled={saving} style={btnPrimary}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button onClick={() => navigate('/')} style={btnSecondary}>Cancel</button>
              </div>
            </div>
          )}

          {/* Upload tab */}
          {tab === 'upload' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <label style={labelSt}>
                Excel or CSV File
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFile}
                  style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: '#555', fontFamily: "'DM Sans', sans-serif" }}
                />
                {fileName && (
                  <span style={{ fontSize: '0.75rem', color: GOLD, marginTop: '0.2rem' }}>{fileName}</span>
                )}
              </label>

              {!fileReady && (
                <p style={{ fontSize: '0.78rem', color: SUBTLE, lineHeight: 1.6, margin: 0 }}>
                  Upload your spreadsheet and select which columns contain the mutual and purchase dates.
                  The app will automatically find the most recent date in each column.
                </p>
              )}

              {fileReady && (
                <>
                  <label style={labelSt}>
                    Mutual Date Column
                    <select value={mutualCol} onChange={e => setMutualCol(e.target.value)} style={inputSt}>
                      <option value="">— select column —</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </label>
                  <label style={labelSt}>
                    Purchase Date Column
                    <select value={purchaseCol} onChange={e => setPurchaseCol(e.target.value)} style={inputSt}>
                      <option value="">— select column —</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </label>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button onClick={handleExcelSave} disabled={saving} style={btnPrimary}>
                      {saving ? 'Saving…' : 'Apply & Save'}
                    </button>
                    <button onClick={() => navigate('/')} style={btnSecondary}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          )}

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
