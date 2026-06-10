// Run with: node src/seed.js
// Seeds the database with sample products
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  { name: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and exceptional sound quality. Perfect for work and travel.', price: 299.99, category: 'Electronics', brand: 'SoundPro', stock: 50, rating: 4.8, numReviews: 124, isFeatured: true, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { name: 'Smart Watch Pro', description: 'Feature-packed smartwatch with health monitoring, GPS, 5-day battery, and 50+ workout modes. Water resistant up to 50m.', price: 249.99, category: 'Electronics', brand: 'TechWear', stock: 35, rating: 4.6, numReviews: 89, isFeatured: true, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
  { name: 'Mechanical Gaming Keyboard', description: 'RGB backlit mechanical keyboard with Cherry MX switches, programmable macros, and dedicated media controls.', price: 129.99, category: 'Electronics', brand: 'GameGear', stock: 75, rating: 4.7, numReviews: 203, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400' },
  { name: 'Ultra Slim Laptop Stand', description: 'Adjustable aluminum laptop stand that elevates your screen for better ergonomics. Foldable and portable.', price: 49.99, category: 'Electronics', brand: 'DeskMate', stock: 120, rating: 4.5, numReviews: 67, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400' },
  { name: 'Premium Running Shoes', description: 'Lightweight performance running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole.', price: 119.99, category: 'Sports', brand: 'RunFast', stock: 60, rating: 4.7, numReviews: 156, isFeatured: true, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { name: 'Yoga Mat Premium', description: 'Extra thick non-slip yoga mat with alignment lines. Made from eco-friendly TPE material. Includes carrying strap.', price: 39.99, category: 'Sports', brand: 'ZenFit', stock: 90, rating: 4.6, numReviews: 78, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400' },
  { name: 'Classic Leather Jacket', description: 'Genuine leather jacket with quilted lining, multiple pockets, and YKK zippers. Available in black and brown.', price: 189.99, category: 'Clothing', brand: 'UrbanStyle', stock: 30, rating: 4.8, numReviews: 45, isFeatured: true, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
  { name: 'Casual Linen Shirt', description: 'Breathable 100% linen shirt perfect for summer. Relaxed fit with button-down collar. Machine washable.', price: 49.99, category: 'Clothing', brand: 'ComfortWear', stock: 85, rating: 4.4, numReviews: 32, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400' },
  { name: 'The Art of Clean Code', description: 'A comprehensive guide to writing maintainable, readable, and efficient code. Essential for every developer.', price: 34.99, category: 'Books', brand: 'TechBooks', stock: 200, rating: 4.9, numReviews: 312, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400' },
  { name: 'Design Thinking Handbook', description: 'Master the principles of design thinking to solve complex problems and drive innovation in your organization.', price: 29.99, category: 'Books', brand: 'DesignPress', stock: 150, rating: 4.7, numReviews: 89, image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400' },
  { name: 'Smart LED Desk Lamp', description: 'Touch-controlled desk lamp with USB charging port, adjustable color temperature, and 5 brightness levels. Eye-care mode included.', price: 59.99, category: 'Home', brand: 'BrightHome', stock: 65, rating: 4.5, numReviews: 134, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400' },
  { name: 'Bamboo Cutting Board Set', description: 'Set of 3 premium bamboo cutting boards in different sizes. Naturally antibacterial, eco-friendly, and dishwasher safe.', price: 44.99, category: 'Home', brand: 'EcoKitchen', stock: 100, rating: 4.6, numReviews: 56, isFeatured: true, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
