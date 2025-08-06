const Pool = jest.genMockFromModule('pg-pool');

const mockQuery = jest.fn().mockReturnValue(new Promise((resolve) => resolve()));

const mockRelease = jest.fn();

const connect = jest.fn().mockReturnValue(new Promise((resolve) => resolve({
  query: mockQuery,
  release: mockRelease,
})));

const query = jest.fn().mockReturnValue(new Promise((resolve) => resolve()));

Pool.prototype.query = query;
Pool.prototype.connect = connect;
Pool.prototype.mockQuery = mockQuery;
Pool.prototype.mockRelease = mockRelease;

module.exports = Pool;
