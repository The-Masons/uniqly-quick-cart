import React from 'react';
import MiniCart from './mini-cart.jsx';

describe('MiniCart', () => {
  test('should correctly render an empty cart', () => {
    const miniCart = shallow(<MiniCart />);
    const cartView = miniCart.find('.minicart-view');

    expect(cartView.hasClass('hidden')).toEqual(true);
    expect(cartView.hasClass('empty')).toEqual(true);
    expect(cartView.text()).toEqual('YOUR BAG IS EMPTY');
  });

  test('should correctly render a cart with items', () => {
    const miniCart = mount(<MiniCart
      cart={{
        'Fake 1': {
          id: 0,
          name: 'Dog Shirt',
          color: 'Dog Color',
          quantity: 2,
          size: 'Small Dog Size',
          price: 9999,
          imgUrl: 'http://placecorgi.com/250'
        },
        'Fake 2': {
          id: 1,
          name: 'Cat Shirt',
          color: 'Cat Color',
          quantity: 1,
          size: 'Cat Size',
          price: 5099,
          imgUrl: 'http://placecorgi.com/250'
        },
        'Fake 3': {
          id: 2,
          name: 'Some Pants',
          color: 'Pants Color',
          quantity: 1,
          size: 'Human Size',
          price: 1599,
          imgUrl: 'http://placecorgi.com/250'
        },
      }}
      cartSize={4}
      cartOrder={['Fake 1', 'Fake 3', 'Fake 2']}
      getNewPage={jest.fn()}
      />);

    expect(miniCart).toMatchSnapshot();
  });

  test('should display the cart when moused over', () => {
    const miniCart = mount(<MiniCart />);
    const cartIcon = miniCart.find('.minicart-icon');

    cartIcon.simulate('mouseEnter');
    expect(miniCart.state('viewClass')).toEqual('minicart-view empty');
  });

  test('should hide the cart when no longer moused over', () => {
    const miniCart = mount(<MiniCart />);
    const cartIcon = miniCart.find('.minicart-icon');
    jest.useFakeTimers();

    cartIcon.simulate('mouseEnter');
    cartIcon.simulate('mouseLeave');

    jest.advanceTimersByTime(5000);
    expect(miniCart.state('viewClass')).toEqual('minicart-view empty hidden');
  });
});
