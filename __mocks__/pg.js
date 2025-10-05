const pg = jest.createMockFromModule('pg');

const mockQuery = jest.fn().mockReturnValue(new Promise((resolve) => resolve()));

const mockRelease = jest.fn();

const connect = jest.fn().mockReturnValue(new Promise((resolve) => resolve({
  query: mockQuery,
  release: mockRelease,
})));

const query = jest.fn().mockReturnValue(new Promise((resolve) => resolve()));

pg.Pool.prototype.query = query;
pg.Pool.prototype.connect = connect;
pg.Pool.prototype.mockQuery = mockQuery;
pg.Pool.prototype.mockRelease = mockRelease;

module.exports = pg;
