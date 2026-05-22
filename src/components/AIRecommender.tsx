import React, { useEffect, useState } from 'react';
import { wardrobeAPI } from '../utils/api';
import { recommendOutfitLocal } from '../utils/recommend';
import { recommendOutfitAI } from '../utils/aiRecommend';

export function AIRecommender() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [mode, setMode] = useState<'local'|'ai'>('local');
  const [occasion, setOccasion] = useState('casual');
  const [weather, setWeather] = useState('hot');
  const [error, setError] = useState<string | null>(null);

  useEffect(()=>{ fetchItems(); }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await wardrobeAPI.getAll();
      const data = res.data || res;
      setItems(data || []);
    } catch (err:any) {
      setError(err?.message || String(err));
    } finally { setLoading(false); }
  }

  async function generate() {
    setError(null);
    if (mode === 'local') {
      const rec = recommendOutfitLocal(items, { occasion, weather });
      setRecommendations(rec);
    } else {
      try {
        setLoading(true);
        const rec = await recommendOutfitAI(items, { occasion, weather });
        setRecommendations(rec);
      } catch (err:any) {
        setError(err?.message || String(err));
      } finally { setLoading(false); }
    }
  }

  return (
    <div style={{padding:16}}>
      <h2>Outfit Recommender</h2>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <label>Mode:
          <select value={mode} onChange={e=>setMode(e.target.value as any)}>
            <option value="local">Local (free)</option>
            <option value="ai">AI (OpenAI)</option>
          </select>
        </label>
        <label>Occasion:
          <select value={occasion} onChange={e=>setOccasion(e.target.value)}>
            <option>casual</option>
            <option>formal</option>
            <option>party</option>
            <option>sport</option>
          </select>
        </label>
        <label>Weather:
          <select value={weather} onChange={e=>setWeather(e.target.value)}>
            <option>hot</option>
            <option>cold</option>
            <option>rainy</option>
          </select>
        </label>
        <button onClick={generate}>Generate</button>
        <button onClick={fetchItems}>Refresh Wardrobe</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{color:'red'}}>{error}</div>}

      <div>
        <h3>Recommendations</h3>
        {recommendations && recommendations.length>0 ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {recommendations.map((rec:any, idx:number) => (
              <div key={idx} style={{border:'1px solid #ddd',padding:8}}>
                <h4>Outfit {idx+1}</h4>
                {Array.isArray(rec) ? (
                  <ul>
                    {rec.map((id:any)=> {
                      const it = items.find((x:any)=> String(x.id) === String(id));
                      return <li key={id}>{it ? `${it.name} (${it.category})` : `Item ${id}`}</li>;
                    })}
                  </ul>
                ) : rec?.items ? (
                  <ul>{rec.items.map((it:any, i:number)=><li key={i}>{it.name}</li>)}</ul>
                ) : (
                  <pre>{JSON.stringify(rec, null, 2)}</pre>
                )}
                <p>{rec.description || rec.desc || ''}</p>
              </div>
            ))}
          </div>
        ) : <div>No recommendations yet</div>}
      </div>
    </div>
  );
}

export default AIRecommender;
