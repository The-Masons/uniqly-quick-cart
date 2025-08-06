require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.DBNAME,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const createTables = () => {
  const tableQueries = [
    `CREATE TABLE IF NOT EXISTS names (
      name_id INT PRIMARY KEY,
      name_name TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS colors (
      color_id INT PRIMARY KEY,
      color_name TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS sizes (
      size_id INT PRIMARY KEY,
      size_name TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS products (
      product_id INT PRIMARY KEY,
      name_id INT,
      color_id INT,
      price INT,
      FOREIGN KEY (name_id) REFERENCES names,
      FOREIGN KEY (color_id) REFERENCES colors
    );`,
    `CREATE TABLE IF NOT EXISTS images (
      img_id INT PRIMARY KEY,
      img_url TEXT,
      product_id INT,
      isPrimary BOOLEAN,
      FOREIGN KEY (product_id) REFERENCES products
    );`,
    `CREATE TABLE IF NOT EXISTS products_sizes (
      product_id INT,
      size_id INT,
      quantity INT,
      FOREIGN KEY (product_id) REFERENCES products,
      FOREIGN KEY (size_id) REFERENCES sizes
    );`,
  ];

  return Promise.all((() => {
    const promises = [];
    for (let i = 0; i < 3; i += 1) {
      promises.push(pool.connect()
        .then((client) => client.query(tableQueries[i])
          .then(() => {
            client.release();
          })
          .catch((err) => {
            client.release();
            console.error(err.stack);
          })));
    }
    return promises;
  })())
    .then(() => pool.connect()
      .then((client) => client.query(tableQueries[3])
        .then(() => {
          client.release();
        })
        .catch((err) => {
          client.release();
          console.error(err.stack);
        })))
    .then(() => Promise.all((() => {
      const promises = [];
      for (let i = 4; i < tableQueries.length; i += 1) {
        promises.push(pool.connect()
          .then((client) => client.query(tableQueries[i])
            .then(() => {
              client.release();
            })
            .catch((err) => {
              client.release();
              console.error(err.stack);
            })));
      }
      return promises;
    })())).catch((err) => console.error(err));
};

const populateTwoField = (table, name, numRows) => {
  const queryText = `INSERT INTO ${table}s(${table}_id, ${table}_name) VALUES($1, $2)`;
  return Promise.all((() => {
    const promises = [];
    for (let i = 0; i < numRows; i += 1) {
      const entryName = `${name} ${i}`;
      promises.push(pool.connect()
        .then((client) => client.query(queryText, [i, entryName])
          .then(() => client.release())
          .catch((err) => {
            client.release();
            console.error(err.stack);
          })));
    }
    return promises;
  })());
};

const populateProducts = (numNames, numColors) => {
  const queryText = 'INSERT INTO products(product_id, name_id, color_id, price) VALUES($1, $2, $3, $4)';
  const numRows = numNames * numColors;
  return Promise.all((() => {
    const promises = [];
    for (let i = 0; i < numRows; i += 1) {
      promises.push(pool.connect()
        .then((client) => {
          client.query(
            queryText,
            [i, Math.floor(i / numColors), i % numColors, Math.floor(Math.random() * 10000)],
          )
            .then(() => client.release())
            .catch((err) => {
              client.release();
              console.error(err.stack);
            });
        }));
    }
    return promises;
  })());
};

const populateImages = (numRows) => {
  const queryText = 'INSERT INTO images(img_id, img_url, product_id, isPrimary) VALUES($1, $2, $3, $4)';
  return Promise.all((() => {
    const promises = [];
    for (let i = 0; i < numRows; i += 1) {
      promises.push(pool.connect()
        .then((client) => client.query(queryText, [i, 'https://placehold.co/250', i, true])
          .then(() => client.release())
          .catch((err) => {
            client.release();
            console.error(err.stack);
          })));
    }
    return promises;
  })());
};

const populateProdsSizes = (numProds, numSizes) => {
  const queryText = 'INSERT INTO products_sizes(product_id, size_id, quantity) VALUES($1, $2, $3)';
  return Promise.all((() => {
    const promises = [];
    for (let currProd = 0; currProd < numProds; currProd += 1) {
      for (let currSize = 0; currSize < numSizes; currSize += 1) {
        promises.push(pool.connect()
          .then((client) => client.query(
            queryText,
            [currProd, currSize, Math.floor(Math.random() * 150)],
          )
            .then(() => client.release())
            .catch((err) => {
              client.release();
              console.error(err);
            })));
      }
    }
    return promises;
  })());
};

const initDB = () => createTables()
  .then(() => populateTwoField('name', 'Product Name', 25))
  .then(() => populateTwoField('color', 'Color', 4))
  .then(() => populateTwoField('size', 'Size', 5))
  .then(() => populateProducts(25, 4))
  .then(() => populateImages(100))
  .then(() => populateProdsSizes(100, 5))
  .then(() => console.log('All tables populated'))
  .catch((err) => console.error(err));

module.exports.createTables = createTables;
module.exports.populateTwoField = populateTwoField;
module.exports.populateProducts = populateProducts;
module.exports.populateImages = populateImages;
module.exports.populateProdsSizes = populateProdsSizes;
module.exports.initDB = initDB;

initDB();
