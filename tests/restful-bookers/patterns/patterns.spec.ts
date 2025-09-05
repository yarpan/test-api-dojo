import { test, expect } from "@playwright/test";
import { ProductBuilder } from "./booker-builder";
import { ProductFactory } from "./booker-factory";

test("create product with fabric", async () => {
  const product = ProductFactory.createProductWithValidData();

  console.log(product);
  expect(product.price).toBeGreaterThan(0);
});

test("create product with fabric and builder", async () => {
  const product2 = new ProductBuilder()
    .withId(999)
    .withName("Test Product")
    .withAvailability(true)
    .withPrice(5999)
    .withDescription("decription")
    .withWarranty(ProductFactory.createWarranty())
    .withCreatedAt(new Date().toISOString())
    .withSpecifications(ProductFactory.createSpecifications())
    .build();

  console.log(product2);
  expect(product2.name).toBe("Test Product");
  expect(product2.price).toBe(5999);
});
