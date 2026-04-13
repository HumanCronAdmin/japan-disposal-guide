// Japan Disposal Guide - Data Arrays
// Real disposal information for items commonly needed by expats in Japan

const CATEGORIES = [
  { id: "all", label: "All Items", icon: "📋" },
  { id: "furniture", label: "Furniture", icon: "🪑" },
  { id: "appliances", label: "Appliances", icon: "🔌" },
  { id: "electronics", label: "Electronics", icon: "💻" },
  { id: "bikes", label: "Bikes", icon: "🚲" },
  { id: "other", label: "Other", icon: "📦" }
];

const DISPOSAL_METHOD_COLORS = {
  sodai_gomi: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-800" },
  recycling_law: { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-800" },
  secondhand_sell: { bg: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-800" },
  pickup_service: { bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-100 text-orange-800" },
  manufacturer_recycling: { bg: "bg-purple-50", border: "border-purple-200", badge: "bg-purple-100 text-purple-800" },
  combustible: { bg: "bg-gray-50", border: "border-gray-200", badge: "bg-gray-100 text-gray-800" },
  incombustible: { bg: "bg-gray-50", border: "border-gray-200", badge: "bg-gray-100 text-gray-800" },
  recycling_box: { bg: "bg-teal-50", border: "border-teal-200", badge: "bg-teal-100 text-teal-800" }
};

const SODAI_GOMI_STEPS = [
  { step: 1, title: "Apply", desc: "Call or apply online at your city/ward's bulk waste center (sodai gomi uketsuke center)." },
  { step: 2, title: "Get a date", desc: "You will be assigned a collection date and told the fee amount." },
  { step: 3, title: "Buy stickers", desc: "Purchase sodai gomi stickers (処理券) at your nearest konbini for the exact fee." },
  { step: 4, title: "Attach & place", desc: "Write your name/reception number on the sticker, attach it to the item." },
  { step: 5, title: "Put it out", desc: "Place the item at the designated spot by 8:00 AM on collection day." }
];

const RECYCLING_LAW_ITEMS = [
  { name: "Television (TV)", fee: "1,320 - 3,700", note: "Fee varies by screen size and manufacturer" },
  { name: "Refrigerator / Freezer", fee: "3,740 - 4,730", note: "Fee varies by volume (170L threshold)" },
  { name: "Washing Machine / Dryer", fee: "2,530", note: "Same fee for washers and clothes dryers" },
  { name: "Air Conditioner", fee: "990 - 2,000", note: "Professional removal required (refrigerant gas)" }
];

// Items data loaded from items.json at runtime, but also available inline as fallback
let ITEMS_DATA = [];
let PLATFORMS_DATA = [];

async function loadData() {
  try {
    const [itemsRes, platformsRes] = await Promise.all([
      fetch("data/items.json"),
      fetch("data/platforms.json")
    ]);
    const itemsJson = await itemsRes.json();
    const platformsJson = await platformsRes.json();
    ITEMS_DATA = itemsJson.items;
    PLATFORMS_DATA = platformsJson.platforms;
  } catch (e) {
    console.warn("Failed to load JSON data, using inline fallback:", e);
  }
}
