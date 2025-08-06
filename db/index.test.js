const Pool = require('pg-pool');
const db = require('./index.js');

jest.mock('pg-pool');

beforeEach(() => {
  Pool.mockClear();
  Pool.prototype.query.mockClear();
});

describe('query', () => {
  test('should correctly query the db', () => {
    const pool = new Pool();
    const poolQuery = Pool.prototype.query;
    const expectedQuery = 'SELECT foo FROM bar';

    return db.query(expectedQuery, [], () => {}).then(() => expect(poolQuery.mock.calls[0][0].split(' ').filter((word) => word !== ''))
      .toEqual(expectedQuery.split(' ').filter((word) => word !== ''), [0]));
  });

  test('should invoke a callback on the returned data', () => {
    const pool = new Pool();
    const mockCallback = jest.fn();

    return db.query('', [], mockCallback).then(() => expect(mockCallback).toHaveBeenCalledTimes(1));
  });
});
