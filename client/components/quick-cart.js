'use client';

import { useEffect, useReducer } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import quickCartReducer from '../reducers/quick-cart-reducer';

import MiniCart from './mini-cart';
import QuickAdd from './quick-add';

export default function QuickCart({ item }) {
  const [state, dispatch] = useReducer(quickCartReducer, {
    sizes: [],
    quantities: {},
    cart: {},
    cartOrder: [],
    cartSize: 0,
    viewClass: 'minicart-view empty hidden',
    timeoutID: '',
  });

  const showCart = () => {
    const newViewClass = state.cartSize ? 'minicart-view' : 'minicart-view empty';

    if (state.timeoutID) {
      clearTimeout(state.timeoutID);
    }
    dispatch({
      type: 'show_mini_cart',
      viewClass: newViewClass,
      timeoutID: '',
    });
  };

  const hideCart = (isImmediate) => {
    const newViewClass = state.cartSize ? 'minicart-view hidden' : 'minicart-view empty hidden';

    // Reset the timeout on consecutive calls
    if (state.timeoutID) {
      clearTimeout(state.timeoutID);
    }

    if (isImmediate) {
      dispatch({
        type: 'hide_immediate',
        viewClass: newViewClass,
        timeoutID: '',
      });
    } else {
      const newTimeoutID = setTimeout(() => dispatch({
        type: 'hide_immediate',
        viewClass: newViewClass,
        timeoutID: '',
      }), 5000);
      dispatch({
        type: 'hide_timeout',
        timeoutID: newTimeoutID,
      });
    }
  };

  const getSizesQtys = () => {
    fetch(`/product/${item}/sizes_qtys`)
      .then((res) => {
        if (res.ok) {
          if (res.status === 200) {
            return res.json();
          }
          dispatch({
            type: 'error_server',
            error: `Server responded with an unexpected status: ${res.status}`,
            sizes: ['ERROR'],
            quantities: {
              ERROR: -1,
            },
          });
        } else {
          dispatch({
            type: 'error_server',
            error: `Server responded with an error: ${res.status}`,
            sizes: ['ERROR'],
            quantities: {
              ERROR: -1,
            },
          });
        }
        return '{}';
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const newSizes = [];
          const newQuantities = {};

          for (let i = 0; i < data.length; i += 1) {
            newSizes.push(data[i].size_name);
            newQuantities[data[i].size_name] = data[i].quantity;
          }
          dispatch({
            type: 'init_components',
            sizes: newSizes,
            quantities: newQuantities,
          });
        } else {
          dispatch({
            type: 'error_server',
            error: 'Server responded with an unexpected payload.',
            sizes: ['ERROR'],
            quantities: {
              ERROR: -1,
            },
          });
        }
      })
      .catch((e) => {
        dispatch({
          type: 'error_fetch',
          error: e.message,
          sizes: ['ERROR'],
          quantities: {
            ERROR: -1,
          },
        });
      });
  };

  const addToCart = (size, quantity) => {
    fetch(`/product/${item}/addtocart`)
      .then((res) => {
        if (res.ok) {
          if (res.status === 200) {
            return res.json();
          }
          dispatch({
            type: 'error_server',
            error: `Server responded with an unexpected status: ${res.status}`,
          });
        } else {
          dispatch({
            type: 'error_server',
            error: `Server responded with an error: ${res.status}`,
          });
        }
        return '{}';
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const newCart = { ...state.cart };
          const cartKey = `${item} ${size}`;
          if (Object.hasOwn(state.cart, cartKey)) {
            newCart[cartKey].quantity += parseInt(quantity, 10);
            const newCartSize = state.cartSize + parseInt(quantity, 10);
            dispatch({
              type: 'update_quantity',
              cart: newCart,
              cartSize: newCartSize,
            });
          } else {
            newCart[cartKey] = {
              id: item,
              name: data[0].name_name,
              color: data[0].color_name,
              quantity: parseInt(quantity, 10),
              size,
              price: data[0].price,
              imgUrl: data[0].img_url,
            };
            const newCartSize = state.cartSize + parseInt(quantity, 10);
            const newOrder = state.cartOrder.slice();
            newOrder.unshift(cartKey);
            dispatch({
              type: 'add_item',
              cart: newCart,
              cartSize: newCartSize,
              cartOrder: newOrder,
              viewClass: 'minicart-view',
            });
          }
          hideCart(false);
        } else {
          dispatch({
            type: 'error_server',
            error: 'Server responded with an unexpected payload.',
          });
        }
      })
      .catch((e) => {
        dispatch({
          type: 'error_fetch',
          error: e.message,
        });
      });
  };

  useEffect(() => {
    getSizesQtys(item);
  }, []);

  return (
    <>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <MiniCart
          cart={state.cart}
          cartSize={state.cartSize}
          cartOrder={state.cartOrder}
          getNewPage={getSizesQtys}
          showCart={showCart}
          hideCart={hideCart}
          viewClass={state.viewClass}
        />
      </ErrorBoundary>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <QuickAdd
          sizes={state.sizes}
          quantities={state.quantities}
          addToCart={addToCart}
        />
      </ErrorBoundary>
    </>
  );
}
