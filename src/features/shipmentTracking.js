const { Client } = require('pg'); // PostgreSQL client

// Assuming the database connection is already established in another file

// Function to get the shipment status from the database
const getShipmentStatus = async (orderId) => {
  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT || 5432,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT status FROM orders WHERE order_id = $1', [orderId]);

    if (res.rows.length === 0) {
      return `No order found with the Order ID: ${orderId}. Please check and try again.`;
    }

    const status = res.rows[0].status;
    return `The current status of your order (ID: ${orderId}) is: ${status}.`;
  } catch (error) {
    console.error('Error tracking shipment:', error);
    return 'Failed to retrieve shipment status. Please try again later.';
  } finally {
    await client.end();
  }
};

module.exports = { getShipmentStatus };
