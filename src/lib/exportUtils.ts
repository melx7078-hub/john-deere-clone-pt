import Papa from 'papaparse';

export const exportToShopifyCSV = (products: any[]) => {
  const shopifyData = products.map((p) => ({
    Handle: p.sku.toLowerCase(),
    Title: p.title,
    'Body (HTML)': p.longDescription,
    Vendor: 'John Deere',
    Type: p.category,
    Tags: 'lawn mower, tractor, john deere',
    Published: 'TRUE',
    'Option1 Name': 'Title',
    'Option1 Value': 'Default Title',
    'Variant SKU': p.sku,
    'Variant Grams': 0,
    'Variant Inventory Tracker': 'shopify',
    'Variant Inventory Qty': 100,
    'Variant Inventory Policy': 'deny',
    'Variant Fulfillment Service': 'manual',
    'Variant Price': p.price,
    'Variant Compare At Price': p.price * 1.2,
    'Variant Requires Shipping': 'TRUE',
    'Variant Taxable': 'TRUE',
    'Image Src': p.image,
    'Image Position': 1,
    'Image Alt Text': p.title,
    'Gift Card': 'FALSE',
    'SEO Title': p.title,
    'SEO Description': p.shortDescription,
    'Google Shopping / Google Product Category': 'Home & Garden > Lawn & Garden > Outdoor Power Equipment > Lawn Mowers',
    'Google Shopping / Custom Product': 'TRUE',
    'Status': 'active'
  }));

  const csv = Papa.unparse(shopifyData);
  downloadCSV(csv, 'shopify_products_export.csv');
};

export const exportToGoogleMerchantCSV = (products: any[]) => {
  const googleData = products.map((p) => ({
    id: p.sku,
    title: p.title,
    description: p.longDescription,
    link: `https://www.deere.pt/pt-pt/produtos-e-solucoes/cortadores-de-relva/cortadores-de-relva-residenciais/${p.sku.toLowerCase()}`,
    image_link: p.image,
    availability: p.availability === 'In Stock' ? 'in stock' : 'out of stock',
    price: `${p.price} EUR`,
    condition: 'new',
    brand: 'John Deere',
    google_product_category: 'Home & Garden > Lawn & Garden > Outdoor Power Equipment > Lawn Mowers',
    item_group_id: p.category
  }));

  const csv = Papa.unparse(googleData);
  downloadCSV(csv, 'google_merchant_export.csv');
};

const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
