// Product catalog data
export const products = [
  // ==================== ELECTRONICS (12 products) ====================
  {
    id: 1,
    name: 'Wireless Earbuds',
    price: 49.99,
    image:
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&auto=format&fit=crop&q=60',
    description:
      'Premium true wireless earbuds with active noise cancellation and crystal-clear audio. Features touch controls, seamless Bluetooth 5.0 connectivity, and up to 6 hours of playtime per charge.',
    category: 'electronics',
    onSale: true,
    salePrice: 39.99,
    weight: 'Bluetooth 5.0, 6h',
    deliveryTime: 15,
    stock: 3,
    colour: 'White',
    disclaimer:
      'Battery life may vary based on usage and settings. Ear tip fit affects noise cancellation performance. Keep away from water unless specified as waterproof.',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 129.99,
    image:
      'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=500&auto=format&fit=crop&q=60',
    description:
      'Sleek smartwatch with vibrant AMOLED display for tracking fitness, heart rate, and sleep patterns. Stay connected with notifications, GPS tracking, and water-resistant design for active lifestyles.',
    category: 'electronics',
    weight: '1.4" AMOLED, GPS',
    deliveryTime: 12,
    stock: 14,
    colour: 'Black',
    disclaimer:
      'Health metrics are for reference only and not intended for medical diagnosis. GPS accuracy depends on environmental conditions. Strap size may need adjustment.',
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60',
    description:
      'Compact portable speaker delivering powerful 20W stereo sound with deep bass response. Waterproof design with 12-hour battery life makes it perfect for outdoor adventures and parties.',
    category: 'electronics',
    weight: '20W, 12h battery',
    deliveryTime: 10,
    stock: 7,
    colour: 'Black',
    disclaimer:
      'Audio output may vary based on room acoustics. Battery life depends on volume level. Waterproof rating applies to splashes only; do not submerge.',
  },
  {
    id: 4,
    name: '4K Action Camera',
    price: 199.99,
    image:
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=60',
    description:
      'Professional-grade action camera capturing stunning 4K footage at 60fps with image stabilization. Waterproof housing, WiFi connectivity, and wide-angle lens for epic adventure documentation.',
    category: 'electronics',
    weight: '4K 60fps, WiFi',
    deliveryTime: 18,
    stock: 10,
    colour: 'Black',
    disclaimer:
      'Memory card sold separately. Recording time depends on resolution settings. Waterproof case must be properly sealed before underwater use.',
  },
  {
    id: 5,
    name: 'Wireless Keyboard',
    price: 69.99,
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
    description:
      'Ultra-slim mechanical keyboard with customizable RGB backlighting and quiet key switches. Reliable 2.4GHz wireless connection with multi-device support for seamless productivity.',
    category: 'electronics',
    onSale: true,
    salePrice: 54.99,
    weight: '2.4GHz, Backlit',
    deliveryTime: 8,
    stock: 14,
    colour: 'White',
    disclaimer:
      'Batteries required (not included). Key feel may differ from traditional mechanical keyboards. RGB lighting drains battery faster.',
  },
  {
    id: 6,
    name: 'Gaming Mouse',
    price: 59.99,
    image:
      'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&auto=format&fit=crop&q=60',
    description:
      'High-precision gaming mouse with 16000 DPI optical sensor and customizable RGB lighting. Ergonomic design with programmable buttons for competitive gaming performance.',
    category: 'electronics',
    weight: '16000 DPI, RGB',
    deliveryTime: 10,
    stock: 6,
    colour: 'White',
    disclaimer:
      'Software download required for customization. DPI settings affect battery consumption. Mouse pad surface may impact tracking accuracy.',
  },
  {
    id: 7,
    name: 'USB-C Hub',
    price: 45.99,
    image:
      'https://plus.unsplash.com/premium_photo-1761043248662-42f371ad31b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNiJTIwYyUyMGh1YnxlbnwwfHwwfHww',
    description:
      'Versatile 7-in-1 USB-C hub with 4K HDMI output, SD card reader, and multiple USB ports. Compact aluminum design perfect for laptops, tablets, and portable workstations.',
    category: 'electronics',
    weight: '7-in-1, 4K HDMI',
    deliveryTime: 12,
    stock: 15,
    colour: 'Black',
    disclaimer:
      'Device compatibility varies. 4K output requires compatible display and cable. Power delivery depends on host device capabilities.',
  },
  {
    id: 8,
    name: 'Noise Cancelling Headphones',
    price: 249.99,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    description:
      'Premium over-ear headphones with industry-leading active noise cancellation technology. Luxurious memory foam cushions, 30-hour battery life, and Hi-Res audio certification.',
    category: 'electronics',
    onSale: true,
    salePrice: 199.99,
    weight: 'ANC, 30h battery',
    deliveryTime: 15,
    stock: 13,
    colour: 'Black',
    disclaimer:
      'ANC effectiveness varies with ambient noise type. Battery life measured without ANC. Extended use at high volumes may cause hearing damage.',
  },
  {
    id: 9,
    name: 'Portable Power Bank',
    price: 39.99,
    image:
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&auto=format&fit=crop&q=60',
    description:
      'High-capacity 20000mAh power bank with 65W Power Delivery for rapid charging. Charge laptops, tablets, and phones simultaneously with smart device detection technology.',
    category: 'electronics',
    weight: '20000mAh, PD 65W',
    deliveryTime: 8,
    stock: 7,
    colour: 'Black',
    disclaimer:
      'Actual charging capacity is approximately 60-70% of stated capacity. Charging speed depends on device compatibility. Not permitted in checked airline luggage.',
  },
  {
    id: 10,
    name: 'Webcam HD',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1657357092389-49b1b254c1ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdlYmNhbSUyMGhkfGVufDB8fDB8fHww',
    description:
      'Professional 1080p HD webcam with built-in noise-cancelling microphone for crystal-clear video calls. Auto-focus, low-light correction, and universal clip mount for any setup.',
    category: 'electronics',
    weight: '1080p 30fps, Mic',
    deliveryTime: 10,
    stock: 8,
    colour: 'Black',
    disclaimer:
      'Video quality depends on internet connection and lighting conditions. Privacy cover recommended when not in use. Driver installation may be required.',
  },
  {
    id: 11,
    name: 'Tablet Stand',
    price: 29.99,
    image:
      'https://images.unsplash.com/photo-1762195954150-5db56b1d3a19?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRhYmxldCUyMHN0YW5kfGVufDB8fDB8fHww',
    description:
      'Premium aluminum tablet and phone stand with adjustable viewing angles for comfortable use. Sturdy non-slip base supports devices from 4 to 13 inches for work or entertainment.',
    category: 'electronics',
    weight: 'Fits 4-13" devices',
    deliveryTime: 6,
    stock: 13,
    colour: 'Black',
    disclaimer:
      'Weight capacity limited to devices under 2kg. Surface finish may show fingerprints. Angle adjustment requires manual tightening.',
  },
  {
    id: 12,
    name: 'Smart LED Bulb',
    price: 24.99,
    image:
      'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=500&auto=format&fit=crop&q=60',
    description:
      'WiFi-enabled smart bulb offering 16 million colors and tunable white temperatures. Voice control compatible with Alexa and Google Home for effortless ambiance creation.',
    category: 'electronics',
    onSale: true,
    salePrice: 18.99,
    weight: '9W, WiFi, RGB',
    deliveryTime: 8,
    stock: 11,
    colour: 'Silver',
    disclaimer:
      'Requires 2.4GHz WiFi network. Smart home hub may be required for some features. Actual color output may vary from app preview.',
  },

  // ==================== FASHION (12 products) ====================
  {
    id: 13,
    name: 'Classic White Sneakers',
    price: 59.99,
    image:
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&auto=format&fit=crop&q=60',
    description:
      'Timeless white leather sneakers with minimalist design that pairs perfectly with any outfit. Premium cushioned sole provides all-day comfort for casual wear or light activities.',
    category: 'fashion',
    weight: 'Size: 8 US',
    deliveryTime: 12,
    stock: 9,
    colour: 'White',
    disclaimer:
      'Please refer to size chart before ordering. White leather may show scuffs; clean with appropriate leather care products. Break-in period may be required.',
  },
  {
    id: 14,
    name: 'Denim Jacket',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500&auto=format&fit=crop&q=60',
    description:
      'Classic blue denim jacket crafted from premium cotton with authentic vintage wash finish. Features button-front closure, chest pockets, and adjustable waist tabs for the perfect fit.',
    category: 'fashion',
    onSale: true,
    salePrice: 59.99,
    weight: 'Size: L',
    deliveryTime: 15,
    stock: 9,
    colour: 'Blue',
    disclaimer:
      'Denim color may fade with washing; follow care label instructions. Vintage wash means each piece may vary slightly. Size may differ from other brands.',
  },
  {
    id: 15,
    name: 'Leather Crossbody Bag',
    price: 69.99,
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60',
    description:
      'Elegant genuine leather crossbody bag with adjustable strap and multiple interior compartments. Vintage-inspired design with secure zip closure perfect for everyday essentials.',
    category: 'fashion',
    weight: '25 x 18 x 8 cm',
    deliveryTime: 10,
    stock: 15,
    colour: 'Brown',
    disclaimer:
      'Natural leather may have slight variations in texture and color. Leather develops patina over time. Keep away from water and direct sunlight.',
  },
  {
    id: 16,
    name: 'Aviator Sunglasses',
    price: 29.99,
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60',
    description:
      'Iconic gold-frame aviator sunglasses with polarized UV400 protection lenses. Lightweight metal construction with adjustable nose pads for comfortable all-day wear.',
    category: 'fashion',
    weight: 'One Size',
    deliveryTime: 8,
    stock: 10,
    colour: 'Gold',
    disclaimer:
      'Not suitable for direct sun gazing or eclipse viewing. Clean lenses with microfiber cloth only. UV protection does not prevent eye strain from screens.',
  },
  {
    id: 17,
    name: 'Wool Scarf',
    price: 34.99,
    image:
      'https://images.unsplash.com/photo-1599948126830-89f10444e491?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29vbCUyMHNjYXJmfGVufDB8fDB8fHww',
    description:
      'Luxuriously soft merino wool scarf in elegant neutral tones for cold weather styling. Generous length allows multiple wrapping styles while keeping you warm and fashionable.',
    category: 'fashion',
    weight: '180 x 30 cm',
    deliveryTime: 10,
    stock: 15,
    colour: 'Maroon',
    disclaimer:
      'Dry clean recommended. Wool may cause irritation for sensitive skin. Some shedding is normal for new wool products.',
  },
  {
    id: 18,
    name: 'Canvas Backpack',
    price: 49.99,
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
    description:
      'Rugged canvas backpack with water-resistant coating and padded laptop compartment. Multiple pockets, reinforced straps, and vintage-style design perfect for daily commutes or travel.',
    category: 'fashion',
    onSale: true,
    salePrice: 39.99,
    weight: '45 x 30 x 15 cm',
    deliveryTime: 12,
    stock: 10,
    colour: 'Blue',
    disclaimer:
      'Water-resistant coating is not waterproof; avoid heavy rain. Maximum laptop size 15 inches. Weight capacity should not exceed 15kg.',
  },
  {
    id: 19,
    name: 'Leather Belt',
    price: 39.99,
    image:
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&auto=format&fit=crop&q=60',
    description:
      'Handcrafted genuine leather belt with brushed silver buckle and classic stitched edges. Versatile brown tone complements both casual jeans and formal dress pants.',
    category: 'fashion',
    weight: 'Sizes: 28-44 in',
    deliveryTime: 8,
    stock: 8,
    colour: 'Brown',
    disclaimer:
      'Measure existing belt for accurate sizing. Leather will stretch with use. Buckle finish may vary slightly between batches.',
  },
  {
    id: 20,
    name: 'Baseball Cap',
    price: 24.99,
    image:
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=60',
    description:
      'Classic six-panel baseball cap in premium cotton twill with curved brim and embroidered eyelets. Adjustable snapback closure ensures a comfortable fit for any head size.',
    category: 'fashion',
    weight: 'One Size Adjustable',
    deliveryTime: 6,
    stock: 8,
    colour: 'White',
    disclaimer:
      'White fabric may show stains; spot clean only. Color may fade with prolonged sun exposure. One size fits most adults.',
  },
  {
    id: 21,
    name: 'Silk Tie',
    price: 44.99,
    image:
      'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=500&auto=format&fit=crop&q=60',
    description:
      'Elegant 100% silk tie in sophisticated navy blue with subtle woven texture pattern. Hand-finished construction and perfect width for modern professional and formal occasions.',
    category: 'fashion',
    weight: '150 x 8 cm',
    deliveryTime: 10,
    stock: 4,
    colour: 'Navy Blue',
    disclaimer:
      'Dry clean only. Silk is delicate; avoid contact with water and perfume. Store rolled or hung to prevent creasing.',
  },
  {
    id: 22,
    name: 'Leather Wallet',
    price: 54.99,
    image:
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60',
    description:
      'Slim bifold wallet in genuine leather with RFID-blocking technology to protect your cards. Features multiple card slots, bill compartment, and ID window in a pocket-friendly design.',
    category: 'fashion',
    onSale: true,
    salePrice: 44.99,
    weight: '11 x 9 cm',
    deliveryTime: 8,
    stock: 14,
    colour: 'Brown',
    disclaimer:
      'RFID protection effective for most cards but not guaranteed for all. Leather darkens naturally with use. Avoid overstuffing to maintain shape.',
  },
  {
    id: 23,
    name: 'Running Shoes',
    price: 119.99,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
    description:
      'High-performance running shoes with responsive foam cushioning and breathable mesh upper. Bold red colorway with reflective accents for visibility during early morning or evening runs.',
    category: 'fashion',
    weight: 'Sizes: 6-13 US',
    deliveryTime: 15,
    stock: 7,
    colour: 'Red',
    disclaimer:
      'Consult a professional for proper fit. Replace shoes after 300-500 miles. Not designed for sports other than running. Break-in period recommended.',
  },
  {
    id: 24,
    name: 'Winter Beanie',
    price: 19.99,
    image:
      'https://images.unsplash.com/photo-1510598969022-c4c6c5d05769?w=500&auto=format&fit=crop&q=60',
    description:
      'Cozy knitted beanie in soft acrylic blend with fleece-lined interior for extra warmth. Classic ribbed cuff design fits comfortably and stays in place during winter activities.',
    category: 'fashion',
    weight: 'One Size',
    deliveryTime: 6,
    stock: 12,
    colour: 'Green',
    disclaimer:
      'Hand wash recommended to maintain shape. Acrylic may generate static. One size fits most adults; may be snug for larger head sizes.',
  },

  // ==================== HOME (12 products) ====================
  {
    id: 25,
    name: 'Coffee Maker',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1757038490099-440e6cf45cf7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNvZmZmZWUlMjBtYWtlcnxlbnwwfHwwfHx8MA%3D%3D',
    description:
      'Programmable 12-cup drip coffee maker with thermal carafe to keep coffee hot for hours. Features auto-start timer, brew strength control, and easy-clean removable filter basket.',
    category: 'home',
    weight: '12-Cup, 1000W',
    deliveryTime: 18,
    stock: 3,
    colour: 'Silver',
    disclaimer:
      'Descale regularly for optimal performance. Thermal carafe keeps coffee warm but not hot indefinitely. Paper filters sold separately.',
  },
  {
    id: 26,
    name: 'Throw Blanket',
    price: 34.99,
    image:
      'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=500&auto=format&fit=crop&q=60',
    description:
      'Ultra-soft microfiber throw blanket in warm cream tones for cozy living room comfort. Lightweight yet warm, machine washable, and perfect for movie nights on the couch.',
    category: 'home',
    weight: '150 x 200 cm',
    deliveryTime: 10,
    stock: 14,
    colour: 'Cream',
    disclaimer:
      'Wash separately before first use to remove excess fibers. Tumble dry low. Color may vary slightly from image due to dye lots.',
  },
  {
    id: 27,
    name: 'Scented Candle Set',
    price: 24.99,
    image:
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=60',
    description:
      'Luxurious set of 3 hand-poured soy wax candles in calming lavender, vanilla, and eucalyptus scents. Clean-burning with cotton wicks for up to 45 hours of relaxing aromatherapy.',
    category: 'home',
    onSale: true,
    salePrice: 17.99,
    weight: '3 x 150g candles',
    deliveryTime: 8,
    stock: 10,
    colour: 'White',
    disclaimer:
      'Never leave burning candles unattended. Keep away from children and pets. Burn time varies based on conditions. Trim wick to 1/4 inch before each use.',
  },
  {
    id: 28,
    name: 'Modern Wall Clock',
    price: 42.99,
    image:
      'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500&auto=format&fit=crop&q=60',
    description:
      'Minimalist wall clock with silent quartz movement and sleek black metal frame. Clean number-free face design adds contemporary elegance to any room in your home.',
    category: 'home',
    weight: '30 cm diameter',
    deliveryTime: 12,
    stock: 14,
    colour: 'White',
    disclaimer:
      'Battery not included (requires 1 AA). Silent movement is near-silent; minimal ticking may be audible in quiet rooms. Wall mounting hardware included.',
  },
  {
    id: 29,
    name: 'Indoor Plant Pot',
    price: 19.99,
    image:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop&q=60',
    description:
      'Elegant white ceramic planter with built-in drainage hole and matching saucer. Modern cylindrical design showcases your favorite houseplants while complementing any décor style.',
    category: 'home',
    weight: '15 cm diameter',
    deliveryTime: 10,
    stock: 5,
    colour: 'Cyan',
    disclaimer:
      'Plant not included. Ceramic may have minor glaze variations characteristic of handmade items. Handle with care; ceramic is fragile.',
  },
  {
    id: 30,
    name: 'Table Lamp',
    price: 54.99,
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=60',
    description:
      'Elegant gold-tone table lamp with fabric shade and touch-sensitive dimmer for adjustable ambiance. Perfect bedside or desk lighting with energy-efficient LED bulb included.',
    category: 'home',
    onSale: true,
    salePrice: 44.99,
    weight: '40 cm, Dimmable LED',
    deliveryTime: 15,
    stock: 4,
    colour: 'Black',
    disclaimer:
      'LED bulb included has limited lifespan. Touch dimmer requires clean, dry hands. Not compatible with smart home systems without adapter.',
  },
  {
    id: 31,
    name: 'Decorative Vase',
    price: 29.99,
    image:
      'https://plus.unsplash.com/premium_photo-1676654935534-e8cfff4c40df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVjb3JhdGl2ZSUyMHZhc2V8ZW58MHx8MHx8fDA%3D',
    description:
      'Artisan-crafted ceramic vase with elegant curved silhouette and matte white glaze finish. Versatile size perfect for fresh flowers, dried arrangements, or as a standalone decorative piece.',
    category: 'home',
    weight: '25 cm height',
    deliveryTime: 10,
    stock: 12,
    colour: 'Cream',
    disclaimer:
      'Handcrafted item; slight variations in shape and glaze are normal. Not dishwasher safe. Rinse and dry after use with water to prevent staining.',
  },
  {
    id: 32,
    name: 'Kitchen Knife Set',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&auto=format&fit=crop&q=60',
    description:
      'Professional 5-piece stainless steel knife set including chef, bread, utility, and paring knives. Comes with elegant wooden storage block and razor-sharp precision-forged blades.',
    category: 'home',
    weight: '5-Piece, Stainless Steel',
    deliveryTime: 18,
    stock: 7,
    colour: 'Silver',
    disclaimer:
      'Knives are extremely sharp; handle with care. Hand wash and dry immediately. Keep out of reach of children. Sharpen periodically for best performance.',
  },
  {
    id: 33,
    name: 'Cotton Towel Set',
    price: 39.99,
    image:
      'https://plus.unsplash.com/premium_photo-1684445034670-b36aca25c25a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y290dG9uJTIwdG93ZWwlMjBzZXR8ZW58MHx8MHx8fDA%3D',
    description:
      'Luxurious 6-piece Turkish cotton towel set including bath towels, hand towels, and washcloths. Ultra-absorbent, quick-drying, and gets softer with every wash for spa-like comfort.',
    category: 'home',
    weight: '6-Piece, 100% Cotton',
    deliveryTime: 10,
    stock: 7,
    colour: 'White',
    disclaimer:
      'Wash before first use. Some lint shedding is normal initially. Avoid fabric softeners to maintain absorbency. Colors may fade with bleach.',
  },
  {
    id: 34,
    name: 'Picture Frame Set',
    price: 34.99,
    image:
      'https://images.unsplash.com/photo-1550535424-fd4382da050c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fHBpY3R1cmUlMjBmcmFtZSUyMHNldHxlbnwwfHwwfHx8MA%3D%3D',
    description:
      'Gallery wall set of 5 natural wood frames in varying sizes from 4x6 to 8x10 inches. Includes hanging hardware and template for creating a perfectly arranged photo display.',
    category: 'home',
    onSale: true,
    salePrice: 27.99,
    weight: '5-Piece, 4x6" to 8x10"',
    deliveryTime: 8,
    stock: 11,
    colour: 'Natural Wood',
    disclaimer:
      'Natural wood grain varies between frames. Photos not included. Use appropriate wall anchors for your wall type. Glass front is fragile.',
  },
  {
    id: 35,
    name: 'Blender',
    price: 69.99,
    image:
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&auto=format&fit=crop&q=60',
    description:
      'Powerful 700W blender with 1.5L glass pitcher and stainless steel blades for smooth results. Multiple speed settings and pulse function perfect for smoothies, soups, and sauces.',
    category: 'home',
    weight: '1.5L, 700W',
    deliveryTime: 15,
    stock: 13,
    colour: 'Silver',
    disclaimer:
      'Do not blend hot liquids above 40°C. Allow motor to cool between extended uses. Glass pitcher is heat-resistant but not unbreakable.',
  },
  {
    id: 36,
    name: 'Bedside Organizer',
    price: 22.99,
    image:
      'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=500&auto=format&fit=crop&q=60',
    description:
      "Convenient bedside caddy with multiple pockets for remotes, books, phones, and tablets. Slips securely between mattress and frame to keep nighttime essentials within arm's reach.",
    category: 'home',
    weight: '35 x 25 cm',
    deliveryTime: 8,
    stock: 4,
    colour: 'Brown',
    disclaimer:
      'Weight capacity limited; avoid heavy items. Fit depends on mattress thickness. May shift with bed movement. Spot clean only.',
  },

  // ==================== BEAUTY (12 products) ====================
  {
    id: 37,
    name: 'Skincare Set',
    price: 59.99,
    image:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60',
    description:
      'Complete 5-piece skincare routine with cleanser, toner, serum, moisturizer, and eye cream. Formulated with natural ingredients for radiant, healthy-looking skin at any age.',
    category: 'beauty',
    weight: '5-Piece, 450ml total',
    deliveryTime: 12,
    stock: 8,
    colour: 'White',
    disclaimer:
      'Perform patch test before full use. Results vary by skin type. Check expiry date before use. Discontinue if irritation occurs and consult a dermatologist.',
  },
  {
    id: 38,
    name: 'Hair Styling Tools',
    price: 129.99,
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=60',
    description:
      'Professional salon-quality styling kit with ionic hair dryer and ceramic flat iron. Advanced heat technology reduces damage while creating sleek, frizz-free styles that last.',
    category: 'beauty',
    onSale: true,
    salePrice: 89.99,
    weight: 'Dryer + Straightener',
    deliveryTime: 15,
    stock: 7,
    colour: 'Blue',
    disclaimer:
      'Always use heat protectant spray. Keep away from water when in use. Allow to cool before storage. Not recommended for chemically treated hair without professional advice.',
  },
  {
    id: 39,
    name: 'Makeup Palette',
    price: 39.99,
    image:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&auto=format&fit=crop&q=60',
    description:
      'Stunning rose gold eyeshadow palette featuring 18 highly pigmented shades from matte to shimmer. Blendable, long-lasting formula perfect for creating any look from natural to dramatic.',
    category: 'beauty',
    weight: '18 Colors',
    deliveryTime: 10,
    stock: 10,
    colour: 'Multicolor',
    disclaimer:
      'Colors may appear different based on skin tone and lighting. For external use only. Avoid contact with eyes. Check ingredients if you have allergies.',
  },
  {
    id: 40,
    name: 'Perfume Set',
    price: 84.99,
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=60',
    description:
      'Elegant collection of 3 designer fragrances in luxurious gold-accented bottles. Includes fresh floral, warm oriental, and crisp citrus scents for every mood and occasion.',
    category: 'beauty',
    weight: '3 x 30ml bottles',
    deliveryTime: 12,
    stock: 7,
    colour: 'Orange',
    disclaimer:
      'Fragrance may vary based on body chemistry. Store away from direct sunlight. Not for internal use. Do not spray on damaged or irritated skin.',
  },
  {
    id: 41,
    name: 'Facial Cleanser',
    price: 24.99,
    image:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&auto=format&fit=crop&q=60',
    description:
      'Gentle foaming cleanser that removes makeup and impurities without stripping natural oils. pH-balanced formula with aloe vera and chamomile soothes while cleansing all skin types.',
    category: 'beauty',
    weight: '200ml',
    deliveryTime: 8,
    stock: 8,
    colour: 'White',
    disclaimer:
      'Avoid contact with eyes. Rinse thoroughly if contact occurs. Discontinue use if redness or irritation develops. Check expiration date before use.',
  },
  {
    id: 42,
    name: 'Lip Gloss Set',
    price: 19.99,
    image:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=60',
    description:
      'Collection of 6 hydrating lip glosses in gorgeous pink and nude shades with subtle shimmer. Non-sticky formula enriched with vitamin E keeps lips moisturized and beautifully glossy.',
    category: 'beauty',
    onSale: true,
    salePrice: 14.99,
    weight: '6 x 5ml tubes',
    deliveryTime: 6,
    stock: 10,
    colour: 'Pink',
    disclaimer:
      'Not intended for ingestion. Discontinue use if lips become irritated. Colors may appear different on various skin tones. Store in cool, dry place.',
  },
  {
    id: 43,
    name: 'Face Mask Pack',
    price: 29.99,
    image:
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&auto=format&fit=crop&q=60',
    description:
      'Premium pack of 10 Korean sheet masks infused with hyaluronic acid and botanical extracts. Intensive hydration treatment reveals plump, glowing skin after just one 15-minute session.',
    category: 'beauty',
    weight: '10 Sheet Masks',
    deliveryTime: 8,
    stock: 5,
    colour: 'White',
    disclaimer:
      'For single use only. Discard mask after use. Do not use on broken or irritated skin. Patch test recommended for sensitive skin. Check expiry before use.',
  },
  {
    id: 44,
    name: 'Makeup Brushes',
    price: 34.99,
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60',
    description:
      'Professional 12-piece brush set with ultra-soft synthetic bristles in gorgeous pink handles. Includes foundation, powder, contour, eyeshadow, and lip brushes with elegant travel case.',
    category: 'beauty',
    weight: '12-Piece Set',
    deliveryTime: 10,
    stock: 6,
    colour: 'Brown',
    disclaimer:
      'Clean brushes regularly to prevent bacteria buildup. Some shedding is normal initially. Synthetic bristles are vegan-friendly. Store in dry place.',
  },
  {
    id: 45,
    name: 'Hair Mask',
    price: 18.99,
    image:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&auto=format&fit=crop&q=60',
    description:
      'Intensive deep conditioning treatment with keratin protein and argan oil for damaged hair. Repairs split ends, restores shine, and transforms dry, brittle strands into silky softness.',
    category: 'beauty',
    weight: '250ml',
    deliveryTime: 8,
    stock: 7,
    colour: 'White',
    disclaimer:
      'Results vary based on hair type and damage level. Do not apply to scalp directly. Rinse thoroughly. Use weekly for best results; overuse may weigh down fine hair.',
  },
  {
    id: 46,
    name: 'Nail Polish Set',
    price: 22.99,
    image:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&auto=format&fit=crop&q=60',
    description:
      'Trendy 8-piece nail polish collection in vibrant reds, pinks, and classic neutrals. Long-lasting, chip-resistant formula with quick-dry technology and high-shine gel-like finish.',
    category: 'beauty',
    onSale: true,
    salePrice: 17.99,
    weight: '8 x 10ml bottles',
    deliveryTime: 6,
    stock: 8,
    colour: 'Black & Brown',
    disclaimer:
      'Use in well-ventilated area. Keep away from flames. Not for use on damaged nails. Some colors may require multiple coats. Shake well before use.',
  },
  {
    id: 47,
    name: 'Hair Serum',
    price: 27.99,
    image:
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&auto=format&fit=crop&q=60',
    description:
      'Lightweight anti-frizz serum with argan oil and silk proteins in elegant amber bottle. Tames flyaways, adds brilliant shine, and protects against heat styling up to 450°F.',
    category: 'beauty',
    weight: '100ml',
    deliveryTime: 8,
    stock: 5,
    colour: 'Amber',
    disclaimer:
      'Apply to damp or dry hair. Start with small amount; too much may leave hair greasy. Not a replacement for heat protectant. Avoid contact with eyes.',
  },
  {
    id: 48,
    name: 'Sunscreen SPF 50',
    price: 21.99,
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60',
    description:
      'Broad spectrum SPF 50 sunscreen with lightweight, non-greasy formula that absorbs quickly. Water-resistant protection against UVA/UVB rays, perfect for daily use under makeup.',
    category: 'beauty',
    weight: '150ml',
    deliveryTime: 8,
    stock: 14,
    colour: 'White',
    disclaimer:
      'Reapply every 2 hours and after swimming or sweating. Not intended for prolonged sun exposure. Discontinue if rash develops. Check expiry date before use.',
  },

  // ==================== SPORTS (12 products) ====================
  {
    id: 49,
    name: 'Yoga Mat',
    price: 34.99,
    image:
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format&fit=crop&q=60',
    description:
      'Premium 6mm thick yoga mat with non-slip textured surface in calming purple. Eco-friendly TPE material provides excellent cushioning and grip for yoga, pilates, and floor exercises.',
    category: 'sports',
    onSale: true,
    salePrice: 24.99,
    weight: '183 x 61 cm, 6mm',
    deliveryTime: 10,
    stock: 15,
    colour: 'Purple',
    disclaimer:
      'Unroll and air out before first use to reduce material odor. Clean with damp cloth; avoid harsh chemicals. Grip improves after initial uses.',
  },
  {
    id: 50,
    name: 'Fitness Tracker',
    price: 99.99,
    image:
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=60',
    description:
      'Advanced fitness band with 24/7 heart rate monitoring, sleep tracking, and 20+ exercise modes. Water-resistant design with 7-day battery life and smartphone notifications.',
    category: 'sports',
    weight: 'Heart Rate, 7-day battery',
    deliveryTime: 12,
    stock: 7,
    colour: 'Black',
    disclaimer:
      'Health data is for informational purposes only; not a medical device. Battery life varies with usage. Water-resistant, not waterproof for swimming.',
  },
  {
    id: 51,
    name: 'Resistance Bands',
    price: 19.99,
    image:
      'https://images.unsplash.com/photo-1517130038641-a774d04afb3c?w=500&auto=format&fit=crop&q=60',
    description:
      'Complete set of 5 color-coded latex resistance bands ranging from 5 to 40 lbs. Perfect for strength training, physical therapy, and home workouts with included door anchor and handles.',
    category: 'sports',
    weight: '5-40 lbs resistance',
    deliveryTime: 8,
    stock: 10,
    colour: 'Green',
    disclaimer:
      'Inspect bands for damage before each use. Latex may cause allergic reactions in some users. Do not overstretch beyond recommended limits.',
  },
  {
    id: 52,
    name: 'Water Bottle',
    price: 16.99,
    image:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60',
    description:
      'Double-wall vacuum insulated stainless steel bottle keeps drinks cold for 24 hours or hot for 12. Leak-proof lid with carrying loop perfect for gym, hiking, or daily hydration.',
    category: 'sports',
    weight: '750ml capacity',
    deliveryTime: 6,
    stock: 9,
    colour: 'White',
    disclaimer:
      'Hand wash recommended. Do not microwave or freeze. Temperature retention varies with external conditions. Not suitable for carbonated beverages.',
  },
  {
    id: 53,
    name: 'Dumbbells Set',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=500&auto=format&fit=crop&q=60',
    description:
      'Space-saving adjustable dumbbell set with quick-change weight selection from 5 to 25 lbs. Durable cast iron construction with textured grip handles for safe, effective home workouts.',
    category: 'sports',
    weight: '5-25 lbs adjustable',
    deliveryTime: 20,
    stock: 10,
    colour: 'Black',
    disclaimer:
      'Ensure weight plates are securely locked before lifting. Use on padded surface to prevent floor damage. Consult physician before starting exercise program.',
  },
  {
    id: 54,
    name: 'Jump Rope',
    price: 14.99,
    image:
      'https://images.unsplash.com/photo-1651315283994-03ec73dc21f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8anVtcCUyMHJvcGV8ZW58MHx8MHx8fDA%3D',
    description:
      'Professional speed jump rope with lightweight steel cable and ergonomic ball-bearing handles. Adjustable 3-meter length perfect for cardio, boxing training, and HIIT workouts.',
    category: 'sports',
    onSale: true,
    salePrice: 11.99,
    weight: '3m adjustable length',
    deliveryTime: 6,
    stock: 11,
    colour: 'Black',
    disclaimer:
      'Use on flat surface with adequate clearance. Steel cable may cause injury if used improperly. Warm up before high-intensity jumping.',
  },
  {
    id: 55,
    name: 'Gym Bag',
    price: 44.99,
    image:
      'https://images.unsplash.com/photo-1692506530242-c12d6c3ae2e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltJTIwYmFnfGVufDB8fDB8fHww',
    description:
      'Spacious 50L gym duffel bag with dedicated shoe compartment and wet pocket for sweaty gear. Water-resistant fabric, padded shoulder strap, and multiple organizer pockets for all your essentials.',
    category: 'sports',
    weight: '50L capacity',
    deliveryTime: 10,
    stock: 14,
    colour: 'Black',
    disclaimer:
      'Water-resistant does not mean waterproof. Empty and air out wet compartment after use. Avoid overloading to prevent zipper strain.',
  },
  {
    id: 56,
    name: 'Foam Roller',
    price: 29.99,
    image:
      'https://plus.unsplash.com/premium_photo-1672039973233-778e8f60118f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fGZvYW0lMjByb2xsZXJ8ZW58MHx8MHx8fDA%3D',
    description:
      'High-density EVA foam roller with textured surface for deep tissue massage and muscle recovery. Ideal for releasing tension, improving flexibility, and post-workout myofascial release.',
    category: 'sports',
    weight: '45 cm length',
    deliveryTime: 8,
    stock: 3,
    colour: 'Blue',
    disclaimer:
      'Avoid rolling directly on joints or spine. May cause discomfort initially; reduce pressure if painful. Consult physician if you have injuries.',
  },
  {
    id: 57,
    name: 'Sports Headband',
    price: 12.99,
    image:
      'https://images.unsplash.com/photo-1671210004146-70569f951169?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fHNwb3J0cyUyMGhlYWRiYW5kfGVufDB8fDB8fHww',
    description:
      'Performance athletic headband with moisture-wicking fabric that keeps sweat out of your eyes. Stretchy, non-slip silicone grip stays in place during intense workouts and outdoor activities.',
    category: 'sports',
    weight: 'One Size Elastic',
    deliveryTime: 5,
    stock: 13,
    colour: 'Black',
    disclaimer:
      'Machine wash cold, air dry. Silicone grip may feel tight initially but will relax with use. Elasticity may decrease over time with frequent washing.',
  },
  {
    id: 58,
    name: 'Tennis Racket',
    price: 89.99,
    image:
      'https://images.unsplash.com/photo-1617883861744-13b534e3b928?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVubmlzJTIwcmFja2V0fGVufDB8fDB8fHww',
    description:
      'Lightweight graphite tennis racket with enlarged sweet spot perfect for beginners and intermediates. Pre-strung with comfortable cushioned grip and vibration dampening for better control.',
    category: 'sports',
    onSale: true,
    salePrice: 69.99,
    weight: '280g, 27 inch',
    deliveryTime: 15,
    stock: 11,
    colour: 'White',
    disclaimer:
      'Strings may need replacement over time with regular use. Store in cool, dry place away from extreme temperatures. Not recommended for advanced players.',
  },
  {
    id: 59,
    name: 'Yoga Blocks',
    price: 18.99,
    image:
      'https://images.unsplash.com/photo-1646239646963-b0b9be56d6b5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eW9nYSUyMGJsb2Nrc3xlbnwwfHwwfHx8MA%3D%3D',
    description:
      'Set of 2 sustainable natural cork yoga blocks with beveled edges for comfortable hand positioning. Firm yet lightweight support improves alignment and deepens stretches for all skill levels.',
    category: 'sports',
    weight: '2-Pack, 9x6x3 in',
    deliveryTime: 8,
    stock: 10,
    colour: 'Cork',
    disclaimer:
      'Natural cork may have slight variations in color and texture. Wipe clean with damp cloth; avoid soaking. Cork is porous and may absorb oils.',
  },
  {
    id: 60,
    name: 'Cycling Gloves',
    price: 24.99,
    image:
      'https://images.unsplash.com/photo-1760177379284-b68471fdd217?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGN5Y2xpbmclMjBnbG92ZXN8ZW58MHx8MHx8fDA%3D',
    description:
      'Padded cycling gloves with gel cushioning and breathable mesh back for long-ride comfort. Silicone grip palms and pull-tab fingers make them easy to remove after sweaty sessions.',
    category: 'sports',
    weight: 'Sizes: S-XL',
    deliveryTime: 8,
    stock: 8,
    colour: 'Black',
    disclaimer:
      'Refer to size chart for proper fit. Hand wash and air dry to maintain padding. Not designed for motorcycle use. Gloves do not replace proper cycling safety equipment.',
  },

  // ==================== FOOD (12 products) ====================
  {
    id: 61,
    name: 'Gourmet Coffee',
    price: 15.99,
    image:
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=60',
    description:
      'Single-origin medium roast coffee beans sourced from sustainable farms in Colombia. Rich, smooth flavor with notes of chocolate and caramel, freshly roasted for maximum aroma.',
    category: 'food',
    weight: '500g',
    deliveryTime: 8,
    stock: 10,
    colour: 'Brown',
    disclaimer:
      'Store in airtight container away from light and heat. Best consumed within 4 weeks of opening. Contains caffeine; not suitable for caffeine-sensitive individuals.',
  },
  {
    id: 62,
    name: 'Artisan Chocolate Box',
    price: 24.99,
    image:
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=60',
    description:
      'Exquisite collection of handcrafted Belgian chocolates in elegant gift box presentation. Features dark, milk, and white varieties with ganache, praline, and fruit-filled centers.',
    category: 'food',
    onSale: true,
    salePrice: 19.99,
    weight: '300g',
    deliveryTime: 10,
    stock: 13,
    colour: 'Brown',
    disclaimer:
      'Contains milk, soy, and may contain tree nuts. Store in cool, dry place (15-18°C). Product may melt during warm weather shipping. Check best before date.',
  },
  {
    id: 63,
    name: 'Organic Tea Set',
    price: 22.99,
    image:
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60',
    description:
      'Premium collection of 5 organic loose leaf teas including green, black, oolong, and herbal blends. Sourced from certified organic gardens with resealable pouches for lasting freshness.',
    category: 'food',
    weight: '5 x 40g pouches',
    deliveryTime: 8,
    stock: 14,
    colour: 'Green',
    disclaimer:
      'Contains caffeine (except herbal blends). Steep times vary by tea type. Store in cool, dry place. Pregnant women should consult doctor before consuming certain herbal teas.',
  },
  {
    id: 64,
    name: 'Spice Gift Set',
    price: 29.99,
    image:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60',
    description:
      'World cuisine spice collection featuring 8 premium spices in elegant glass jars with bamboo rack. Includes cumin, turmeric, paprika, and exotic blends for global culinary adventures.',
    category: 'food',
    weight: '8 Spice Jars, 50g each',
    deliveryTime: 10,
    stock: 5,
    colour: 'Assorted',
    disclaimer:
      'Store away from light and heat to maintain freshness. Best used within 6 months of opening. Some spices may cause allergic reactions; check ingredients.',
  },
  {
    id: 65,
    name: 'Olive Oil Premium',
    price: 18.99,
    image:
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60',
    description:
      'Cold-pressed extra virgin olive oil from Tuscany with rich, fruity flavor and golden-green hue. Perfect for salads, cooking, and dipping with authentic Italian quality certification.',
    category: 'food',
    weight: '500ml',
    deliveryTime: 10,
    stock: 5,
    colour: 'Golden',
    disclaimer:
      'Store in cool, dark place. Oil may solidify when refrigerated but returns to normal at room temperature. Best used within 18 months. Smoke point 190°C.',
  },
  {
    id: 66,
    name: 'Honey Jar Set',
    price: 27.99,
    image:
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=500&auto=format&fit=crop&q=60',
    description:
      'Trio of raw artisan honeys featuring wildflower, clover, and acacia varieties in golden amber hues. Unfiltered and unpasteurized to preserve natural enzymes and health benefits.',
    category: 'food',
    onSale: true,
    salePrice: 22.99,
    weight: '3 x 250g jars',
    deliveryTime: 8,
    stock: 6,
    colour: 'Amber',
    disclaimer:
      'Not suitable for infants under 1 year old. Raw honey may crystallize naturally; warm gently to liquefy. Store at room temperature away from direct sunlight.',
  },
  {
    id: 67,
    name: 'Granola Mix',
    price: 12.99,
    image:
      'https://images.unsplash.com/photo-1658245730855-abc66ac0b519?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3Jhbm9sYSUyMG1peHxlbnwwfHwwfHx8MA%3D%3D',
    description:
      'Crunchy artisan granola clusters with toasted oats, almonds, pecans, and dried cranberries. Lightly sweetened with maple syrup, perfect for breakfast bowls or healthy snacking.',
    category: 'food',
    weight: '400g',
    deliveryTime: 6,
    stock: 8,
    colour: 'Brown',
    disclaimer:
      'Contains tree nuts and oats. May contain traces of other nuts. Reseal bag after opening. Best consumed within 2 months of opening for optimal freshness.',
  },
  {
    id: 68,
    name: 'Pasta Variety Pack',
    price: 16.99,
    image:
      'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=500&auto=format&fit=crop&q=60',
    description:
      'Authentic Italian pasta collection featuring penne, fusilli, spaghetti, and farfalle shapes. Made from 100% durum wheat semolina using traditional bronze die extrusion methods.',
    category: 'food',
    weight: '1kg',
    deliveryTime: 8,
    stock: 15,
    colour: 'Yellow',
    disclaimer:
      'Contains wheat/gluten. Cooking times vary by shape; refer to package instructions. Store in cool, dry place. Not suitable for those with celiac disease.',
  },
  {
    id: 69,
    name: 'Nut Butter Sampler',
    price: 19.99,
    image:
      'https://plus.unsplash.com/premium_photo-1701210419372-29c3bc0008f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bnV0JTIwYnV0dGVyfGVufDB8fDB8fHww',
    description:
      'Creamy trio of all-natural nut butters including almond, cashew, and classic peanut varieties. No added sugar or palm oil, just pure roasted nuts for healthy spreading and baking.',
    category: 'food',
    weight: '3 x 200g jars',
    deliveryTime: 8,
    stock: 8,
    colour: 'Brown',
    disclaimer:
      'Contains peanuts and tree nuts. Natural oil separation is normal; stir before use. Refrigerate after opening. Not suitable for those with nut allergies.',
  },
  {
    id: 70,
    name: 'Dried Fruit Mix',
    price: 14.99,
    image:
      'https://plus.unsplash.com/premium_photo-1668677227454-213252229b73?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHJpZWQlMjBmcnVpdCUyMG1peHxlbnwwfHwwfHx8MA%3D%3D',
    description:
      'Colorful premium blend of sun-dried apricots, mangoes, cranberries, and goji berries. No added sugar or preservatives, perfect for trail mix, baking, or guilt-free snacking.',
    category: 'food',
    onSale: true,
    salePrice: 11.99,
    weight: '350g',
    deliveryTime: 6,
    stock: 5,
    colour: 'Assorted',
    disclaimer:
      'May contain pits or pit fragments. Natural sugars from fruit; not suitable for strict low-sugar diets. Store in airtight container. Check for allergens.',
  },
  {
    id: 71,
    name: 'Matcha Powder',
    price: 24.99,
    image:
      'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=500&auto=format&fit=crop&q=60',
    description:
      'Premium ceremonial grade matcha from Uji, Japan with vibrant green color and smooth umami flavor. Stone-ground from shade-grown tea leaves for traditional tea ceremonies or lattes.',
    category: 'food',
    weight: '100g',
    deliveryTime: 10,
    stock: 13,
    colour: 'Green',
    disclaimer:
      'Contains caffeine. Store refrigerated after opening to preserve color and flavor. Use within 1-2 months of opening. Sift before use to prevent clumping.',
  },
  {
    id: 72,
    name: 'Hot Sauce Collection',
    price: 21.99,
    image:
      'https://images.unsplash.com/photo-1757800499225-220ba7ee4e53?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90JTIwc2F1Y2UlMjBjb2xsZWN0aW9ufGVufDB8fDB8fHww',
    description:
      'Fiery collection of 4 small-batch hot sauces ranging from mild to extra hot heat levels. Features habanero, chipotle, ghost pepper, and Carolina Reaper varieties for spice enthusiasts.',
    category: 'food',
    weight: '4 x 150ml bottles',
    deliveryTime: 8,
    stock: 12,
    colour: 'Red',
    disclaimer:
      'Extremely hot varieties included; use with caution. Keep away from eyes and sensitive skin. Not suitable for children. Wash hands after handling.',
  },

  // ==================== BOOKS (12 products) ====================
  {
    id: 73,
    name: 'Bestselling Novel',
    price: 14.99,
    image:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60',
    description:
      'Gripping thriller novel with red-hot suspense that keeps you turning pages until the stunning finale. New York Times bestseller praised for its intricate plot twists and compelling characters.',
    category: 'books',
    weight: '384 pages',
    deliveryTime: 8,
    stock: 4,
    colour: 'Black',
    disclaimer:
      'Contains mature themes; reader discretion advised. Cover design may vary from image shown. Non-returnable once seal is broken.',
  },
  {
    id: 74,
    name: 'Cookbook',
    price: 27.99,
    image:
      'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&auto=format&fit=crop&q=60',
    description:
      'Beautiful hardcover cookbook featuring 100 quick, healthy recipes with stunning photography. Each dish includes nutritional information and can be prepared in 30 minutes or less.',
    category: 'books',
    weight: '256 pages, Hardcover',
    deliveryTime: 10,
    stock: 3,
    colour: 'White',
    disclaimer:
      'Nutritional values are estimates only. Cooking times may vary by equipment. Check ingredients for allergens. Recipe results depend on technique and ingredient quality.',
  },
  {
    id: 75,
    name: 'Self-Help Book',
    price: 17.99,
    image:
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60',
    description:
      'Transformative guide to personal development with practical exercises and actionable strategies. Learn proven techniques for building confidence, setting goals, and achieving lasting success.',
    category: 'books',
    onSale: true,
    salePrice: 13.99,
    weight: '224 pages',
    deliveryTime: 8,
    stock: 13,
    colour: 'Multicolor',
    disclaimer:
      'Results vary by individual effort and circumstances. Not a substitute for professional therapy or medical advice. Content represents author opinions.',
  },
  {
    id: 76,
    name: 'Journal Set',
    price: 22.99,
    image:
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop&q=60',
    description:
      'Elegant set of 3 linen-bound journals with lay-flat binding and premium cream paper. Includes lined, dotted, and blank options perfect for writing, planning, and creative reflection.',
    category: 'books',
    weight: '3 x 120 pages',
    deliveryTime: 8,
    stock: 9,
    colour: 'White & Black',
    disclaimer:
      'Paper color may have slight cream tint for eye comfort. Binding designed for flat lay; handle gently. Ink bleed depends on pen type used.',
  },
  {
    id: 77,
    name: 'Photography Book',
    price: 39.99,
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60',
    description:
      'Stunning large-format coffee table book showcasing breathtaking landscape and nature photography. Features award-winning images from renowned photographers with behind-the-scenes commentary.',
    category: 'books',
    weight: '192 pages, Hardcover',
    deliveryTime: 12,
    stock: 11,
    colour: 'Multicolor',
    disclaimer:
      'Color reproduction may vary from original photographs. Heavy book; handle spine carefully. Store upright to prevent warping. Dust jacket included.',
  },
  {
    id: 78,
    name: 'History Book',
    price: 24.99,
    image:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&auto=format&fit=crop&q=60',
    description:
      'Captivating journey through pivotal moments in world history with rare archival photographs. Expertly researched narratives bring ancient civilizations and modern events vividly to life.',
    category: 'books',
    onSale: true,
    salePrice: 19.99,
    weight: '448 pages',
    deliveryTime: 10,
    stock: 8,
    colour: 'Multicolor',
    disclaimer:
      'Historical interpretations represent scholarly perspectives at time of publication. Archival photo quality varies. Content may include sensitive historical events.',
  },
  {
    id: 79,
    name: 'Science Fiction',
    price: 16.99,
    image:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60',
    description:
      "Award-winning space opera adventure that explores humanity's future among the stars. Epic storytelling with memorable characters, cutting-edge science concepts, and mind-bending plot twists.",
    category: 'books',
    weight: '352 pages',
    deliveryTime: 8,
    stock: 14,
    colour: 'Multicolor',
    disclaimer:
      'Science concepts are speculative fiction. Cover design may vary by print edition. Part of a series; previous books enhance but are not required.',
  },
  {
    id: 80,
    name: 'Business Guide',
    price: 29.99,
    image:
      'https://images.unsplash.com/photo-1553484771-371a605b060b?w=500&auto=format&fit=crop&q=60',
    description:
      'Essential entrepreneurship handbook covering startup strategy, funding, marketing, and scaling. Real-world case studies and templates from successful founders to accelerate your business growth.',
    category: 'books',
    weight: '288 pages',
    deliveryTime: 10,
    stock: 13,
    colour: 'White',
    disclaimer:
      'Business advice is general in nature; consult professionals for specific situations. Market conditions change; some strategies may need adaptation.',
  },
  {
    id: 81,
    name: 'Art Book',
    price: 44.99,
    image:
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60',
    description:
      'Comprehensive survey of modern and contemporary art movements with high-quality reproductions. Expert analysis of influential artists from Impressionism to Abstract Expressionism and beyond.',
    category: 'books',
    weight: '320 pages, Hardcover',
    deliveryTime: 15,
    stock: 6,
    colour: 'White',
    disclaimer:
      'Art reproduction colors may differ from originals due to printing limitations. Heavy book; requires careful handling. Artistic interpretations represent author perspective.',
  },
  {
    id: 82,
    name: 'Poetry Anthology',
    price: 18.99,
    image:
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop&q=60',
    description:
      'Beautifully curated collection of contemporary poetry from diverse voices around the world. Explores themes of love, nature, identity, and the human experience in evocative verse.',
    category: 'books',
    onSale: true,
    salePrice: 14.99,
    weight: '176 pages',
    deliveryTime: 8,
    stock: 13,
    colour: 'Multicolor',
    disclaimer:
      'Poetry content reflects individual poet perspectives. Some themes may be emotionally intense. Translations may differ from original language versions.',
  },
  {
    id: 83,
    name: 'Travel Guide',
    price: 21.99,
    image:
      'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?w=500&auto=format&fit=crop&q=60',
    description:
      'Comprehensive travel companion covering top destinations with detailed maps, local tips, and hidden gems. Includes accommodation recommendations, itineraries, and cultural insights for unforgettable trips.',
    category: 'books',
    weight: '512 pages',
    deliveryTime: 10,
    stock: 5,
    colour: 'Multicolor',
    disclaimer:
      'Travel information subject to change. Verify current prices, hours, and safety advisories before traveling. Maps are for reference only; use GPS for navigation.',
  },
  {
    id: 84,
    name: 'Fitness Book',
    price: 19.99,
    image:
      'https://plus.unsplash.com/premium_photo-1661379166116-01b8b5081653?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGZpdG5lc3MlMjBib29rfGVufDB8fDB8fHww',
    description:
      'Complete fitness guide with illustrated workout routines and science-based nutrition plans. Covers strength training, cardio, flexibility, and meal prep for sustainable health transformation.',
    category: 'books',
    weight: '240 pages',
    deliveryTime: 8,
    stock: 5,
    colour: 'Multicolor',
    disclaimer:
      'Consult physician before starting any exercise program. Results vary based on individual effort and body type. Nutrition advice is general; dietary needs vary.',
  },

  // ==================== TOYS (12 products) ====================
  {
    id: 85,
    name: 'Building Blocks',
    price: 29.99,
    image:
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&auto=format&fit=crop&q=60',
    description:
      'Colorful 150-piece building block set that sparks creativity and develops motor skills for ages 3+. Compatible with major brands, includes storage container for easy cleanup and organization.',
    category: 'toys',
    weight: 'Ages 3+, 150 pcs',
    deliveryTime: 10,
    stock: 11,
    colour: 'Multicolor',
    disclaimer:
      'Contains small parts; choking hazard for children under 3. Adult supervision recommended. Compatibility with other brands not guaranteed for all pieces.',
  },
  {
    id: 86,
    name: 'Plush Animal',
    price: 19.99,
    image:
      'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&auto=format&fit=crop&q=60',
    description:
      'Adorable soft brown teddy bear with premium plush fur and huggable design for all ages. Safety-tested with embroidered features and machine-washable for easy care and lasting cuddles.',
    category: 'toys',
    weight: 'All Ages, 30 cm',
    deliveryTime: 8,
    stock: 3,
    colour: 'Brown',
    disclaimer:
      'Surface wash or gentle machine wash. Air dry recommended. Fur may flatten with handling; gently brush to restore. Check seams periodically.',
  },
  {
    id: 87,
    name: 'Board Game',
    price: 34.99,
    image:
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500&auto=format&fit=crop&q=60',
    description:
      'Award-winning strategy board game that brings families together for exciting game nights. Easy to learn but challenging to master, perfect for 2-6 players ages 8 and up.',
    category: 'toys',
    onSale: true,
    salePrice: 27.99,
    weight: 'Ages 8+, 2-6 players',
    deliveryTime: 10,
    stock: 15,
    colour: 'Multicolor',
    disclaimer:
      'Contains small pieces; not suitable for children under 3. Average game time 30-60 minutes. Keep pieces organized; replacements may not be available.',
  },
  {
    id: 88,
    name: 'Art Supply Kit',
    price: 24.99,
    image:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=60',
    description:
      'Complete 100-piece art kit with colored pencils, markers, crayons, watercolors, and paper. Wooden carrying case keeps supplies organized while inspiring young artists to create masterpieces.',
    category: 'toys',
    weight: 'Ages 5+, 100 pcs',
    deliveryTime: 8,
    stock: 12,
    colour: 'Multicolor',
    disclaimer:
      'Non-toxic but not for oral use. Markers may stain fabrics and surfaces. Use protective covering on work surfaces. Adult supervision recommended.',
  },
  {
    id: 89,
    name: 'Remote Control Car',
    price: 44.99,
    image:
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=500&auto=format&fit=crop&q=60',
    description:
      'High-speed red RC car with responsive controls, LED headlights, and rechargeable battery. Durable design handles indoor and outdoor terrain for thrilling racing adventures.',
    category: 'toys',
    weight: 'Ages 6+, 1:18 scale',
    deliveryTime: 12,
    stock: 8,
    colour: 'Red',
    disclaimer:
      'Batteries included; charger included. Use only on flat, dry surfaces. Not water-resistant. Remote range approximately 30 meters. Adult supervision required.',
  },
  {
    id: 90,
    name: 'Puzzle 1000 Pieces',
    price: 17.99,
    image:
      'https://images.unsplash.com/photo-1710276965349-5f61f9c96aeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHV6emxlJTIwMTAwJTIwcGllY2VzfGVufDB8fDB8fHww',
    description:
      'Challenging 1000-piece jigsaw puzzle featuring a stunning landscape image with precision-cut pieces. Perfect relaxing activity for adults with quality printing and satisfying fit.',
    category: 'toys',
    onSale: true,
    salePrice: 13.99,
    weight: 'Ages 12+, 1000 pcs',
    deliveryTime: 8,
    stock: 3,
    colour: 'Multicolor',
    disclaimer:
      'Completed puzzle size approximately 70x50 cm. Image on box may differ slightly. Puzzle mat or frame sold separately. Missing piece replacement available.',
  },
  {
    id: 91,
    name: 'Play-Doh Set',
    price: 14.99,
    image:
      'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?w=500&auto=format&fit=crop&q=60',
    description:
      'Vibrant 8-color modeling compound set with fun shape cutters and molds included. Non-toxic formula safe for ages 2+, encourages sensory play and imaginative creativity.',
    category: 'toys',
    weight: 'Ages 2+, 8 colors',
    deliveryTime: 6,
    stock: 11,
    colour: 'Multicolor',
    disclaimer:
      'Non-toxic but not edible. Contains wheat; not suitable for children with gluten sensitivities. Reseal containers after use to prevent drying. May stain carpets.',
  },
  {
    id: 92,
    name: 'Dollhouse',
    price: 79.99,
    image:
      'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&auto=format&fit=crop&q=60',
    description:
      'Charming three-story wooden dollhouse with pink accents and 15 pieces of miniature furniture. Opens for easy access to all rooms, inspiring hours of imaginative pretend play.',
    category: 'toys',
    weight: 'Ages 3+, 60 cm tall',
    deliveryTime: 18,
    stock: 5,
    colour: 'Multicolor',
    disclaimer:
      'Assembly required; adult assembly recommended. Contains small furniture pieces; choking hazard for children under 3. Secure to wall if possible to prevent tipping.',
  },
  {
    id: 93,
    name: 'Science Kit',
    price: 32.99,
    image:
      'https://images.unsplash.com/photo-1619249722898-492c571615fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHV6emxlJTIwMTAwJTIwcGllY2VzfGVufDB8fDB8fHww',
    description:
      'STEM learning kit with 20 exciting experiments including volcano eruptions and crystal growing. Complete with materials, illustrated guide, and safety goggles for budding scientists ages 8+.',
    category: 'toys',
    onSale: true,
    salePrice: 26.99,
    weight: 'Ages 8+, 20 exps',
    deliveryTime: 10,
    stock: 12,
    colour: 'Multicolor',
    disclaimer:
      'Adult supervision required for all experiments. Wear included safety goggles. Some experiments use household items not included. Follow instructions carefully.',
  },
  {
    id: 94,
    name: 'Train Set',
    price: 54.99,
    image:
      'https://plus.unsplash.com/premium_photo-1723708910982-9b16181c373b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHRyYWluJTIwc2V0fGVufDB8fDB8fHww',
    description:
      'Classic 40-piece wooden train set with tracks, bridges, and scenic accessories in natural wood finish. Compatible with major brands, perfect for imaginative play and fine motor development.',
    category: 'toys',
    weight: 'Ages 3+, 40 pcs',
    deliveryTime: 12,
    stock: 12,
    colour: 'Multicolor',
    disclaimer:
      'Natural wood variations are normal. Compatibility with other brands may vary. Small parts; choking hazard for children under 3. Store in dry place.',
  },
  {
    id: 95,
    name: 'Toy Robot',
    price: 39.99,
    image:
      'https://plus.unsplash.com/premium_photo-1682124422909-13f3a1d0124e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dG95JTIwcm9ib3R8ZW58MHx8MHx8fDA%3D',
    description:
      'Interactive smart robot with voice recognition, programmable movements, and LED expressions. Responds to commands, dances to music, and teaches basic coding concepts for ages 5+.',
    category: 'toys',
    weight: 'Ages 5+, 25 cm',
    deliveryTime: 10,
    stock: 11,
    colour: 'White & Grey',
    disclaimer:
      'Requires AA batteries (not included). Voice recognition works best in quiet environments. App download may be required for programming features.',
  },
  {
    id: 96,
    name: 'Card Games Bundle',
    price: 21.99,
    image:
      'https://images.unsplash.com/photo-1541278107931-e006523892df?w=500&auto=format&fit=crop&q=60',
    description:
      'Classic card game collection featuring 4 family favorites in a premium red gift box. Includes instructions for timeless games perfect for travel, parties, and rainy day entertainment.',
    category: 'toys',
    weight: 'Ages 6+, 4 games',
    deliveryTime: 6,
    stock: 3,
    colour: 'Black & White',
    disclaimer:
      'Card games require 2+ players. Not suitable for children under 3 due to small cards. Store in dry place. Cards may wear with frequent use.',
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
export const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

export default products;
