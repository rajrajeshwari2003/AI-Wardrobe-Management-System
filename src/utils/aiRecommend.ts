    // AI recommendation using OpenAI Chat Completions (fetch)
    // Requires VITE_OPENAI_KEY in env (.env)
    export async function recommendOutfitAI(wardrobeItems, context = {}) {
      const key = import.meta.env.VITE_OPENAI_KEY;
      if (!key) throw new Error('Missing VITE_OPENAI_KEY environment variable');

      // create a compact description of wardrobe
      const items = wardrobeItems.slice(0, 60).map(i => ({
        id: i.id,
        name: i.name,
        category: i.category,
        color: i.color,
        image: i.image_url || null
      }));

      const prompt = `You are a fashion stylist. Given the following wardrobe items (JSON array) and context, recommend 3 complete outfits. 
Wardrobe: ${JSON.stringify(items)}
Context: ${JSON.stringify(context)}
Return output as a JSON array of 3 outfits, each outfit is an array of item ids, and include a short description for each outfit.`;

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + key
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 600,
          temperature: 0.8
        })
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error('OpenAI error: ' + t);
      }
      const j = await res.json();
      const content = j.choices?.[0]?.message?.content;
      try {
        return JSON.parse(content);
      } catch (e) {
        // fallback: return the content string
        return { raw: content };
      }
    }
