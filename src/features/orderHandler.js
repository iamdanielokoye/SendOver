const { Client } = require('pg');
const { Markup } = require('telegraf');
require('dotenv').config();

// PostgreSQL client setup
const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT || 5432,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});

client.connect();  // Ensure the client is connected

const dummyPackages = [
    { id: 1, name: "Package A - Electronics" },
    { id: 2, name: "Package B - Groceries" },
    { id: 3, name: "Package C - Clothing" },
    { id: 4, name: "Package D - Furniture" },
    { id: 5, name: "Package E - Books" },
];

const userSelections = {};

const showPackages = (userId) => {
    const buttons = dummyPackages.map(pkg => {
        const isSelected = userSelections[userId] === pkg.id;
        return [
            Markup.button.callback(
                `${pkg.name} (ID: ${pkg.id})`, 
                isSelected ? `disabled_${pkg.id}` : `order_${pkg.id}`
            )
        ];
    });
    return Markup.inlineKeyboard(buttons);
};

// Handle order selection and insert into the PostgreSQL database
const handleOrder = async (userId, packageId, packageName) => {
    const orderId = `ORD-${Date.now()}`;
  
    const query = 'INSERT INTO orders (order_id, user_id, package_name) VALUES ($1, $2, $3)';
    const values = [orderId, userId, packageName];
  
    try {
      // Insert order into PostgreSQL
      await client.query(query, values);
      
      // Return the order confirmation string
      return `Your order has been placed successfully! Your tracking ID (Order ID) is: ${orderId}`;
    } catch (error) {
      console.error("Error inserting order into PostgreSQL:", error);
      return "Failed to place the order. Please try again.";
    }
  };
  

module.exports = { showPackages, handleOrder, dummyPackages };
