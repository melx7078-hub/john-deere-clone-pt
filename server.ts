import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";

// Load products from scraped JSON as fallback
const loadProductsFallback = () => {
  try {
    const data = fs.readFileSync(path.join(process.cwd(), "scraped_products.json"), "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading scraped products:", error);
    return [];
  }
};

const fallbackProducts = loadProductsFallback();

async function startServer() {
  const app = express();
  const PORT = 3000;

  let supabase: any = null;
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
     supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
     console.log("Supabase client initialized.");
  }

  app.get("/api/products", async (req, res) => {
    if (supabase) {
        try {
            const { data, error } = await supabase.from('products').select('*');
            if (error) throw error;
            
            // Map db columns back to camelCase for frontend if needed
            const mapped = data.map((p: any) => ({
                id: p.id,
                title: p.title,
                category: p.category,
                price: p.price,
                image: p.image,
                href: p.href,
                sku: p.sku,
                rating: p.rating,
                reviews: p.reviews,
                availability: p.availability,
                longDescription: p.long_description,
                shortDescription: p.short_description,
                features: p.features,
                images: p.images
            }));
            
            res.json(mapped);
            return;
        } catch(e) {
            console.error("Supabase API error, falling back to local JSON", e);
        }
    }
    
    res.json(fallbackProducts);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
