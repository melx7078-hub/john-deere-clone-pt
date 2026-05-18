import "dotenv/config";
import { Client } from "pg";
import fs from "fs";

async function seed() {
  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) {
    console.error("SUPABASE_DB_URL is missing! Please configure it in the .env file.");
    process.exit(1);
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log("Connected to Supabase Postgres.");

    // Create table
    await client.query(`
      DROP TABLE IF EXISTS products;
      CREATE TABLE products (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT,
        price NUMERIC,
        image TEXT,
        href TEXT,
        sku TEXT,
        rating NUMERIC,
        reviews INTEGER,
        availability TEXT,
        long_description TEXT,
        short_description TEXT,
        features JSONB,
        images JSONB
      );
    `);
    console.log("Created products table.");

    // Read scraped data
    const data = JSON.parse(fs.readFileSync("scraped_products.json", "utf8"));
    
    // Insert products
    for (const p of data) {
      await client.query(
        `INSERT INTO products (
          id, title, category, price, image, href, sku, rating, reviews, availability, long_description, short_description, features, images
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          p.id,
          p.title,
          p.category,
          p.price,
          p.image,
          p.href,
          p.sku,
          p.rating,
          p.reviews,
          p.availability,
          p.longDescription,
          p.shortDescription,
          JSON.stringify(p.features || []),
          JSON.stringify(p.images || [])
        ]
      );
    }
    
    console.log(`Successfully seeded ${data.length} products to Supabase.`);

  } catch (err) {
    console.error("Database Error:", err);
  } finally {
    await client.end();
  }
}

seed();
