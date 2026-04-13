const admin = require('firebase-admin');
const serviceAccount = require('c:/Users/GeekNest/Downloads/zuricartshop-firebase-adminsdk-fbsvc-63801f48dc.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const mockProducts = [
  {
    name: "Classic Organic Onesie",
    price: 25.00,
    category: "Clothes",
    ageMonths: "0-6",
    ageYears: "0",
    color: "White",
    weight: "3-5kg",
    image: "/images/hero1.png",
    description: "Soft organic cotton onesie for maximum comfort.",
    stock: 45,
    status: "available"
  },
  {
    name: "Soft Steps Crib Shoes",
    price: 35.00,
    category: "Shoes",
    ageMonths: "6-12",
    ageYears: "1",
    color: "Black",
    weight: "0.2kg",
    image: "/images/hero2.png",
    description: "Anti-slip shoes for those first important steps.",
    stock: 12,
    status: "available"
  },
  {
    name: "Wooden Building Blocks",
    price: 18.50,
    category: "Toys",
    ageMonths: "12-24",
    ageYears: "2",
    color: "Natural",
    weight: "1kg",
    image: "/images/hero3.png",
    description: "Eco-friendly wooden blocks for creative play.",
    stock: 0,
    status: "out of stock"
  },
  {
    name: "Premium Baby Stroller",
    price: 450.00,
    category: "Equipment",
    ageMonths: "0-36",
    ageYears: "3",
    color: "Black",
    weight: "12kg",
    image: "/images/hero1.png",
    description: "High-end stroller with multi-terrain wheels.",
    stock: 5,
    status: "available"
  },
  {
    name: "Ultra-Soft Diapers (Pack of 50)",
    price: 22.00,
    category: "Pampers",
    ageMonths: "3-12",
    ageYears: "1",
    color: "White",
    weight: "5-10kg",
    image: "/images/hero2.png",
    description: "Hypoallergenic diapers with leak protection.",
    stock: 100,
    status: "available"
  },
  {
    name: "Designer Travel Suitcase",
    price: 85.00,
    category: "Suitcases",
    ageMonths: "24+",
    ageYears: "4",
    color: "Grey",
    weight: "2.5kg",
    image: "/images/hero3.png",
    description: "Compact suitcase for all baby essentials.",
    stock: 20,
    status: "available"
  }
];

const mockPayments = [
  { name: 'MTN MoMo', code: '*182*8*1*2054917#', owner: 'Christella', type: 'USSD' },
  { name: 'Direct Bank Transfer', code: 'BK: 0000 0000 0000 0000', owner: 'ZURI CART LTD', type: 'Bank' },
];

async function seed() {
  try {
    for (const prod of mockProducts) {
      await db.collection('products').add(prod);
      console.log('Added product:', prod.name);
    }
    for (const pay of mockPayments) {
      await db.collection('paymentChannels').add(pay);
      console.log('Added payment channel:', pay.name);
    }
    console.log('Database seeded successfully.');
  } catch (err) {
    console.error('Error seeding DB:', err);
  } finally {
    process.exit(0);
  }
}

seed();
