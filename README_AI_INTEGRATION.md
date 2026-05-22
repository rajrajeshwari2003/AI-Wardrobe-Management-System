# AI & Storage Integration

## What was added
- src/utils/uploadImage.ts -> helper to upload image to Supabase Storage (bucket: wardrobe-images)
- src/utils/recommend.ts -> simple local recommender
- src/utils/aiRecommend.ts -> OpenAI-based recommender (requires VITE_OPENAI_KEY)
- src/components/AIRecommender.tsx -> new component demonstrating usage of both recommenders
- supabase/migrations/*.sql -> SQL files to create improved wardrobe and events tables
- .env.example updated with VITE_OPENAI_KEY and VITE_SUPABASE_STORAGE_BUCKET

## How to use
1. Create Storage bucket `wardrobe-images` in Supabase Storage (public recommended for easy previews).
2. Add `VITE_OPENAI_KEY` to your .env if you want AI recommendations (OpenAI account required).
3. Place <AIRecommender/> component in your app (e.g., in HomePage or a route) to use it.
   Example import:
     import AIRecommender from './components/AIRecommender';
     ...
     <AIRecommender />

## Upload integration
- Use `uploadImage(file)` to get a public URL, then send that URL to your existing wardrobeAPI.addItem payload as `image_url`.

## Deploying DB changes
- Run the SQL files in `supabase/migrations/` using Supabase SQL editor.

## Notes
- The OpenAI wrapper uses the chat completions endpoint and expects the API key in `VITE_OPENAI_KEY`.
- The AI output parsing may vary; the component includes a best-effort parse.
