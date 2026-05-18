import fs from "fs";
import * as cheerio from "cheerio";

function parse() {
  const html = fs.readFileSync("prod_page.html", "utf-8");
  const $ = cheerio.load(html);
  
  const hrefs = [];
  $('a').each((i, el) => {
     let hr = $(el).attr('href');
     if (hr && hr.includes('specs') || hr?.includes('caracteristicas') || hr?.includes('pdf')) {
         hrefs.push(hr);
     }
  });

  console.log("Specs links:", hrefs);
}
parse();
