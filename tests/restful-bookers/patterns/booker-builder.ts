interface Warranty {
    years: number;
    type: string;
    coverage: string[];
}

interface Review {
    id: number;
    rating: number;
    comment: string;
    reviewer: string;
    reviewerEmail: string;
    date: string;
    verified: boolean;
    helpful: number;
}

interface Specifications {
    processor: string;
    memory: string;
    storage: string;
    display: string;
    camera: string;
    battery: string;
    os: string;
    connectivity: string[];
}

interface Pricing {
    original: number;
    current: number;
    discount: number;
    currency: string;
    tax: number;
}

interface Inventory {
    stock: number;
    reserved: number;
    available: number;
    reorderLevel: number;
    supplier: string;
    nextDelivery: string;
}

interface ShippingDimensions {
    length: number;
    width: number;
    height: number;
}

interface Shipping {
    weight: number;
    dimensions: ShippingDimensions;
    freeShipping: boolean;
    estimatedDays: number;
    shippingMethods: string[];
}

interface Seo {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
}

interface Analytics {
    views: number;
    purchases: number;
    conversionRate: number;
    averageRating: number;
    totalReviews: number;
}

interface Product {
    id?: number;
    name?: string;
    isAvailable?: boolean;
    price?: number;
    priceFloat?: number;
    description?: string;
    manufacturer?: string | null;
    warranty?: Warranty;
    createdAt?: string;
    updatedAt?: string;
    tags?: string[];
    reviews?: Review[];
    specifications?: Specifications;
    categories?: string[];
    pricing?: Pricing;
    inventory?: Inventory;
    shipping?: Shipping;
    seo?: Seo;
    analytics?: Analytics;
}

export class ProductBuilder {
    private data: Product;

    constructor() {
        this.data = {};
    }

    withId(id: number) {
        this.data.id = id;
        return this;
    }
    withName(name: string){
        this.data.name = name;
        return this;
    }

    withAvailability(isAvailable: boolean) {
        this.data.isAvailable = isAvailable;
        return this;
    }
    withPrice(price: number) {
        this.data.price = price;
        this.data.priceFloat = parseFloat(price.toFixed(2));
        return this;
    }
    withDescription(description: string) {
        this.data.description = description;
        return this;
    }
    withManufacturer(manufacturer: string | null) {
        this.data.manufacturer = manufacturer;
        return this;
    }
    withWarranty(warranty: Warranty) {
        this.data.warranty = warranty;
        return this;
    }
    withCreatedAt(createdAt: string) {
        this.data.createdAt = createdAt;
        return this;
    }       
    withUpdatedAt(updatedAt: string) {
        this.data.updatedAt = updatedAt;
        return this;
    }
    withTags(tags: string[]) {
        this.data.tags = tags;
        return this;
    }           
    withReviews(reviews: Review[]) {
        this.data.reviews = reviews;
        return this;
    }
    withSpecifications(specifications: Specifications) {
        this.data.specifications = specifications;
        return this;
    }
    withCategories(categories: string[]) {
        this.data.categories = categories;
        return this;
    }
    withPricing(pricing: Pricing) {
        this.data.pricing = pricing;
        return this;
    }
    withInventory(inventory: Inventory) {
        this.data.inventory = inventory;
        return this;
    }
    withShipping(shipping: Shipping) {
        this.data.shipping = shipping;
        return this;
    }
    withSeo(seo: Seo) {
        this.data.seo = seo;
        return this;
    }
    withAnalytics(analytics: Analytics) {
        this.data.analytics = analytics;
        return this;
    }

    build() {
        return this.data;
    }
}


