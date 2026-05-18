import fs from "fs";
import * as cheerio from "cheerio";

const CATEGORIES = [
  { url: "https://www.deere.pt/pt-pt/produtos-solucoes/cortadores-de-relva/cortadores-de-relva-residenciais", name: "Cortadores de relva residenciais" },
  { url: "https://www.deere.pt/pt-pt/produtos-solucoes/cortadores-de-relva/cortadores-de-relva-profissionais-com-raio-de-viragem-zero", name: "Raio de viragem zero" },
  { url: "https://www.deere.pt/pt-pt/produtos-solucoes/cortadores-de-relva/cortadores-de-relva-frontais-e-largos", name: "Cortadores frontais e largos" },
  { url: "https://www.deere.pt/pt-pt/produtos-solucoes/tratores/tratores-compactos", name: "Tratores compactos" },
  { url: "https://www.deere.pt/pt-pt/produtos-solucoes/tratores/tratores-medios", name: "Tratores médios" },
  { url: "https://www.deere.pt/pt-pt/produtos-solucoes/tratores/tratores-grandes", name: "Tratores grandes" },
  { url: "https://www.deere.pt/pt-pt/veiculos-multiusos-gator/veiculos-utilitarios-de-trabalho", name: "Veículos de trabalho" },
  { url: "https://www.deere.pt/pt-pt/veiculos-multiusos-gator/veiculos-multiusos-todo-o-terreno", name: "Veículos multiúsos" }
];

const BASE_URL = "https://www.deere.pt";

async function scrape() {
  const allProducts: any[] = [];
  let idCounter = 1;

  for (const cat of CATEGORIES) {
    console.log(`Fetching category: ${cat.name}`);
    try {
      const res = await fetch(cat.url);
      const html = await res.text();
      const $ = cheerio.load(html);
      
      const productListing = $('[data-component="ProductListing"]').first();
      if (!productListing.length) {
        console.log(`No ProductListing in ${cat.name}, trying standard links...`);
        // Maybe it's a different component type. Let's find standard product links.
        /* Not needed for Deere usually if they use the same CMS */
        continue;
      }
      
      const dataProps = productListing.attr('data-props');
      if (!dataProps) continue;
      
      const props = JSON.parse(dataProps);
      const cards = props.productData?.cards || [];
      console.log(`Found ${cards.length} products in ${cat.name}`);
      
      for (const card of cards) {
        const title = card.textSettings?.headline?.text || card.baseCode;
        if (!title) continue;
        const subTitle = card.textSettings?.subHeadline?.text || "";
        const href = card.href;
        if (!href) continue;
        
        let imageUrl = "";
        try {
            const bps = card.image?.breakpoints || [];
            for (const bp of bps) {
                if (bp.name === 'md' && bp.urls?.length) {
                    imageUrl = bp.urls[0].url;
                    break;
                }
            }
            if (!imageUrl && bps.length && bps[0].urls?.length) {
                imageUrl = bps[0].urls[0].url;
            }
        } catch(e) {}
        
        if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = BASE_URL + imageUrl;
        }
        
        let priceAmount = card.price?.amount ? parseFloat(card.price.amount) : null;
        if (!priceAmount) {
             // Fake price generation based on category roughly
             if (cat.name.includes("Tratores grandes")) priceAmount = 150000;
             else if (cat.name.includes("Tratores")) priceAmount = 35000;
             else if (cat.name.includes("zero")) priceAmount = 6500;
             else priceAmount = 3000 + Math.floor(Math.random()*1500);
        }

        allProducts.push({
            id: `jd-${idCounter++}`,
            title: `${title} ${subTitle}`.trim(),
            category: cat.name,
            price: priceAmount,
            image: imageUrl,
            href: href.startsWith('http') ? href : BASE_URL + href,
            sku: card.baseCode || `SKU-${Math.floor(Math.random()*10000)}`,
            rating: parseFloat(((Math.random() * 1.0) + 4.0).toFixed(1)), // Keep it 4.0 - 5.0
            reviews: Math.floor(Math.random() * 100) + 5,
            availability: "In Stock"
        });
      }
    } catch (e: any) {
      console.error(`Error processing ${cat.name}:`, e.message);
    }
  }

  console.log(`\nFetching details for ${allProducts.length} products...`);
  
  for (let i = 0; i < allProducts.length; i++) {
     const p = allProducts[i];
     if (!p.href) continue;
     try {
         const res = await fetch(p.href);
         const html = await res.text();
         const $ = cheerio.load(html);
         
         const metaDesc = $('meta[property="og:description"]').attr('content');
         p.longDescription = metaDesc || `O ${p.title} possui desempenho lendário e qualidade superior da John Deere.`;
         p.shortDescription = p.longDescription.substring(0, 120) + (p.longDescription.length > 120 ? '...' : '');

         // Fetch features
         const features: any[] = [];
         let images = [p.image];

         $('[data-component="CardRow"]').each((_, el) => {
            const propsStr = $(el).attr('data-props');
            if (propsStr) {
              try {
                const props = JSON.parse(propsStr);
                if (props.cards) {
                    props.cards.forEach((c:any) => {
                        let fTitle = c.textSettings?.headline?.text;
                        let fDesc = c.textSettings?.detailTextPlain;
                        let fImg = c.image?.breakpoints?.[0]?.urls?.[0]?.url;
                        if (fTitle || fDesc) {
                            if (fImg && !fImg.startsWith('http')) fImg = BASE_URL + fImg;
                            features.push({ title: fTitle, description: fDesc, image: fImg });
                            if (fImg && !images.includes(fImg)) {
                                images.push(fImg);
                            }
                        }
                    });
                }
              } catch(e){}
            }
         });
         
         // fallback if no features found
         if (features.length === 0) {
             features.push({
                 title: "Desempenho John Deere",
                 description: "Fabricado para garantir durabilidade e conforto.",
                 image: p.image
             });
         }
         
         p.features = features;
         p.images = images.filter(Boolean); // keep valid images
         
     } catch(e) {
         p.longDescription = `Excelente ${p.title}`;
         p.shortDescription = `O ${p.title} é uma máquina de qualidade incrível.`;
         p.features = [{ title: "Pronto a trabalhar", description: p.shortDescription }];
         p.images = [p.image];
     }
     
     if ((i+1) % 5 === 0) console.log(`${i+1}/${allProducts.length} fetched.`);
     
     await new Promise(r => setTimeout(r, 200));
  }

  fs.writeFileSync("scraped_products.json", JSON.stringify(allProducts, null, 2));
  console.log("Saved scraped_products.json!");
  console.log("Total scraped:", allProducts.length);
}

scrape();
