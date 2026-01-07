// Product catalog data
export const products = [
  // Electronics
  {
    id: 1,
    name: 'Wireless Earbuds',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'High-quality sound with noise cancellation.',
    category: 'electronics',
    onSale: true,
    salePrice: 39.99,
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Track health metrics and receive notifications.',
    category: 'electronics',
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1529359744902-86b2ab9edaea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Ymx1ZXRvb3RoJTIwc3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D',
    description: 'Portable speaker with rich bass and clear sound.',
    category: 'electronics',
  },
  {
    id: 4,
    name: '4K Action Camera',
    price: 199.99,
    image: 'https://plus.unsplash.com/premium_photo-1710409625297-2ca61f4ea5b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8NEslMjBBY3Rpb24lMjBDYW1lcmF8ZW58MHx8MHx8fDA%3D',
    description: 'Capture your adventures in stunning 4K resolution.',
    category: 'electronics',
  },

  // Fashion
  {
    id: 5,
    name: 'Classic White Sneakers',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1636262900147-fb56689b61c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fENsYXNzaWMlMjBXaGl0ZSUyMFNuZWFrZXJzfGVufDB8fDB8fHww',
    description: 'Versatile white sneakers for any outfit.',
    category: 'fashion',
  },
  {
    id: 6,
    name: 'Denim Jacket',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Classic denim jacket for all seasons.',
    category: 'fashion',
    onSale: true,
    salePrice: 59.99,
  },
  {
    id: 7,
    name: 'Leather Crossbody Bag',
    price: 69.99,
    image: 'https://plus.unsplash.com/premium_photo-1723826751056-6523b0b7c47c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fExlYXRoZXIlMjBDcm9zc2JvZHklMjBCYWd8ZW58MHx8MHx8fDA%3D',
    description: 'Stylish crossbody bag with multiple compartments.',
    category: 'fashion',
  },
  {
    id: 8,
    name: 'Aviator Sunglasses',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Classic aviator style with UV protection.',
    category: 'fashion',
  },

  // Home
  {
    id: 9,
    name: 'Coffee Maker',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1686961767668-391378d0a33b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Programmable coffee maker for perfect brews.',
    category: 'home',
  },
  {
    id: 10,
    name: 'Throw Blanket',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=500',
    description: 'Soft and cozy blanket for your living room.',
    category: 'home',
  },
  {
    id: 11,
    name: 'Scented Candle Set',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Set of 3 scented candles for relaxation.',
    category: 'home',
    onSale: true,
    salePrice: 17.99,
  },
  {
    id: 12,
    name: 'Modern Wall Clock',
    price: 42.99,
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Sleek wall clock for contemporary homes.',
    category: 'home',
  },

  // Beauty
  {
    id: 13,
    name: 'Skincare Set',
    price: 59.99,
    image: 'https://plus.unsplash.com/premium_photo-1673726818986-6cd3803581e3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U2tpbmNhcmUlMjBTZXR8ZW58MHx8MHx8fDA%3D',
    description: 'Complete skincare routine in one package.',
    category: 'beauty',
  },
  {
    id: 14,
    name: 'Hair Styling Tools',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1769&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Professional styling kit for salon-quality results.',
    category: 'beauty',
    onSale: true,
    salePrice: 89.99,
  },
  {
    id: 15,
    name: 'Makeup Palette',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1594903696739-2551e8c2d0f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fE1ha2V1cCUyMFBhbGV0dGV8ZW58MHx8MHx8fDA%3D',
    description: 'Versatile eyeshadow palette with 18 colors.',
    category: 'beauty',
  },
  {
    id: 16,
    name: 'Perfume Collection',
    price: 84.99,
    image: 'https://plus.unsplash.com/premium_photo-1739831741770-008b9a494e32?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fFBlcmZ1bWUlMjBDb2xsZWN0aW9ufGVufDB8fDB8fHww',
    description: 'Set of 3 signature scents for any occasion.',
    category: 'beauty',
  },

  // Sports
  {
    id: 17,
    name: 'Yoga Mat',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=1950&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Non-slip yoga mat for your workout routine.',
    category: 'sports',
    onSale: true,
    salePrice: 24.99,
  },
  {
    id: 18,
    name: 'Fitness Tracker',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Rml0bmVzcyUyMFRyYWNrZXJ8ZW58MHx8MHx8fDA%3D',
    description: 'Monitor your activity and health metrics.',
    category: 'sports',
  },
  {
    id: 19,
    name: 'Resistance Bands',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1532435109783-fdb8a2be0baa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Rml0bmVzcyUyMFRyYWNrZXJ8ZW58MHx8MHx8fDA%3D',
    description: 'Set of 5 bands for strength training.',
    category: 'sports',
  },
  {
    id: 20,
    name: 'Water Bottle',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8V2F0ZXIlMjBib3R0bGV8ZW58MHx8MHx8fDA%3D',
    description: 'Insulated bottle to keep your drinks cold.',
    category: 'sports',
  },

  // Food
  {
    id: 21,
    name: 'Gourmet Coffee',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1450024529642-858b23834369?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Premium medium roast from sustainable farms.',
    category: 'food',
  },
  {
    id: 22,
    name: 'Artisan Chocolate Box',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Assorted handcrafted chocolates in a gift box.',
    category: 'food',
    onSale: true,
    salePrice: 19.99,
  },
  {
    id: 23,
    name: 'Organic Tea Collection',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Set of 5 premium loose leaf teas.',
    category: 'food',
  },
  {
    id: 24,
    name: 'Spice Gift Set',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1602522946558-35609654253d?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Collection of gourmet spices from around the world.',
    category: 'food',
  },

  // Books
  {
    id: 25,
    name: 'Bestselling Novel',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: "The latest page-turner everyone's talking about.",
    category: 'books',
  },
  {
    id: 26,
    name: 'Cookbook',
    price: 27.99,
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: '100 recipes for quick and healthy meals.',
    category: 'books',
  },
  {
    id: 27,
    name: 'Self-Help Book',
    price: 17.99,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Practical advice for personal growth.',
    category: 'books',
  },
  {
    id: 28,
    name: 'Journal Set',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=500',
    description: 'Set of 3 journals for planning and reflection.',
    category: 'books',
  },

  // Toys
  {
    id: 29,
    name: 'Building Blocks',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Creative building set for ages 3+.',
    category: 'toys',
  },
  {
    id: 30,
    name: 'Plush Animal',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1584155828260-3791b07e6afb?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Soft and huggable stuffed animal.',
    category: 'toys',
  },
  {
    id: 31,
    name: 'Board Game',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Qm9hcmQlMjBHYW1lfGVufDB8fDB8fHww',
    description: 'Family game night favorite for 2-6 players.',
    category: 'toys',
  },
  {
    id: 32,
    name: 'Art Supply Kit',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Complete art kit for young creatives.',
    category: 'toys',
  },
];

// Shipping options
export const shippingOptions = [
  {
    id: 'free',
    name: 'Free Shipping',
    price: 0,
    estimatedDelivery: '7-10 business days',
  },
  {
    id: 'standard',
    name: 'Standard Shipping',
    price: 4.99,
    estimatedDelivery: '3-5 business days',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    price: 9.99,
    estimatedDelivery: '1-2 business days',
  },
];

// Categories derived from products
export const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

export default products;
