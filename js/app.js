// Japan Disposal Guide - Main Application Logic
document.addEventListener("DOMContentLoaded", async () => {
  await loadData();
  if (!ITEMS_DATA.length) { document.getElementById("app").innerHTML = "<p class='p-8 text-red-600'>Failed to load data.</p>"; return; }
  initSearch();
  renderCategories();
  renderItems(ITEMS_DATA);
  renderPlatforms();
  renderHowItWorks();
});

let fuse;
let activeCategory = "all";

function initSearch() {
  fuse = new Fuse(ITEMS_DATA, { keys: ["name", "tags", "category"], threshold: 0.4 });
  const input = document.getElementById("search-input");
  input.addEventListener("input", (e) => {
    const q = e.target.value.trim();
    const filtered = q ? fuse.search(q).map(r => r.item) : ITEMS_DATA;
    const byCategory = activeCategory === "all" ? filtered : filtered.filter(i => i.category === activeCategory);
    renderItems(byCategory);
  });
}

function renderCategories() {
  const container = document.getElementById("category-filters");
  container.innerHTML = CATEGORIES.map(c =>
    `<button data-cat="${c.id}" class="cat-btn px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${c.id === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}">${c.icon} ${c.label}</button>`
  ).join("");
  container.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      container.querySelectorAll(".cat-btn").forEach(b => { b.className = b.className.replace(/bg-indigo-600 text-white/g, "bg-gray-100 text-gray-700 hover:bg-gray-200"); });
      btn.className = btn.className.replace(/bg-gray-100 text-gray-700 hover:bg-gray-200/g, "bg-indigo-600 text-white");
      const q = document.getElementById("search-input").value.trim();
      const base = q ? fuse.search(q).map(r => r.item) : ITEMS_DATA;
      renderItems(activeCategory === "all" ? base : base.filter(i => i.category === activeCategory));
    });
  });
}

function renderItems(items) {
  const container = document.getElementById("items-grid");
  if (!items.length) { container.innerHTML = "<p class='col-span-full text-center text-gray-500 py-12'>No items found. Try a different search term.</p>"; return; }
  container.innerHTML = items.map(item => {
    const badge = item.recycling_law ? `<span class="inline-block px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full">Recycling Law</span>` : "";
    const methods = item.disposal_methods.map(m => {
      const colors = DISPOSAL_METHOD_COLORS[m.method] || DISPOSAL_METHOD_COLORS.combustible;
      const cost = m.cost_range ? (m.cost_range === "0" ? "Free" : `${m.cost_range} yen`) : "";
      const platformLinks = m.platforms ? m.platforms.map(pid => {
        const p = PLATFORMS_DATA.find(pl => pl.id === pid);
        return p ? `<a href="${p.url}" target="_blank" rel="noopener" class="inline-block px-2 py-0.5 text-xs bg-white border rounded hover:bg-gray-50 min-h-[44px] leading-[40px]">${p.name}</a>` : "";
      }).join(" ") : "";
      const steps = m.steps ? `<ol class="mt-2 ml-4 text-xs text-gray-600 list-decimal space-y-0.5">${m.steps.map(s => `<li>${s}</li>`).join("")}</ol>` : "";
      return `<div class="p-3 rounded-lg border ${colors.bg} ${colors.border}">
        <div class="flex items-center justify-between flex-wrap gap-1">
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}">${m.label}</span>
          ${cost ? `<span class="text-sm font-bold text-gray-800">${cost}</span>` : ""}
        </div>
        ${steps}${m.note ? `<p class="mt-1 text-xs text-gray-500">${m.note}</p>` : ""}
        ${platformLinks ? `<div class="mt-2 flex flex-wrap gap-1">${platformLinks}</div>` : ""}
      </div>`;
    }).join("");
    return `<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div class="p-4">
        <div class="flex items-center justify-between mb-3"><h3 class="text-lg font-bold text-gray-900">${item.name}</h3>${badge}</div>
        <div class="space-y-2">${methods}</div>
      </div>
    </div>`;
  }).join("");
}

function renderPlatforms() {
  const container = document.getElementById("platforms-grid");
  container.innerHTML = PLATFORMS_DATA.map(p => {
    const engSupport = { app_only: "English App", none: "Japanese Only", limited: "Limited English" }[p.english_support] || p.english_support;
    const engColor = { app_only: "text-green-700 bg-green-50", none: "text-red-700 bg-red-50", limited: "text-yellow-700 bg-yellow-50" }[p.english_support] || "";
    return `<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-gray-900">${p.name}</h3>
        <span class="text-xs font-medium px-2 py-0.5 rounded-full ${engColor}">${engSupport}</span>
      </div>
      <div class="space-y-1 text-sm text-gray-600">
        <p><span class="font-medium text-gray-700">Fee:</span> ${p.fee}</p>
        <p><span class="font-medium text-gray-700">Shipping:</span> ${p.shipping}</p>
        <p><span class="font-medium text-gray-700">Best for:</span> ${p.best_for.join(", ")}</p>
        <p class="text-xs text-gray-500 mt-2">${p.note}</p>
      </div>
      <a href="${p.url}" target="_blank" rel="noopener" class="mt-3 inline-block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors min-h-[44px] leading-[28px]">Visit ${p.name}</a>
    </div>`;
  }).join("");
}

function renderHowItWorks() {
  // Sodai gomi steps
  const stepsContainer = document.getElementById("sodai-steps");
  stepsContainer.innerHTML = SODAI_GOMI_STEPS.map(s =>
    `<div class="flex gap-3 items-start">
      <div class="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold min-w-[44px] min-h-[44px]">${s.step}</div>
      <div><p class="font-semibold text-gray-900">${s.title}</p><p class="text-sm text-gray-600">${s.desc}</p></div>
    </div>`
  ).join("");

  // Recycling law table
  const tableContainer = document.getElementById("recycling-table");
  tableContainer.innerHTML = `<table class="w-full text-sm">
    <thead><tr class="border-b border-gray-200"><th class="text-left py-2 font-semibold text-gray-700">Item</th><th class="text-right py-2 font-semibold text-gray-700">Recycling Fee (yen)</th></tr></thead>
    <tbody>${RECYCLING_LAW_ITEMS.map(r =>
      `<tr class="border-b border-gray-100"><td class="py-2 text-gray-800">${r.name}<br><span class="text-xs text-gray-500">${r.note}</span></td><td class="py-2 text-right font-bold text-gray-900">${r.fee}</td></tr>`
    ).join("")}</tbody>
  </table>
  <p class="mt-3 text-xs text-gray-500">Source: Home Appliance Recycling Law (特定家庭用機器再商品化法). Fees as of 2024. Transport/collection fee of 1,000-3,000 yen is charged separately by the retailer or collector.</p>`;
}
