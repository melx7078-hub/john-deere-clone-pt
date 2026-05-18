import fs from "fs";

async function analyze() {
  const url = "https://www.deere.pt/pt-pt/produtos-e-solucoes/cortadores-de-relva/cortadores-de-relva-residenciais/";
  try {
    const res = await fetch(url);
    const html = await res.text();
    fs.writeFileSync("deere_page.html", html);
    console.log("Saved HTML. Length:", html.length);
    
    // Check for common signs of data
    const apiRegex = /https?:\/\/[\w.-]+\/api\/[\w./-]+/g;
    const apis = html.match(apiRegex);
    if (apis) {
      console.log("Found APIs:", [...new Set(apis)]);
    } else {
      console.log("No obvious APIs found.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

analyze();
