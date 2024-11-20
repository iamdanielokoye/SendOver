const { Markup } = require('telegraf');

// Dummy packages
const dummyPackages = [
    { id: 1, name: "Package A - Electronics" },
    { id: 2, name: "Package B - Groceries" },
    { id: 3, name: "Package C - Clothing" },
    { id: 4, name: "Package D - Furniture" },
    { id: 5, name: "Package E - Books" },
];

// Function to create inline keyboard for packages
const showPackages = () => {
    const buttons = dummyPackages.map(pkg =>
        [Markup.button.callback(`${pkg.name} (ID: ${pkg.id})`, `order_${pkg.id}`)]
    );
    return Markup.inlineKeyboard(buttons);
};

// Handle order selection
const handleOrder = (packageId) => {
    const selectedPackage = dummyPackages.find(pkg => pkg.id === parseInt(packageId, 10));
    if (!selectedPackage) {
        return "Invalid package selection. Please choose a valid package.";
    }
    const orderId = `ORD-${Date.now()}`;
    return `Order successful! You have ordered: ${selectedPackage.name}. Your order ID is ${orderId}. Thank you for using SendOver!`;
};

module.exports = { showPackages, handleOrder };
