import fs from "fs";
import * as cheerio from "cheerio";

async function analyzeProduct() {
  const url = "https://www.deere.pt/pt-pt/produtos-solucoes/cortadores-de-relva/cortadores-de-relva-residenciais/x107-minitratores-corta-relva-mzexmurn";
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    fs.writeFileSync("prod_page.html", html);
    
    // Find specifications or features
    const specsComponent = $('[data-component="ProductSpecifications"]').attr('data-props');
    if (specsComponent) {
        console.log("Specs found!");
    } else {
        console.log("No Specs component");
    }

    const features = [];
    $('[data-component="Feature"]').each((i, el) => {
        const props = $(el).attr('data-props');
        if (props) {
            try {
                const pd = JSON.parse(props);
                features.push(pd.headline?.text);
            } catch(e){}
        }
    });
    console.log("Features:", features);
    
    // look for images
    const images = [];
    $('img').each((i, el) => {
        images.push($(el).attr('src'));
    });
    console.log("Images found:", images.filter(s => s && s.includes('deere.com/assets')).length);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

analyzeProduct();
