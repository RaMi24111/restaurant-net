const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define Schema here to avoid dependency issues during seed
const menuItemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String, // URL to image
  category: { type: String, required: true, enum: ['Beverages', 'Veg', 'Non-Veg', "Today's Special"] },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/restaurant_db";

const seedData = [
    // BEVERAGES
    {
        name: "Classic Espresso",
        price: 150,
        description: "Rich and bold single shot espresso from premium Arabica beans.",
        image: "https://images.unsplash.com/photo-1510707577739-18817549320b?w=800&q=80",
        category: "Beverages"
    },
    {
        name: "Cappuccino Art",
        price: 220,
        description: "Creamy steamed milk poured over rich espresso, topped with foam art.",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80",
        category: "Beverages"
    },
    {
        name: "Fresh Mint Mojito",
        price: 180,
        description: "Refreshing mocktail with crushed mint, lime, and sparkling soda.",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80",
        category: "Beverages"
    },
    {
        name: "Iced Peach Tea",
        price: 160,
        description: "Chilled black tea infused with natural peach flavor and ice.",
        image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=800&q=80",
        category: "Beverages"
    },

    // VEG
    {
        name: "Paneer Tikka Masala",
        price: 350,
        description: "Marinated cottage cheese cubes grilled and cooked in spicy gravy.",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
        category: "Veg"
    },
    {
        name: "Vegetable Biryani",
        price: 280,
        description: "Aromatic basmati rice cooked with mixed vegetables and exotic spices.",
        image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80",
        category: "Veg"
    },
    {
        name: "Creamy Alfredo Pasta",
        price: 320,
        description: "Penne pasta tossed in rich white cream sauce with mushrooms and broccoli.",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
        category: "Veg"
    },
    {
        name: "Greek Salad",
        price: 250,
        description: "Fresh cucumbers, tomatoes, olives, and feta cheese with olive oil dressing.",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
        category: "Veg"
    },

    // NON-VEG
    {
        name: "Butter Chicken",
        price: 450,
        description: "Tender chicken cooked in a rich, buttery tomato sauce.",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80",
        category: "Non-Veg"
    },
    {
        name: "Grilled Salmon",
        price: 650,
        description: "Fresh salmon fillet grilled to perfection with lemon butter sauce.",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=800&q=80",
        category: "Non-Veg"
    },
    {
        name: "Chicken Tikka Skewers",
        price: 380,
        description: "Spicy marinated chicken chunks grilled in a traditional clay oven.",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80",
        category: "Non-Veg"
    },
    {
        name: "Lamb Rogan Josh",
        price: 550,
        description: "Slow-cooked lamb in a flavorful Kashmiri spice gravy.",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356f36?w=800&q=80",
        category: "Non-Veg"
    },

    // TODAY'S SPECIAL
    {
        name: "Chef's Signature Lobster",
        price: 1200,
        description: "Whole fresh lobster prepared with the chef's secret herbs and spices.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
        category: "Today's Special"
    },
    {
        name: "Wagyu Beef Steak",
        price: 2500,
        description: "Premium Japanese Wagyu beef steak, melt-in-your-mouth texture.",
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80",
        category: "Today's Special"
    },
    {
        name: "Truffle Mushroom Risotto",
        price: 850,
        description: "Creamy arborio rice cooked with black truffles and parmesan.",
        image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
        category: "Today's Special"
    },
    {
        name: "Saffron Royal Dessert",
        price: 400,
        description: "A rich pudding infused with premium saffron and pistachios.",
        image: "https://images.unsplash.com/photo-1551024601-5637ade9b8df?w=800&q=80",
        category: "Today's Special"
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        await MenuItem.deleteMany({});
        console.log('Cleared existing menu items');

        await MenuItem.insertMany(seedData);
        console.log('Seeded new menu items');

        process.exit(0);
    } catch (error) {
        console.error('Seed Error:', error);
        process.exit(1);
    }
}

seed();
