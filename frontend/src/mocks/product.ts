import { Brand } from '@/types/brand.types';
import { Category } from '@/types/Category.types';
import { ProductSupplier, StockMovement } from '@/types/product.types';

export const PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Premium Wireless Headphones',
    image: {
      url: 'https://res.cloudinary.com/dcoqpsz6e/image/upload/v1783296603/owsauvbpvo8k6g4nyo90.jpg',
      public_id: '8k6g4nyo90',
    },
    barcode: '8945001234567',
    sku: 'WH-001',
    category: {
      id: 'cat-001',
      name: 'Electronics',
      slug: 'electronics',
    },
    brand: {
      id: 'brand-001',
      name: 'SoundMax',
      slug: 'sound-max',
    },
    description:
      'Premium wireless headphones with active noise cancellation and high-quality stereo sound.',
    price: 5490,
    sellingPrice: 6990,
    stock: 42,
    minimumStockLevel: 10,

    createdAt: '2026-08-01T10:15:00.000Z',
    updatedAt: '2026-09-13T18:42:31.000Z',
  },

  {
    id: 'prod-002',
    name: 'Smart LED Desk Lamp',
    image: {
      url: 'https://res.cloudinary.com/dcoqpsz6e/image/upload/v1783296603/owsauvbpvo8k6g4nyo90.jpg',
      public_id: 'smart-led-desk-lamp',
    },
    barcode: '8945001234568',
    sku: 'SL-002',
    category: {
      id: 'cat-002',
      name: 'Home & Office',
      slug: 'home-office',
    },
    brand: {
      id: 'brand-002',
      name: 'Lumina',
      slug: 'lumina',
    },
    description:
      'Modern smart LED desk lamp with adjustable brightness and multiple lighting modes.',
    price: 2890,
    sellingPrice: 3790,
    stock: 18,
    minimumStockLevel: 8,

    createdAt: '2026-08-03T11:20:00.000Z',
    updatedAt: '2026-09-13T18:42:31.000Z',
  },

  {
    id: 'prod-003',
    name: 'Mechanical Gaming Keyboard',
    image: {
      url: 'https://res.cloudinary.com/dcoqpsz6e/image/upload/v1783296603/owsauvbpvo8k6g4nyo90.jpg',
      public_id: 'mechanical-gaming-keyboard',
    },
    barcode: '8945001234569',
    sku: 'GK-003',
    category: {
      id: 'cat-003',
      name: 'Gaming',
      slug: 'gaming',
    },
    brand: {
      id: 'brand-003',
      name: 'KeyForge',
      slug: 'key-forge',
    },
    description:
      'RGB mechanical gaming keyboard featuring tactile switches and a durable aluminum frame.',
    price: 4250,
    sellingPrice: 5490,
    stock: 7,
    minimumStockLevel: 10,

    createdAt: '2026-08-05T09:45:00.000Z',
    updatedAt: '2026-09-13T18:42:31.000Z',
  },

  {
    id: 'prod-004',
    name: 'Portable Bluetooth Speaker',
    image: {
      url: 'https://res.cloudinary.com/dcoqpsz6e/image/upload/v1783296603/owsauvbpvo8k6g4nyo90.jpg',
      public_id: 'portable-bluetooth-speaker',
    },
    barcode: '8945001234570',
    sku: 'BS-004',
    category: {
      id: 'cat-001',
      name: 'Electronics',
      slug: 'electronics',
    },
    brand: {
      id: 'brand-004',
      name: 'BeatBox',
      slug: 'beat-box',
    },
    description:
      'Compact portable Bluetooth speaker with powerful bass, long battery life, and waterproof design.',
    price: 3190,
    sellingPrice: 4290,
    stock: 31,
    minimumStockLevel: 10,

    createdAt: '2026-08-08T14:10:00.000Z',
    updatedAt: '2026-09-13T18:42:31.000Z',
  },

  {
    id: 'prod-005',
    name: 'Ergonomic Office Chair',
    image: {
      url: 'https://res.cloudinary.com/dcoqpsz6e/image/upload/v1783296603/owsauvbpvo8k6g4nyo90.jpg',
      public_id: 'ergonomic-office-chair',
    },
    barcode: '8945001234571',
    sku: 'OC-005',
    category: {
      id: 'cat-004',
      name: 'Furniture',
      slug: 'furniture',
    },
    brand: {
      id: 'brand-005',
      name: 'ComfortPro',
      slug: 'comfort-pro',
    },
    description:
      'Ergonomic office chair with adjustable lumbar support, armrests, and breathable mesh back.',
    price: 12500,
    sellingPrice: 15900,
    stock: 12,
    minimumStockLevel: 5,

    createdAt: '2026-08-12T10:30:00.000Z',
    updatedAt: '2026-09-13T18:42:31.000Z',
  },

  {
    id: 'prod-006',
    name: 'USB-C Fast Charging Adapter',
    image: {
      url: 'https://res.cloudinary.com/dcoqpsz6e/image/upload/v1783296603/owsauvbpvo8k6g4nyo90.jpg',
      public_id: 'usb-c-fast-charging-adapter',
    },
    barcode: '8945001234572',
    sku: 'CA-006',
    category: {
      id: 'cat-005',
      name: 'Accessories',
      slug: 'accessories',
    },
    brand: {
      id: 'brand-006',
      name: 'VoltEdge',
      slug: 'volt-edge',
    },
    description:
      'Compact USB-C fast charging adapter with intelligent power delivery and multiple safety protections.',
    price: 1490,
    sellingPrice: 1990,
    stock: 4,
    minimumStockLevel: 10,

    createdAt: '2026-08-15T13:25:00.000Z',
    updatedAt: '2026-09-13T18:42:31.000Z',
  },

  {
    id: 'prod-007',
    name: 'Wireless Gaming Mouse',
    image: {
      url: 'https://res.cloudinary.com/dcoqpsz6e/image/upload/v1783296603/owsauvbpvo8k6g4nyo90.jpg',
      public_id: 'wireless-gaming-mouse',
    },
    barcode: '8945001234573',
    sku: 'GM-007',
    category: {
      id: 'cat-006',
      name: 'Computer Accessories',
      slug: 'computer-accessories',
    },
    brand: {
      id: 'brand-007',
      name: 'GamePro',
      slug: 'game-pro',
    },
    description:
      'Ergonomic wireless gaming mouse with adjustable DPI, RGB lighting, and responsive optical tracking.',
    price: 2250,
    sellingPrice: 2990,
    stock: 15,
    minimumStockLevel: 5,

    createdAt: '2026-08-15T09:45:00.000Z',
    updatedAt: '2026-09-15T16:20:00.000Z',
  },

  {
    id: 'prod-008',
    name: 'USB-C Fast Charger',
    image: {
      url: 'https://res.cloudinary.com/dcoqpsz6e/image/upload/v1783296603/owsauvbpvo8k6g4nyo90.jpg',
      public_id: 'usb-c-fast-charger',
    },
    barcode: '8945001234574',
    sku: 'FC-008',
    category: {
      id: 'cat-007',
      name: 'Mobile Accessories',
      slug: 'mobile-accessories',
    },
    brand: {
      id: 'brand-008',
      name: 'PowerMax',
      slug: 'power-max',
    },
    description:
      'Compact 33W USB-C fast charger with intelligent power delivery and multiple safety protections.',
    price: 950,
    sellingPrice: 1290,
    stock: 48,
    minimumStockLevel: 15,

    createdAt: '2026-08-20T13:15:00.000Z',
    updatedAt: '2026-09-16T11:05:00.000Z',
  },

  {
    id: 'prod-009',
    name: 'Mechanical Keyboard',
    image: {
      url: 'https://res.cloudinary.com/dcoqpsz6e/image/upload/v1783296603/owsauvbpvo8k6g4nyo90.jpg',
      public_id: 'mechanical-keyboard',
    },
    barcode: '8945001234575',
    sku: 'MK-009',
    category: {
      id: 'cat-006',
      name: 'Computer Accessories',
      slug: 'computer-accessories',
    },
    brand: {
      id: 'brand-009',
      name: 'KeyMaster',
      slug: 'key-master',
    },
    description:
      'Premium mechanical keyboard with tactile switches, RGB backlight, and durable aluminum frame.',
    price: 4850,
    sellingPrice: 5990,
    stock: 7,
    minimumStockLevel: 10,

    createdAt: '2026-08-25T15:30:00.000Z',
    updatedAt: '2026-09-17T14:40:00.000Z',
  },

  {
    id: 'prod-010',
    name: 'Smart Fitness Watch',
    image: {
      url: 'https://res.cloudinary.com/dcoqpsz6e/image/upload/v1783296603/owsauvbpvo8k6g4nyo90.jpg',
      public_id: 'smart-fitness-watch',
    },
    barcode: '8945001234576',
    sku: 'FW-010',
    category: {
      id: 'cat-001',
      name: 'Electronics',
      slug: 'electronics',
    },
    brand: {
      id: 'brand-010',
      name: 'FitPulse',
      slug: 'fit-pulse',
    },
    description:
      'Smart fitness watch with heart-rate tracking, sleep monitoring, activity tracking, and notification support.',
    price: 3990,
    sellingPrice: 4990,
    stock: 21,
    minimumStockLevel: 8,
    createdAt: '2026-08-28T10:10:00.000Z',
    updatedAt: '2026-09-18T12:25:00.000Z',
  },
];

export const stockMovements: StockMovement[] = [
  {
    id: 'movement-0006',
    productId: 'product-001',
    type: 'STOCK_IN',
    beforeStock: 70,
    afterStock: 80,
    reason: 'Physical stock count',
    createdAt: '2026-09-14T11:30:00.000Z',
  },
  {
    id: 'movement-0008',
    productId: 'product-001',
    type: 'STOCK_OUT',
    beforeStock: 80,
    afterStock: 75,
    reason: 'Damaged items found during stock check',
    createdAt: '2026-09-14T12:00:00.000Z',
  },
  {
    id: 'movement-001',
    productId: 'product-001',
    type: 'PURCHASE',
    beforeStock: 20,
    afterStock: 70,
    createdAt: '2026-09-04T10:30:00.000Z',
  },
  {
    id: 'movement-002',
    productId: 'product-001',
    type: 'SALE',
    beforeStock: 70,
    afterStock: 60,
    createdAt: '2026-09-05T14:20:00.000Z',
  },
  {
    id: 'movement-003',
    productId: 'product-001',
    type: 'DAMAGE',
    beforeStock: 60,
    afterStock: 57,
    createdAt: '2026-09-06T09:15:00.000Z',
  },
];

export const brands: Brand[] = [
  {
    id: 'brand-001',
    name: 'SoundMax',
    slug: 'sound-max',

    createdAt: '2026-08-01T10:30:00.000Z',
    updatedAt: '2026-08-01T10:30:00.000Z',
  },
  {
    id: 'brand-002',
    name: 'Lumina',
    slug: 'lumina',

    createdAt: '2026-08-02T12:00:00.000Z',
    updatedAt: '2026-08-02T12:00:00.000Z',
  },
  {
    id: 'brand-003',
    name: 'KeyForge',
    slug: 'key-forge',

    createdAt: '2026-08-03T13:15:00.000Z',
    updatedAt: '2026-08-03T13:15:00.000Z',
  },
  {
    id: 'brand-004',
    name: 'BeatBox',
    slug: 'beat-box',

    createdAt: '2026-08-04T15:30:00.000Z',
    updatedAt: '2026-08-04T15:30:00.000Z',
  },
  {
    id: 'brand-005',
    name: 'ComfortPro',
    slug: 'comfort-pro',

    createdAt: '2026-08-05T17:00:00.000Z',
    updatedAt: '2026-08-05T17:00:00.000Z',
  },
  {
    id: 'brand-006',
    name: 'VoltEdge',
    slug: 'volt-edge',

    createdAt: '2026-08-06T10:20:00.000Z',
    updatedAt: '2026-08-06T10:20:00.000Z',
  },
  {
    id: 'brand-007',
    name: 'GamePro',
    slug: 'game-pro',

    createdAt: '2026-08-07T11:40:00.000Z',
    updatedAt: '2026-08-07T11:40:00.000Z',
  },
  {
    id: 'brand-008',
    name: 'PowerMax',
    slug: 'power-max',

    createdAt: '2026-08-08T14:10:00.000Z',
    updatedAt: '2026-08-08T14:10:00.000Z',
  },
];

export const categories: Category[] = [
  {
    id: 'cat-001',
    name: 'Electronics',
    slug: 'electronics',

    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'cat-002',
    name: 'Home & Office',
    slug: 'home-office',

    createdAt: '2026-08-02T11:30:00.000Z',
    updatedAt: '2026-08-02T11:30:00.000Z',
  },
  {
    id: 'cat-003',
    name: 'Gaming',
    slug: 'gaming',

    createdAt: '2026-08-03T09:15:00.000Z',
    updatedAt: '2026-08-03T09:15:00.000Z',
  },
  {
    id: 'cat-004',
    name: 'Furniture',
    slug: 'furniture',

    createdAt: '2026-08-04T14:20:00.000Z',
    updatedAt: '2026-08-04T14:20:00.000Z',
  },
  {
    id: 'cat-005',
    name: 'Accessories',
    slug: 'accessories',

    createdAt: '2026-08-05T16:45:00.000Z',
    updatedAt: '2026-08-05T16:45:00.000Z',
  },
  {
    id: 'cat-006',
    name: 'Computer Accessories',
    slug: 'computer-accessories',

    createdAt: '2026-08-06T12:10:00.000Z',
    updatedAt: '2026-08-06T12:10:00.000Z',
  },
  {
    id: 'cat-007',
    name: 'Mobile Accessories',
    slug: 'mobile-accessories',

    createdAt: '2026-08-07T13:30:00.000Z',
    updatedAt: '2026-08-07T13:30:00.000Z',
  },
];
export const productList = [
  {
    id: 'prod-001',
    name: 'Samsung Galaxy S24',
    stock: 42,
    price: 3200,
  },
  {
    id: 'prod-002',
    name: 'Apple iPhone 15',
    stock: 18,
    price: 4990,
  },
  {
    id: 'prod-003',
    name: 'Nike Air Max 270',
    stock: 7,
    price: 1990,
  },
  {
    id: 'prod-004',
    name: 'IKEA Office Chair',
    stock: 31,
    price: 12990,
  },
  {
    id: 'prod-005',
    name: 'Xiaomi Smart Watch',
    stock: 12,
    price: 1990,
  },
];

export const mockProductSupplier: ProductSupplier = {
  productId: 'prod_002',
  suppliers: [
    {
      id: 'supp_001',
      name: 'Mobile World Ltd',
      shopName: 'Mobile World',
      phone: '01910000001',
      email: 'supplier1@example.com',
      address: 'Bashundhara City, Dhaka',
    },
    {
      id: 'supp_002',
      name: 'Gadget Hub Bangladesh',
      shopName: 'Gadget Hub',
      phone: '01910000002',
      email: 'supplier2@example.com',
      address: 'Multiply Center, New Elephant Road, Dhaka',
    },
    {
      id: 'supp_003',
      name: 'Tech Valley Traders',
      shopName: 'Tech Valley',
      phone: '01910000003',
      email: 'supplier3@example.com',
      address: 'Jama Future Park, Dhaka',
    },
    {
      id: 'supp_004',
      name: 'Smart Zone Enterprise',
      shopName: 'Smart Zone',
      phone: '01910000004',
      email: 'supplier4@example.com',
      address: `Eastern Plaza, Harpoon, Dhaka`,
    },
  ],
};