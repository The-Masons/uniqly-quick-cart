require('dotenv').config();
const fastify = require('fastify')({
  logger: true,
});
const path = require('path');
const db = require('../db/index');

const hostname = `http://${process.env.HOSTNAME}` || 'http://localhost';
const port = process.env.PORT || 3001;

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, '/../public'),
  prefix: '/../public/',
});

fastify.get('/styles.css', (req, res) => {
  res
    .code(200)
    .headers({
      'Access-Control-Allow-Origin': hostname,
      'Content-Type': 'test/css',
    })
    .sendFile('styles.css');
});

fastify.get('/reset.css', (req, res) => {
  res
    .code(200)
    .headers({
      'Access-Control-Allow-Origin': hostname,
      'Content-Type': 'test/css',
    })
    .sendFile('reset.css');
});

fastify.get('/bundle.js', (req, res) => {
  res
    .code(200)
    .headers({
      'Access-Control-Allow-Origin': hostname,
      'Content-Type': 'test/javascript',
    })
    .sendFile('bundle.js');
});

fastify.get('/', (req, res) => {
  res
    .code(302)
    .headers({
      'Access-Control-Allow-Origin': hostname,
      Location: '/product/0',
    })
    .redirect('/product/0');
});

fastify.get('/product/:productId', (req, res) => {
  res
    .code(200)
    .headers({
      'Access-Control-Allow-Origin': hostname,
      'Content-Type': 'text/html',
    })
    .sendFile('index.html');
});

fastify.get('/product/:productId/sizes_qtys', (req, res) => {
  db.query(`
    SELECT sizes.size_name, products_sizes.quantity FROM
      (sizes INNER JOIN products_sizes ON sizes.size_id = products_sizes.size_id)
      WHERE products_sizes.product_id = $1 ORDER BY sizes.size_name;
    `, [req.params.productId], (err, data) => {
    if (err) {
      console.log('Please run "node ./data/init.js" to seed the database.');
      if (err.code === '42P01') {
        res
          .code(200)
          .headers({
            'Access-Control-Allow-Origin': hostname,
            'Content-Type': 'application/json',
          })
          .send([{ size_name: 'Database empty.', quantity: 0 }]);
      } else {
        console.error(err);
        res
          .code(500)
          .headers({
            'Access-Control-Allow-Origin': hostname,
            'Content-Type': 'application/json',
          })
          .send(err);
      }
    } else {
      res
        .code(200)
        .headers({
          'Access-Control-Allow-Origin': hostname,
          'Content-Type': 'application/json',
        })
        .send(data);
    }
  });
});

fastify.get('/product/:productId/addtocart', (req, res) => {
  db.query(`
    SELECT images.img_url, names.name_name, colors.color_name, products.price FROM
      (((products INNER JOIN colors ON products.color_id = colors.color_id)
      INNER JOIN names ON products.name_id = names.name_id)
      INNER JOIN images ON products.product_id = images.product_id)
      WHERE products.product_id = $1 AND images.isPrimary = true;
    `, [req.params.productId], (err, data) => {
    if (err) {
      if (err.code === '42P01') {
        console.log('Please run "node ./data/init.js" to seed the database.');
        res.set({
          'Access-Control-Allow-Origin': hostname,
          'Content-Type': 'application/json',
        });
        res
          .code(200)
          .headers({
            'Access-Control-Allow-Origin': hostname,
            'Content-Type': 'application/json',
          })
          .send([{ size_name: 'Database empty.', quantity: 0 }]);
      } else {
        console.error(err);
        res
          .code(500)
          .headers({
            'Access-Control-Allow-Origin': hostname,
            'Content-Type': 'application/json',
          })
          .send(err);
      }
    } else {
      res
        .code(200)
        .headers({
          'Access-Control-Allow-Origin': hostname,
          'Content-Type': 'application/json',
        })
        .send(data);
    }
  });
});

fastify.listen({ port }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`App listening on ${hostname}:${port}`);
});
