// Donation inventory dashboard
// - Filters by Date + Category
// - KPIs: Total Items, Donation Rate (Completed%), Avg Quantity
// - Table: Item, Category, Status, Quantity, Calories, Expires, Date
// - "+ Add Donation" modal adds a new record (in-memory) and updates UI

const state = {
  all: [],
  filtered: [],
  categories: new Set(),
};

const els = {
  // filters & table
  date: document.getElementById("dateInput"),
  category: document.getElementById("categorySelect"),
  form: document.getElementById("filterForm"),
  tableBody: document.getElementById("tableBody"),
  emptyState: document.getElementById("emptyState"),
  kpiTotal: document.getElementById("kpiTotal"),
  kpiSuccess: document.getElementById("kpiSuccess"),
  kpiAvg: document.getElementById("kpiAvg"),
  visibleCount: document.getElementById("visibleCount"),
  toast: document.getElementById("toast"),
  clearBtn: document.getElementById("clearBtn"),

  // modal
  openAddBtn: document.getElementById("openAddModalBtn"),
  closeAddBtn: document.getElementById("closeAddModalBtn"),
  cancelAddBtn: document.getElementById("cancelAddBtn"),
  modalOverlay: document.getElementById("modalOverlay"),
  addForm: document.getElementById("addForm"),
  itemName: document.getElementById("itemName"),
  categoryAdd: document.getElementById("categoryAdd"),
  quantityAdd: document.getElementById("quantityAdd"),
  caloriesAdd: document.getElementById("caloriesAdd"),
  expiresAdd: document.getElementById("expiresAdd"),
  statusAdd: document.getElementById("statusAdd"),
  dateAdd: document.getElementById("dateAdd"),
};

init();

async function init() {
  // Load seed data
  try {
    const res = await fetch("data.json", { cache: "no-store" });
    state.all = await res.json();
  } catch (e) {
    console.error("Failed to load data.json. If running locally, start a local server.", e);
    state.all = [];
  }

  // Build categories
  populateCategories();

  // Default date = latest in dataset so we show rows on first load
  els.date.value = latestDateFromData(state.all) || todayISO();

  // Set defaults for Add modal
  els.dateAdd.value = todayISO();
  els.expiresAdd.value = dateAddDays(todayISO(), 3);

  // Initial render
  applyFilters();

  // Event handlers
  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilters(true);
  });

  els.clearBtn.addEventListener("click", () => {
    els.date.value = latestDateFromData(state.all) || todayISO();
    els.category.value = "All";
    applyFilters();
  });

  // Modal open/close
  els.openAddBtn.addEventListener("click", openModal);
  els.closeAddBtn.addEventListener("click", closeModal);
  els.cancelAddBtn.addEventListener("click", closeModal);
  els.modalOverlay.addEventListener("click", (e) => {
    if (e.target === els.modalOverlay) closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && els.modalOverlay.classList.contains("show")) closeModal();
  });

  // Add donation submit
  els.addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const record = buildRecordFromForm();
    if (!record) return;

    // Add to data (in-memory)
    state.all.push(record);

    // If new category, add to selects
    if (!state.categories.has(record.category)) {
      state.categories.add(record.category);
      appendOption(els.category, record.category);
      appendOption(els.categoryAdd, record.category);
    }

    // Set filters to the newly added record for a satisfying demo
    els.date.value = record.date;
    els.category.value = record.category;

    applyFilters(true);
    closeModal();
    showToastMsg("Donation added");
    els.addForm.reset();
    // restore sensible defaults
    els.dateAdd.value = todayISO();
    els.expiresAdd.value = dateAddDays(todayISO(), 3);
  });
}

function populateCategories() {
  state.categories = new Set(["All"]);
  state.all.forEach(item => state.categories.add(item.category));

  // Clear and repopulate selects
  // Main filter select (keep "All")
  els.category.innerHTML = "";
  appendOption(els.category, "All");

  // Add modal category select
  els.categoryAdd.innerHTML = "";

  [...state.categories]
    .filter(c => c !== "All")
    .sort((a, b) => a.localeCompare(b))
    .forEach(cat => {
      appendOption(els.category, cat);
      appendOption(els.categoryAdd, cat);
    });

  els.category.value = "All";
}

function appendOption(selectEl, value) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = value;
  selectEl.appendChild(opt);
}

function applyFilters(showToast = false) {
  const date = els.date.value;             // "YYYY-MM-DD"
  const category = els.category.value;     // "All" or specific

  state.filtered = state.all.filter(item => {
    const dateMatch = item.date === date;
    const catMatch = category === "All" ? true : item.category === category;
    return dateMatch && catMatch;
  });

  renderTable(state.filtered);
  renderKPIs(state.filtered);

  els.emptyState.hidden = state.filtered.length !== 0;

  if (showToast) showToastMsg("Filters updated");
}

function renderTable(rows) {
  els.tableBody.innerHTML = "";
  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(r.name)}</td>
      <td>${escapeHtml(r.category)}</td>
      <td><span class="status-pill status-${escapeHtml(r.status)}">${escapeHtml(r.status)}</span></td>
      <td>${formatNumber(r.quantity)}</td>
      <td>${formatNumber(r.calories)} kcal</td>
      <td>${escapeHtml(r.expires)}</td>
      <td>${escapeHtml(r.date)}</td>
      <td class="actions-col"><a href="#" class="link" onclick="return viewItem('${encodeURIComponent(r.id)}')">View</a></td>
    `;
    els.tableBody.appendChild(tr);
  });

  els.visibleCount.textContent = String(rows.length);
}

function renderKPIs(rows) {
  const total = rows.length;
  const completed = rows.filter(r => r.status === "Completed").length;
  const donationRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  const avgQty = total === 0
    ? 0
    : Math.round(rows.reduce((sum, r) => sum + Number(r.quantity || 0), 0) / total);

  els.kpiTotal.textContent = String(total);
  els.kpiSuccess.textContent = donationRate + "%";
  els.kpiAvg.textContent = avgQty.toString();
}

function buildRecordFromForm() {
  const name = els.itemName.value.trim();
  const category = els.categoryAdd.value.trim();
  const quantity = Number(els.quantityAdd.value);
  const calories = els.caloriesAdd.value ? Number(els.caloriesAdd.value) : 0;
  const expires = els.expiresAdd.value;
  const status = els.statusAdd.value;
  const date = els.dateAdd.value;

  if (!name || !category || !expires || !status || !date || Number.isNaN(quantity)) {
    showToastMsg("Please complete all required fields");
    return null;
  }

  return {
    id: String(Date.now()),
    name,
    category,
    status,
    quantity,
    calories,
    expires, // YYYY-MM-DD
    date    // YYYY-MM-DD (donation date)
  };
}

function openModal() {
  els.modalOverlay.classList.add("show");
  els.modalOverlay.setAttribute("aria-hidden", "false");
  // Defaults each time you open
  els.dateAdd.value = todayISO();
  els.expiresAdd.value = dateAddDays(todayISO(), 3);
  els.itemName.focus();
}

function closeModal() {
  els.modalOverlay.classList.remove("show");
  els.modalOverlay.setAttribute("aria-hidden", "true");
}

function viewItem(id) {
  showToastMsg("Open details (demo only)");
  return false;
}

/* Utilities */
function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function dateAddDays(iso, n) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function latestDateFromData(arr) {
  if (!arr.length) return null;
  // dates stored as "YYYY-MM-DD" → lexicographically comparable
  return arr.map(x => x.date).sort().reverse()[0];
}

function formatNumber(n) {
  return new Intl.NumberFormat().format(n);
}

function showToastMsg(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add("show");
  setTimeout(() => els.toast.classList.remove("show"), 1800);
}

// Sanitizer for any text we inject into the DOM
function escapeHtml(s) {
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
