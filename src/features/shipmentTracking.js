// Mock tracking data (this would be replaced by real data)
const shipments = {
    '12345': { status: 'In transit', location: 'New York, USA' },
    '67890': { status: 'Delivered', location: 'Lagos, Nigeria' },
  };
  
  // Function to track shipment by serial number
  async function trackShipment(serialNumber) {
    const shipment = shipments[serialNumber];
    if (shipment) {
      return `Your shipment with serial number ${serialNumber} is currently ${shipment.status} at ${shipment.location}.`;
    } else {
      return `Sorry, we couldn't find any information for shipment ${serialNumber}.`;
    }
  }
  
  module.exports = { trackShipment };
  