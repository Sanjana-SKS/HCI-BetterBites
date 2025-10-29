'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type RecordT = {
  id: string;
  name: string;
  category: string;
  status: 'Completed' | 'Pending' | 'Flagged';
  quantity: number;
  calories: number;
  expires: string; // YYYY-MM-DD
  date: string;    // YYYY-MM-DD
};

export default function DashboardPage() {
  const [all, setAll] = useState<RecordT[]>([]);
  const [filtered, setFiltered] = useState<RecordT[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);

  const [date, setDate] = useState<string>('');
  const [category, setCategory] = useState<string>('All');

  // Modal state
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [catAdd, setCatAdd] = useState('');
  const [qtyAdd, setQtyAdd] = useState<number | ''>('');
  const [calAdd, setCalAdd] = useState<number | ''>('');
  const [expAdd, setExpAdd] = useState('');
  const [statusAdd, setStatusAdd] = useState<'Completed' | 'Pending' | 'Flagged'>('Pending');
  const [dateAdd, setDateAdd] = useState('');

  // Toast
  const [toast, setToast] = useState<string>('');

  // Load data from /public/data.json
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/data.json', { cache: 'no-store' });
        const data: RecordT[] = await res.json();
        setAll(data);

        const set = new Set<string>(['All']);
        data.forEach(r => set.add(r.category));
        setCategories(Array.from(set));

        setDate(latestDateFromData(data) ?? todayISO());
      } catch (e) {
        console.error('Failed to load /data.json', e);
        setAll([]);
        setDate(todayISO());
      }
    })();
  }, []);

  // Filter whenever inputs change
  useEffect(() => {
    const rows = all.filter(r => {
      const dateMatch = !date || r.date === date;
      const catMatch = category === 'All' ? true : r.category === category;
      return dateMatch && catMatch;
    });
    setFiltered(rows);
  }, [all, date, category]);

  // KPIs
  const kpis = useMemo(() => {
    const total = filtered.length;
    const completed = filtered.filter(r => r.status === 'Completed').length;
    const donationRate = total === 0 ? 0 : Math.round((completed / total) * 100);
    const avgQty = total === 0 ? 0 : Math.round(filtered.reduce((s, r) => s + (r.quantity || 0), 0) / total);
    return { total, donationRate, avgQty };
  }, [filtered]);

  // Modal defaults
  useEffect(() => {
    if (open) {
      setDateAdd(todayISO());
      setExpAdd(dateAddDays(todayISO(), 3));
      setItemName('');
      setCatAdd(categories.find(c => c !== 'All') || '');
      setQtyAdd('');
      setCalAdd('');
      setStatusAdd('Pending');
    }
  }, [open, categories]);

  function addDonation(e: React.FormEvent) {
    e.preventDefault();
    if (!itemName || !catAdd || !expAdd || !dateAdd || qtyAdd === '' || qtyAdd === null) {
      setToast('Please complete all required fields');
      hideToastSoon();
      return;
    }
    const record: RecordT = {
      id: String(Date.now()),
      name: itemName,
      category: catAdd,
      status: statusAdd,
      quantity: Number(qtyAdd),
      calories: calAdd ? Number(calAdd) : 0,
      expires: expAdd,
      date: dateAdd,
    };
    const next = [...all, record];
    setAll(next);
    setCategory(record.category);
    setDate(record.date);
    setOpen(false);
    setToast('Donation added');
    hideToastSoon();
  }

  function hideToastSoon() { setTimeout(() => setToast(''), 1800); }

  return (
    <div>
      {/* Topbar */}
      <header className="topbar">
        <div className="brand">
          <div className="logo">BB</div>
          <div className="title">
            <h1>BetterBites</h1>
            <p className="subtitle">Donation Inventory · Dashboard</p>
          </div>
        </div>
        <div className="user"><span className="username">Hi, Alex</span></div>
      </header>

      {/* Tabs */}
      <nav className="tabs" aria-label="Primary">
        <span className="tab active" aria-current="page">Dashboard</span>
        {/* Adjust this href to your teammate’s history route: e.g. /weekly-waste */}
        <Link className="tab" href="/weekly-waste">History</Link>
      </nav>

      <main className="page" role="main">
        {/* Filters */}
        <section className="card filters" aria-labelledby="filters">
          <div className="card-head">
            <h2 id="filters">Filters</h2>
            <div className="card-actions">
              <button className="btn primary" onClick={() => setOpen(true)}>+ Add Donation</button>
            </div>
          </div>

          <form className="filter-grid" onSubmit={(e) => { e.preventDefault(); setToast('Filters updated'); hideToastSoon(); }}>
            <div className="field">
              <label htmlFor="dateInput">Date</label>
              <input id="dateInput" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="categorySelect">Category</label>
              <select id="categorySelect" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="actions">
              <button className="btn primary" type="submit">Apply</button>
              <button className="btn" type="button" onClick={() => { setCategory('All'); setDate(latestDateFromData(all) ?? todayISO()); }}>Clear</button>
            </div>
          </form>
          <div className="helper">Change Date/Category and click <b>Apply</b>. KPIs and table update.</div>
        </section>

        {/* KPIs */}
        <section className="kpis" aria-label="KPIs">
          <article className="kpi card"><div className="kpi-label">Total Items</div><div className="kpi-value">{kpis.total}</div></article>
          <article className="kpi card"><div className="kpi-label">Donation Rate</div><div className="kpi-value">{kpis.donationRate}%</div></article>
          <article className="kpi card"><div className="kpi-label">Avg Quantity</div><div className="kpi-value">{kpis.avgQty}</div></article>
        </section>

        {/* Table */}
        <section className="card" aria-labelledby="table">
          <div className="card-head">
            <h2 id="table">Recent Donations</h2>
            <div className="count"><span>{filtered.length}</span> shown</div>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th><th>Category</th><th>Status</th><th>Quantity</th><th>Calories</th><th>Expires</th><th>Date</th><th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.category}</td>
                    <td><span className={`status-pill status-${r.status}`}>{r.status}</span></td>
                    <td>{fmt(r.quantity)}</td>
                    <td>{fmt(r.calories)} kcal</td>
                    <td>{r.expires}</td>
                    <td>{r.date}</td>
                    <td className="actions-col"><a className="link" href="#" onClick={(e) => { e.preventDefault(); setToast('Open details (demo only)'); hideToastSoon(); }}>View</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && <div className="empty">No results for the selected filters.</div>}
        </section>
      </main>

      {/* Toast */}
      {!!toast && <div className="toast show">{toast}</div>}

      {/* Add Donation Modal */}
      {open && (
        <div className="modal-overlay show" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="addHeading">
            <div className="modal-head">
              <h3 id="addHeading">Add Donation</h3>
              <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close">×</button>
            </div>
            <form className="modal-form" onSubmit={addDonation}>
              <div className="field"><label>Item</label><input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required /></div>
              <div className="field">
                <label>Category</label>
                <select value={catAdd} onChange={(e) => setCatAdd(e.target.value)} required>
                  {categories.filter(c => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field"><label>Quantity</label><input type="number" min={0} step={1} value={qtyAdd} onChange={(e) => setQtyAdd(e.target.value === '' ? '' : Number(e.target.value))} required /></div>
              <div className="field"><label>Calories (optional)</label><input type="number" min={0} step={1} value={calAdd} onChange={(e) => setCalAdd(e.target.value === '' ? '' : Number(e.target.value))} /></div>
              <div className="field"><label>Expiration</label><input type="date" value={expAdd} onChange={(e) => setExpAdd(e.target.value)} required /></div>
              <div className="field">
                <label>Status</label>
                <select value={statusAdd} onChange={(e) => setStatusAdd(e.target.value as any)}>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Flagged">Flagged</option>
                </select>
              </div>
              <div className="field"><label>Donation Date</label><input type="date" value={dateAdd} onChange={(e) => setDateAdd(e.target.value)} required /></div>
              <div className="modal-actions">
                <button className="btn primary" type="submit">Submit</button>
                <button className="btn" type="button" onClick={() => setOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styles (kept local so we don't depend on global CSS) */}
      <style jsx>{`
        :global(body){margin:0;background:linear-gradient(180deg,#0b0f17,#0e1117);color:#e6edf3;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial}
        .topbar{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid #232938;position:sticky;top:0;background:rgba(14,17,23,.8);backdrop-filter:blur(8px);z-index:10}
        .brand{display:flex;gap:12px;align-items:center}
        .logo{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:#7c3aed;color:#fff;font-weight:700;box-shadow:0 10px 24px rgba(0,0,0,.35)}
        .title h1{margin:0;font-size:18px}.subtitle{margin:2px 0 0 0;color:#8b949e;font-size:12px}
        .user{display:flex;gap:10px;align-items:center}.username{color:#8b949e}
        .tabs{display:flex;gap:10px;padding:10px 20px;border-bottom:1px solid #232938}
        .tab{display:inline-flex;gap:8px;padding:8px 12px;border-radius:999px;border:1px solid #232938;color:#8b949e;text-decoration:none}
        .tab.active{background:#161b22;color:#e6edf3;border-color:#2a3242}
        .page{max-width:1100px;margin:24px auto;padding:0 20px}
        .card{background:linear-gradient(180deg,#111827,#0f1625);border:1px solid #232938;border-radius:16px;box-shadow:0 10px 24px rgba(0,0,0,.35)}
        .card + .card{margin-top:18px}
        .card-head{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid #232938}
        .card-actions{display:flex;gap:8px}
        .filters{padding-bottom:12px}
        .filter-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:12px;padding:16px}
        .field{grid-column:span 4}
        .actions{grid-column:span 4;display:flex;gap:8px;align-items:end}
        label{display:block;margin-bottom:6px;color:#8b949e;font-size:13px}
        input[type="date"],select,input[type="text"],input[type="number"]{width:100%;padding:10px 12px;border-radius:10px;border:1px solid #232938;background:#0c1220;color:#e6edf3;outline:none}
        .btn{padding:10px 14px;border-radius:12px;border:1px solid #232938;background:#0c1220;color:#e6edf3;cursor:pointer}
        .btn.primary{background:linear-gradient(90deg,#7c3aed,#a78bfa);border-color:transparent}
        .helper{padding:0 16px 12px 16px;color:#8b949e;font-size:12px}
        .kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:16px 0}
        .kpi{padding:16px}.kpi-label{color:#8b949e;font-size:12px}.kpi-value{font-size:28px;font-weight:700;margin-top:6px}
        .table-wrap{overflow:auto}
        table{width:100%;border-collapse:collapse}
        th,td{padding:12px 10px;border-bottom:1px solid #232938;text-align:left}
        thead th{position:sticky;top:0;background:#101621}
        .status-pill{padding:4px 8px;border-radius:999px;font-size:12px;border:1px solid #232938}
        .status-Completed{background:rgba(16,185,129,.15);color:#34d399}
        .status-Pending{background:rgba(245,158,11,.15);color:#f59e0b}
        .status-Flagged{background:rgba(239,68,68,.15);color:#ef4444}
        .actions-col{white-space:nowrap}
        .link{color:#93c5fd;text-decoration:none;border-bottom:1px dotted #93c5fd}
        .empty{padding:16px;color:#8b949e}
        .toast{position:fixed;left:50%;transform:translateX(-50%);bottom:20px;background:#101827;border:1px solid #232938;color:#e6edf3;padding:10px 14px;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.35)}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:20px;z-index:50}
        .modal{width:min(680px,96vw);background:linear-gradient(180deg,#111827,#0f1625);border:1px solid #232938;border-radius:18px;box-shadow:0 10px 24px rgba(0,0,0,.35)}
        .modal-head{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid #232938}
        .icon-btn{background:transparent;border:1px solid #232938;color:#e6edf3;width:36px;height:36px;border-radius:10px;cursor:pointer}
        .modal-form{display:grid;grid-template-columns:repeat(12,1fr);gap:12px;padding:16px}
        .modal-form .field{grid-column:span 6}
        .modal-actions{grid-column:span 12;display:flex;gap:8px;justify-content:flex-end}
        @media (max-width:900px){.filter-grid{grid-template-columns:1fr 1fr}.kpis{grid-template-columns:1fr}.modal-form{grid-template-columns:1fr}.modal-form .field{grid-column:auto}}
      `}</style>
    </div>
  );
}

/* helpers */
function fmt(n: number) { return new Intl.NumberFormat().format(n); }
function todayISO() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function dateAddDays(iso: string, n: number) { const d = new Date(iso+'T00:00:00'); d.setDate(d.getDate()+n); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function latestDateFromData(arr: RecordT[]) { if (!arr.length) return null; return arr.map(x=>x.date).sort().reverse()[0] ?? null; }
