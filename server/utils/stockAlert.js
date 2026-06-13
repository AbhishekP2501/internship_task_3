const Inventory = require('../models/Inventory');
const sendEmail = require('./sendEmail');

const checkStockAndAlert = async () => {
  try {
    const threshold = parseInt(process.env.STOCK_THRESHOLD) || 20;
    const lowStockItems = await Inventory.find({ quantity: { $lt: threshold } });

    if (lowStockItems.length === 0) return;

    const itemsList = lowStockItems
      .map(item => `<tr>
        <td style="padding: 8px 16px; border-bottom: 1px solid #333;">${item.name}</td>
        <td style="padding: 8px 16px; border-bottom: 1px solid #333;">${item.category}</td>
        <td style="padding: 8px 16px; border-bottom: 1px solid #333; color: ${item.quantity < 10 ? '#ef4444' : '#f59e0b'}; font-weight: bold;">${item.quantity}</td>
      </tr>`)
      .join('');

    const html = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #ff6b35, #ff8c42); padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #fff; font-size: 24px;">⚠️ Low Stock Alert</h1>
        </div>
        <div style="padding: 24px;">
          <p>The following items have fallen below the threshold of <strong>${threshold} units</strong>:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <thead>
              <tr style="background: #16213e;">
                <th style="padding: 8px 16px; text-align: left;">Item</th>
                <th style="padding: 8px 16px; text-align: left;">Category</th>
                <th style="padding: 8px 16px; text-align: left;">Remaining</th>
              </tr>
            </thead>
            <tbody>${itemsList}</tbody>
          </table>
          <p style="color: #888; font-size: 14px;">Please restock these items to avoid order fulfillment issues.</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `🚨 Low Stock Alert — ${lowStockItems.length} item(s) below threshold`,
      html,
    });

    console.log(`⚠️ Stock alert sent for ${lowStockItems.length} items`);
  } catch (error) {
    console.error('Stock alert error:', error);
  }
};

module.exports = checkStockAndAlert;
