// Simple local recommendation logic
export function recommendOutfitLocal(wardrobeItems, options = {}) {
  const { occasion, weather, color } = options || {};
  if (!Array.isArray(wardrobeItems)) return [];

  // Score items by matching simple rules
  const scored = wardrobeItems.map(item => {
    let score = 0;
    if (occasion) {
      const occ = occasion.toLowerCase();
      if (item.category && item.category.toLowerCase().includes(occ)) score += 3;
    }
    if (weather) {
      const w = weather.toLowerCase();
      if (w === 'cold' && item.category && /jacket|coat|sweater|hoodie/i.test(item.category)) score += 2;
      if (w === 'hot' && item.category && /t-?shirt|shorts|tank/i.test(item.category)) score += 2;
    }
    if (color && item.color && item.color.toLowerCase() === color.toLowerCase()) score += 1;
    // prefer items with image
    if (item.image_url) score += 1;
    return { item, score };
  });

  // sort by score desc
  scored.sort((a,b) => b.score - a.score);
  // pick top 3 distinct categories if possible
  const selected = [];
  const usedCats = new Set();
  for (const s of scored) {
    const cat = s.item.category || '__';
    if (usedCats.size < 3 && !usedCats.has(cat)) {
      selected.push(s.item);
      usedCats.add(cat);
    }
    if (selected.length >= 3) break;
  }
  // fallback: top 3
  if (selected.length === 0) return scored.slice(0,3).map(s=>s.item);
  return selected;
}
