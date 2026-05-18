import fs from "fs";
import * as cheerio from "cheerio";

function parse() {
  const html = fs.readFileSync("product_page.html", "utf-8");
  const $ = cheerio.load(html);
  
  const title = $('meta[property="og:title"]').attr('content');
  const description = $('meta[property="og:description"]').attr('content');
  const image = $('meta[property="og:image"]').attr('content');
  
  console.log("Title:", title);
  console.log("Description:", description);
  console.log("Image:", image);
}
parse();
