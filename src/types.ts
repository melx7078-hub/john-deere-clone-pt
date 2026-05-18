export interface Product {
    id: string;
    title: string;
    shortDescription: string;
    longDescription?: string;
    category: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    images?: string[];
    sku: string;
    features?: {
        title: string;
        description: string;
        image?: string;
    }[];
}
