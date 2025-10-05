const { Pool } = require('pg');
const initScripts = require('./init.lib.js');

jest.mock('pg');

beforeEach(() => {
  Pool.prototype.connect.mockClear();
  Pool.prototype.mockQuery.mockClear();
  Pool.prototype.mockRelease.mockClear();
});

describe('createTables', () => {
  test('should query the db to create each table', () => {
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

    const pool = new Pool();
    const poolConnect = Pool.prototype.connect;
    const clientQuery = Pool.prototype.mockQuery;

    return initScripts.createTables().then(() => {
      expect(poolConnect).toHaveBeenCalledTimes(6);
      for (let i = 0; i < tableQueries.length; i += 1) {
        expect(clientQuery.mock.calls[i][0].split(' ').filter((word) => word !== ''))
          .toEqual(tableQueries[i].split(' ').filter((word) => word !== ''));
      }
    });
  });

  test('should release all clients back into the pool', () => {
    const pool = new Pool();
    const clientRelease = Pool.prototype.mockRelease;

    return initScripts.createTables().then(() => expect(clientRelease).toHaveBeenCalledTimes(6));
  });
});

describe('populateTwoField', () => {
  test('should correctly query the db to create rows', () => {
    const pool = new Pool();
    const clientQuery = Pool.prototype.mockQuery;

    return initScripts.populateTwoField('foo', 'bar', 1).then(() => expect(clientQuery)
      .toHaveBeenCalledWith('INSERT INTO foos(foo_id, foo_name) VALUES($1, $2)', [0, 'bar 0']));
  });

  test('should query the db the correct amount of times', () => {
    const pool = new Pool();
    const clientQuery = Pool.prototype.mockQuery;

    return initScripts.populateTwoField('foo', 'bar', 10).then(() => expect(clientQuery).toHaveBeenCalledTimes(10));
  });

  test('should release all clients back into the pool', () => {
    const pool = new Pool();
    const clientRelease = Pool.prototype.mockRelease;

    return initScripts.populateTwoField('foo', 'bar', 10).then(() => expect(clientRelease).toHaveBeenCalledTimes(10));
  });
});

describe('populateProducts', () => {
  test('should correctly query the db to create rows', () => {
    const pool = new Pool();
    const clientQuery = Pool.prototype.mockQuery;
    const queryText = 'INSERT INTO products(product_id, name_id, color_id, price) VALUES($1, $2, $3, $4)';
    Math.random = jest.fn().mockReturnValue(1);

    return initScripts.populateProducts(1, 1).then(() => expect(clientQuery)
      .toHaveBeenCalledWith(queryText, [0, 0, 0, 10000]));
  });

  test('should query the db the correct amount of times', () => {
    const pool = new Pool();
    const clientQuery = Pool.prototype.mockQuery;

    return initScripts.populateProducts(10, 3).then(() => expect(clientQuery).toHaveBeenCalledTimes(30));
  });

  test('should release all clients back into the pool', () => {
    const pool = new Pool();
    const clientRelease = Pool.prototype.mockRelease;

    return initScripts.populateProducts(10, 3).then(() => expect(clientRelease).toHaveBeenCalledTimes(30));
  });
});

describe('populateImages', () => {
  test('should correctly query the db to create rows', () => {
    const pool = new Pool();
    const clientQuery = Pool.prototype.mockQuery;
    const queryText = 'INSERT INTO images(img_id, img_url, product_id, isPrimary) VALUES($1, $2, $3, $4)';

    return initScripts.populateImages(1).then(() => expect(clientQuery)
      .toHaveBeenCalledWith(queryText, [0, 'https://placehold.co/250', 0, true]));
  });

  test('should query the db the correct amount of times', () => {
    const pool = new Pool();
    const clientQuery = Pool.prototype.mockQuery;

    return initScripts.populateImages(15).then(() => expect(clientQuery).toHaveBeenCalledTimes(15));
  });

  test('should release all clients back into the pool', () => {
    const pool = new Pool();
    const clientRelease = Pool.prototype.mockRelease;

    return initScripts.populateImages(15).then(() => expect(clientRelease).toHaveBeenCalledTimes(15));
  });
});

describe('populateProdsSizes', () => {
  test('should correctly query the db to create rows', () => {
    const pool = new Pool();
    const clientQuery = Pool.prototype.mockQuery;
    const queryText = 'INSERT INTO products_sizes(product_id, size_id, quantity) VALUES($1, $2, $3)';
    Math.random = jest.fn().mockReturnValue(1);

    return initScripts.populateProdsSizes(1, 1).then(() => expect(clientQuery)
      .toHaveBeenCalledWith(queryText, [0, 0, 150]));
  });

  test('should query the db the correct amount of times', () => {
    const pool = new Pool();
    const clientQuery = Pool.prototype.mockQuery;

    return initScripts.populateProdsSizes(10, 2).then(() => expect(clientQuery).toHaveBeenCalledTimes(20));
  });
  test('should release all clients back into the pool', () => {
    const pool = new Pool();
    const clientRelease = Pool.prototype.mockRelease;

    return initScripts.populateProdsSizes(10, 2).then(() => expect(clientRelease).toHaveBeenCalledTimes(20));
  });
});
