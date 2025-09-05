import { faker } from "@faker-js/faker";

export class ProductFactory {
  static createWarranty() {
    return {
      years: faker.number.int({ min: 1, max: 5 }),
      type: faker.helpers.arrayElement(["standard", "limited", "premium"]),
      coverage: faker.helpers.arrayElements(
        ["hardware", "software", "battery"],
        { min: 1, max: 3 }
      ),
    };
  }

  static createReviews() {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentence(),
      reviewer: faker.person.fullName(),
      reviewerEmail: faker.internet.email(),
      date: faker.date.past(),
      verified: faker.datatype.boolean(),
      helpful: faker.number.int({ min: 0, max: 50 }),
    };
  }

  static createSpecifications() {
    return {
      processor: faker.commerce.productMaterial(),
      memory: faker.number.int({ min: 4, max: 64 }) + "GB RAM",
      storage: faker.number.int({ min: 128, max: 2048 }) + "GB SSD",
      display: faker.number.int({ min: 11, max: 17 }) + '" Full HD',
      camera: faker.number.int({ min: 8, max: 108 }) + "MP",
      battery: faker.number.int({ min: 2000, max: 6000 }) + "mAh",
      os: faker.helpers.arrayElement(["Windows", "Android", "iOS", "Linux"]),
      connectivity: faker.helpers.arrayElements(
        ["WiFi", "Bluetooth", "5G", "WiFi 6E", "Bluetooth 5.3", "NFC"],
        { min: 2, max: 4 }
      ),
    };
  }

  static createPricing() {
    return {
      original: faker.number.int({ min: 5000, max: 15000 }),
      current: faker.number.int({ min: 4000, max: 10000 }),
      discount: faker.number.int({ min: 5, max: 50 }),
      currency: faker.finance.currencyCode(),
      tax: faker.number.float({ min: 5, max: 25 }),
    };
  }

  static createInventory() {
    return {
      stock: faker.number.int({ min: 0, max: 1000 }),
      reserved: faker.number.int({ min: 0, max: 200 }),
      available: faker.number.int({ min: 0, max: 800 }),
      reorderLevel: faker.number.int({ min: 10, max: 100 }),
      supplier: faker.company.name(),
      nextDelivery: faker.date.future(),
    };
  }

  static createShippingDimensions() {
    return {
      length: faker.number.int({ min: 10, max: 50 }),
      width: faker.number.int({ min: 10, max: 40 }),
      height: faker.number.int({ min: 1, max: 20 }),
    };
  }

  static createShipping() {
    return {
      weight: faker.number.float({ min: 0, max: 25 }),
      dimensions: this.createShippingDimensions(),
      freeShipping: faker.datatype.boolean(),
      estimatedDays: faker.number.int({ min: 1, max: 14 }),
      shippingMethods: faker.helpers.arrayElements(
        ["standard", "express", "overnight", "next day"],
        { min: 1, max: 3 }
      ),
    };
  }

  static createSeo() {
    return {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      keywords: faker.helpers.arrayElements(
        ["smartphone", "5G", "premium", "camera", "android"],
        { min: 2, max: 5 }
      ),
      slug: faker.lorem.slug(),
    };
  }

  static createAnalytics() {
    return {
      views: faker.number.int({ min: 100, max: 100_000 }),
      purchases: faker.number.int({ min: 1, max: 10_000 }),
      conversionRate: faker.number.float({
        min: 0,
        max: 100,
      }),
      averageRating: faker.number.float({ min: 1, max: 5 }),
      totalReviews: faker.number.int({ min: 0, max: 1000 }),
    };
  }

  static createProductWithValidData() {
    return {
      id: faker.number.int({ min: 0, max: 1000 }),
      name: faker.commerce.productName(),
      isAvailable: faker.datatype.boolean(),
      price: faker.number.int({ min: 100, max: 100_000 }),
      priceFloat: faker.number.float({
        min: 100,
        max: 100_000,
      }),
      description: faker.commerce.productDescription(),
      manufacturer: null,
      warranty: this.createWarranty(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      tags: faker.helpers.arrayElements(
        ["electronics", "mobile", "smartphone", "5G", "premium"],
        { min: 2, max: 4 }
      ),
      reviews: this.createReviews(),
      specifications: this.createSpecifications(),
      categories: faker.helpers.arrayElements(
        ["electronics", "smartphones", "premium"],
        { min: 2, max: 3 }
      ),
      pricing: this.createPricing(),
      inventory: this.createInventory(),
      shipping: this.createShipping(),
      seo: this.createSeo(),
      analytics: this.createAnalytics(),
    };
  }
}
