import fs from "fs";

async function fetchDeereApi() {
  const url = "https://www.deere.pt/service/productSearch/552208/WG_residential_lawn_mowers?pageSize=100&page=0";
  try {
    const res = await fetch(url);
    const json = await res.json();
    console.log("API response status:", res.status);
    console.log("Products count:", json.productData?.cards?.length);
    fs.writeFileSync("api_products.json", JSON.stringify(json, null, 2));
  } catch (error) {
    console.error("Error fetching API:", error);
  }
}

fetchDeereApi();
