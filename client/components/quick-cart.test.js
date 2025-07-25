import React from 'react';
import $ from 'jquery';
import QuickCart from './quick-cart.jsx';
jest.mock('jquery');

QuickCart.prototype.renderComponents = jest.fn();

describe('QuickCart', () => {
  describe('getSizesQtys', () => {
    test('should load data from the db on page load', () => {
      const spy = jest.spyOn(QuickCart.prototype, 'getSizesQtys');
      const quickCart = mount(<QuickCart />);

      expect(spy).toHaveBeenCalledTimes(1);

      spy.mockClear();
    });

    test('should set state when a didMount request succeeds', () => {
      const quickCart = mount(<QuickCart />);

      expect(quickCart.state('sizes')).toEqual(['Fake Size Foo', 'Fake Size Bar']);
      expect(quickCart.state('quantities')).toEqual({
        'Fake Size Foo': 42,
        'Fake Size Bar': 42,
      });
    });

    test('should set state when a didMount request fails', () => {
      const quickCart = mount(<QuickCart />);

      quickCart.instance().getSizesQtys(42);

      expect(quickCart.state('sizes')).toEqual(['ERROR']);
      expect(quickCart.state('quantities')).toEqual({ERROR: -1});
    });

    test('should update cart when a new item is added', () => {
      const quickCart = mount(<QuickCart />);

      quickCart.instance().addToCart('Size 0', 1);

      expect(quickCart.state('cart')).toEqual({
        '0 Size 0': {
          id: 0,
          name: 'Fake Product',
          color: 'Fake Color',
          quantity: 1,
          size: 'Size 0',
          price: 4199,
          imgUrl: 'fake.url/image.fake',
        },
      });
      expect(quickCart.state('cartOrder')).toEqual(['0 Size 0']);
      expect(quickCart.state('cartSize')).toEqual(1);
    });
  });

  test('should update cart when an existing item is added', () => {
    const quickCart = mount(<QuickCart />);

    quickCart.instance().addToCart('Size 0', 1);
    quickCart.instance().addToCart('Size 0', 1);

    expect(quickCart.state('cart')).toEqual({
      '0 Size 0': {
        id: 0,
        name: 'Fake Product',
        color: 'Fake Color',
        quantity: 2,
        size: 'Size 0',
        price: 4199,
        imgUrl: 'fake.url/image.fake',
      },
    });
    expect(quickCart.state('cartOrder')).toEqual(['0 Size 0']);
    expect(quickCart.state('cartSize')).toEqual(2);
  });
});
