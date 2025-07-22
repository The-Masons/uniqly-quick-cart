import { useEffect, useReducer } from 'react';
import quickCartReducer from '../reducers/quick-cart-reducer.js';

import MiniCart from './mini-cart.js';
import QuickAdd from './quick-add.js';

export default function QuickCart (props) {
  const [state, dispatch] = useReducer(quickCartReducer, {
    sizes: [],
    quantities: {},
    cart: {},
    cartOrder: [],
    cartSize: 0,
  });

  // Fetch item info from the server
  useEffect(() => {
    getSizesQtys(props.item);
  }, []);

  const getSizesQtys = productId => {
    fetch(`/product/${productId}/sizes_qtys`)
      .then(res => {
        if (res.ok) {
          if (res.status === 200) {
            return res.json();
          } else {
            dispatch({
              type: 'error_server',
              error: `Server responded with an unexpected status: ${res.status}`,
              sizes: ['ERROR'],
              quantities: {
                ERROR: -1,
              },
            });
          }
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
      })
      .then(data => {
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
            error: `Server responded with an unexpected payload.`,
            sizes: ['ERROR'],
            quantities: {
              ERROR: -1,
            },
          });
        }
      })
      .catch(e => {
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
    fetch(`/product/${productId}/addtocart`)
      .then(res => {
        if (res.ok) {
          if (res.status === 200) {
            return res.json();
          } else {
            dispatch({
              type: 'error_server',
              error: `Server responded with an unexpected status: ${res.status}`,
            });
          }
        } else {
          dispatch({
            type: 'error_server',
            error: `Server responded with an error: ${res.status}`,
          });
        }
      })
      .then(data => {
        if (Object.isObject(data)) {        
          const newCart = Object.assign({}, state.cart);
          const cartKey = state.item + ' ' + size;
          if (state.cart.hasOwnProperty(cartKey)) {
            newCart[cartKey].quantity += parseInt(quantity);
            const newCartSize = state.cartSize + parseInt(quantity);
            dispatch({
              type: 'update_quantity',
              cart: newCart,
              cartSize: newCartSize,
            });
          } else {
            newCart[cartKey] = {
              id: state.item,
              name: data[0].name_name,
              color: data[0].color_name,
              quantity: parseInt(quantity),
              size: size,
              price: data[0].price,
              imgUrl: data[0].img_url,
            };
            const newCartSize = state.cartSize + parseInt(quantity);
            const newOrder = state.cartOrder.slice();
            newOrder.unshift(cartKey);
            dispatch({
              type: 'add_item',
              cart: newCart,
              cartSize: newCartSize,
              cartOrder: newOrder,
            });
          }
        } else {
          dispatch({
            type: 'error_server',
            error: `Server responded with an unexpected payload.`,
          });
        }
      })
      .catch(e => {
        dispatch({
          type: 'error_fetch',
          error: e.message,
        });
      });
  }

  return(
    <>
      <MiniCart
        cart={state.cart}
        cartSize={state.cartSize}
        cartOrder={state.cartOrder}
        getNewPage={getSizesQtys}
      />
      <QuickAdd
        sizes={state.sizes}
        quantities={state.quantities}
        addToCart={addToCart}
      />
    </>
  );
};
