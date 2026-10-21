import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveOrderItem } from '../services/orderPricing.js';

const product = {
  _id: 'product-1',
  name: 'MENSTYLE shirt',
  price: 450000,
  images: ['shirt.jpg'],
  isActive: true
};

const input = {
  productId: 'product-1',
  name: 'Forged name',
  selectedSize: 'M',
  selectedColor: 'Black',
  price: 1,
  quantity: 2,
  image: 'forged.jpg'
};

test('order line uses catalog identity, price, and image instead of client values', () => {
  const resolved = resolveOrderItem({
    input,
    product,
    variant: {
      _id: 'variant-1',
      productId: 'product-1',
      size: 'M',
      color: { name: 'Black' },
      price: 475000,
      image: 'variant.jpg',
      isActive: true
    },
    productHasVariants: true
  });

  assert.equal(resolved.name, 'MENSTYLE shirt');
  assert.equal(resolved.price, 475000);
  assert.equal(resolved.image, 'variant.jpg');
  assert.equal(resolved.quantity, 2);
});

test('rejects a variant that belongs to another product', () => {
  assert.throws(
    () => resolveOrderItem({
      input: { ...input, variantId: 'variant-1' },
      product,
      variant: { _id: 'variant-1', productId: 'other-product', size: 'M', color: { name: 'Black' }, price: 1 },
      productHasVariants: true
    }),
    { statusCode: 400 }
  );
});

test('rejects missing variants when the product tracks variant inventory', () => {
  assert.throws(
    () => resolveOrderItem({ input, product, variant: null, productHasVariants: true }),
    { statusCode: 409 }
  );
});
