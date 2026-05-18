import fs from "fs";
import * as cheerio from "cheerio";

function parse() {
  const html = fs.readFileSync("product_page.html", "utf-8");
  const $ = cheerio.load(html);
  
  // Try to find the title, subtitle, description, tech specs
  
  // Title might be in an h1 or Hero component
  let title = $('h1').text().trim();
  console.log("H1:", title);
  
  // The descriptions might be in specific components
  const features = [];
  $('[data-component="Feature"]').each((i, el) => {
     let props = $(el).attr('data-props');
     if (props) {
       try {
         const json = JSON.parse(props);
         if (json.headline?.text) {
             features.push(json.headline.text);
         }
       } catch(e) {}
     }
  });
  console.log("Features:", features);
  
  // Or look at ProductDetail component?
  const hero = $('[data-component="ProductHero"]').attr('data-props');
  if (hero) {
      try {
         console.log("Hero headline:", JSON.parse(hero).headline?.text);
         console.log("Hero description:", JSON.parse(hero).description);
      } catch(e){}
  }
}

parse();
