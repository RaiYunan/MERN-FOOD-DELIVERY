import 'dotenv/config'
import connectDB from '../config/db.js'
import Product from '../models/product.model.js'
import User from '../models/user.model.js'

const products = [
  {
    name: 'Chicken Momo',
    description: 'Steamed dumplings filled with minced chicken, onion, garlic and spices, served with tomato achar',
    price: 180,
    category: 'appetizer',
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f',
  },
  {
    name: 'Veg Momo',
    description: 'Steamed dumplings filled with cabbage, carrot and paneer, served with sesame achar',
    price: 150,
    category: 'appetizer',
    image: 'https://images.unsplash.com/photo-1601314002957-dd1a8c7b25e7',
  },
  {
    name: 'Chicken Chow Mein',
    description: 'Stir-fried noodles with chicken, cabbage, carrot and spring onion, Nepali street-style',
    price: 220,
    category: 'main_course',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce',
  },
  {
    name: 'Dal Bhat Set',
    description: 'Steamed rice with lentil soup, mixed vegetable curry, pickle and papad',
    price: 250,
    category: 'main_course',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7',
  },
  {
    name: 'Chicken Sekuwa',
    description: 'Smoky grilled marinated chicken cubes served with beaten rice and pickle',
    price: 350,
    category: 'main_course',
    image: 'https://images.unsplash.com/photo-1633237308525-cd0a488f7c44',
  },
  {
    name: 'Newari Khaja Set',
    description: 'Traditional Newari platter with chiura, choila, bara, aloo achar and more',
    price: 450,
    category: 'main_course',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7',
  },
  {
    name: 'Sel Roti',
    description: 'Traditional ring-shaped sweet rice bread, deep fried, crispy outside and soft inside',
    price: 60,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1601001435957-04a05e0a9e0d',
  },
  {
    name: 'Juju Dhau',
    description: 'King curd from Bhaktapur — thick, creamy and sweet traditional yogurt',
    price: 120,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
  },
  {
    name: 'Masala Chiya',
    description: 'Hot Nepali milk tea brewed with cardamom, ginger and cinnamon',
    price: 40,
    category: 'beverage',
    image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2',
  },
  {
    name: 'Lassi',
    description: 'Chilled sweet yogurt-based drink, refreshing and creamy',
    price: 90,
    category: 'beverage',
    image: 'https://images.unsplash.com/photo-1571805341302-9a04203f7b9c',
  },
  {
    name: 'Buff Burger',
    description: 'Grilled buffalo meat patty burger with fresh veggies and Nepali-style spicy mayo',
    price: 200,
    category: 'fast_food',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
  },
  {
    name: 'Chatpate',
    description: 'Spicy and tangy puffed rice mix with potato, onion, tomato, and Nepali spices',
    price: 80,
    category: 'fast_food',
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a',
  },
]

const seedProducts = async () => {
  await connectDB()

  const admin = await User.findOne({ role: 'admin' })
  if (!admin) {
    console.log('No admin user found. Run seedAdmin.js first.')
    process.exit()
  }

  await Product.deleteMany() // optional: clear existing products

  const withCreator = products.map((p) => ({ ...p, createdBy: admin._id }))
  await Product.insertMany(withCreator)

  console.log(`${products.length} products seeded`)
  process.exit()
}

seedProducts()