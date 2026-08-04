'use strict';
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const db = require('../models');
const {
  transactions_status,
  admin,
  users,
  profiles,
  category,
  branch_store,
  products,
  products_detail,
  products_image,
  branch_products,
  discounts,
  discount_category,
} = db;

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await transactions_status.bulkCreate([
      { status_name: 'Waiting for Payment' },
      { status_name: 'Waiting for Confirmation' },
      { status_name: 'Payment Confirmed' },
      { status_name: 'Delivery' },
      { status_name: 'Completed' },
      { status_name: 'Cancelled' },
    ]);

    const adminPassword = await bcrypt.hash('admin123', 10);
    const newAdmin = await admin.create({
      email: 'admin@gamepedia.com',
      password: adminPassword,
      role: 'super admin',
    });

    const userPassword = await bcrypt.hash('demo123', 10);
    const demoUser = await users.create({
      username: 'demo',
      email: 'demo@gamepedia.com',
      password: userPassword,
      phone_number: '081234567890',
      status: 'Confirmed',
    });
    await profiles.create({ user_id: demoUser.id });

    const cats = {
      ps5: await category.create({ category: 'PlayStation 5', type: 'Console' }),
      ps4: await category.create({ category: 'PlayStation 4', type: 'Console' }),
      switch: await category.create({ category: 'Nintendo Switch', type: 'Console' }),
      pc: await category.create({ category: 'PC', type: 'Console' }),
      accessory: await category.create({ category: 'Accessories', type: 'Accessory' }),
    };

    const store1 = await branch_store.create({ admin_id: newAdmin.id, branch_name: 'Gamepedia Central Jakarta', address: 'Jl. Sudirman No. 1', city: 'Jakarta Pusat', province: 'DKI Jakarta', longitude: '106.816666', latitude: '-6.200000' });
    const store2 = await branch_store.create({ admin_id: newAdmin.id, branch_name: 'Gamepedia Bandung', address: 'Jl. Asia Afrika No. 8', city: 'Bandung', province: 'Jawa Barat', longitude: '107.619123', latitude: '-6.917464' });
    const store3 = await branch_store.create({ admin_id: newAdmin.id, branch_name: 'Gamepedia Surabaya', address: 'Jl. Tunjungan No. 1', city: 'Surabaya', province: 'Jawa Timur', longitude: '112.752088', latitude: '-7.257472' });

    const productList = [
      { name: 'Animal Crossing: New Horizons', category: 'switch', image: 'animal-crossing-switch.jpg', price: '599000', desc: 'Escape to your own island paradise in this beloved life simulation game.' },
      { name: 'Call of Duty: Modern Warfare II', category: 'ps5', image: 'cod-mw2-ps5.jpg', price: '899000', desc: 'The iconic Call of Duty franchise returns with an explosive new campaign.' },
      { name: 'Final Fantasy VII Remake', category: 'ps4', image: 'ff7-remake-ps4.jpg', price: '799000', desc: 'Revisit the legendary RPG classic with stunning modern visuals.' },
      { name: 'FIFA 23', category: 'ps4', image: 'fifa23-ps4.jpg', price: '699000', desc: "The world's game, brought to life with hypermotion technology." },
      { name: 'FIFA 23', category: 'ps5', image: 'fifa23-ps5.jpg', price: '799000', desc: "The world's game, brought to life with hypermotion technology." },
      { name: 'GTA V Premium Edition', category: 'pc', image: 'gta5-premium-pc.jpg', price: '350000', desc: 'Grand Theft Auto V with the full Criminal Enterprise starter pack.' },
      { name: 'The Legend of Zelda: Breath of the Wild', category: 'switch', image: 'legend-of-zelda-switch.jpg', price: '650000', desc: 'Explore the vast kingdom of Hyrule in this open-world masterpiece.' },
      { name: "Marvel's Midnight Suns", category: 'ps5', image: 'marvel-midnight-sun.jpg', price: '750000', desc: 'Lead a legendary squad of Marvel heroes in tactical combat.' },
      { name: 'Minecraft', category: 'switch', image: 'minecraft-switch.jpg', price: '450000', desc: 'Create, explore, and survive in a world made entirely of blocks.' },
      { name: 'eFootball PES 2021', category: 'ps4', image: 'pes2021-ps4.jpg', price: '450000', desc: 'The beautiful game returns with realistic gameplay and licensed teams.' },
      { name: 'Pokemon Legends: Arceus', category: 'switch', image: 'pokemon-legends-switch.jpg', price: '700000', desc: "Forge a new path in the Sinnoh region's ancient past." },
      { name: 'PlayStation 5 Console', category: 'ps5', image: 'ps5.jpg', price: '8000000', desc: 'Experience lightning-fast loading with the PS5 console.' },
      { name: 'PlayStation 4 Slim Console', category: 'ps4', image: 'ps4.jpg', price: '4000000', desc: 'The best-selling console with an incredible library of games.' },
      { name: 'Red Dead Redemption 2', category: 'ps4', image: 'red-dead-redemption-ps4.jpg', price: '550000', desc: 'An epic tale of honor and loyalty set in the American frontier.' },
      { name: 'Spider-Man: Miles Morales', category: 'ps5', image: 'spiderman-miles-ps5.jpg', price: '850000', desc: 'Suit up as Miles Morales in an all-new Spider-Man adventure.' },
      { name: 'Sony PS5 Wireless Headset', category: 'accessory', image: 'sony-ps5-wireless-headset.jpg', price: '1500000', desc: 'Immersive 3D audio with a comfortable, wireless design.' },
      { name: 'Story of Seasons: A Wonderful Life', category: 'ps5', image: 'story-of-season-ps5.jpg', price: '600000', desc: 'Live a peaceful life on a farm in this charming life-sim RPG.' },
      { name: 'Nintendo Switch OLED', category: 'switch', image: 'switch-oled.jpg', price: '4500000', desc: 'The Nintendo Switch OLED model with a vibrant 7-inch OLED screen.' },
      { name: 'Fire Emblem: Three Houses', category: 'switch', image: 'three-houses-switch.jpg', price: '650000', desc: 'Command an elite academy and lead your house to victory.' },
      { name: 'PXN Racing Controller', category: 'accessory', image: 'pxn-controller.png', price: '350000', desc: 'Ergonomic wired controller compatible with PC and consoles.' },
    ];

    for (const p of productList) {
      const product = await products.create({ products_name: p.name, category_id: cats[p.category].id });
      await products_detail.create({ product_id: product.id, desc: p.desc, price: p.price });
      await products_image.create({ product_id: product.id, url: p.image });
      await branch_products.create({ branch_id: store1.id, product_id: product.id, stock: 25 });
      await branch_products.create({ branch_id: store2.id, product_id: product.id, stock: 20 });
      await branch_products.create({ branch_id: store3.id, product_id: product.id, stock: 15 });
    }

    const discountedProducts = await products.findAll({
      where: {
        products_name: {
          [Op.in]: ['Animal Crossing: New Horizons', 'The Legend of Zelda: Breath of the Wild', 'Minecraft'],
        },
      },
    });

    for (const product of discountedProducts) {
      const discount = await discounts.create({
        name: 'Switch Sale',
        type: 'percent',
        voucher_value: '10',
        expiry_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        admin_id: newAdmin.id,
        product_id: product.id,
      });
      await discount_category.create({
        discount_id: discount.id,
        discount_name: 'Switch Sale',
        discount_type: 'percent',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transactions_statuses', null, {});
    await queryInterface.bulkDelete('discount_categories', null, {});
    await queryInterface.bulkDelete('discounts', null, {});
    await queryInterface.bulkDelete('branch_products', null, {});
    await queryInterface.bulkDelete('products_images', null, {});
    await queryInterface.bulkDelete('products_details', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('branch_stores', null, {});
    await queryInterface.bulkDelete('profiles', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('admins', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};
