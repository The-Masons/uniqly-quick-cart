import { useEffect, useReducer } from 'react';
import miniCartReducer from '../reducers/mini-cart-reducer.js';

export default function MiniCart (props) {
  const [state, dispatch] = useReducer(miniCartReducer, {
    viewClass: props.cartSize > 0 ? 'minicart-view hidden' : 'minicart-view empty hidden',
    timeoutID: '',
  });

  // Show cart when an item is added and start a timeout to hide it
  useEffect(() => {
    dispatch({
      type: 'item_added',
      viewClass: 'minicart-view',
    });
  }, [props.cartSize]);
  useEffect(() => {
    hideCart(false);
  }, [state.viewClass]);

  const showCart = () => {
    if (state.timeoutID) {
      clearTimeout(state.timeoutID);
    }

    dispatch({
      type: 'show',
      viewClass: state.viewClass.replace(' hidden', ''),
      timeoutID: '',
    });
  };

  const hideCart = isImmediate => {
    // Reset the timeout on consecutive calls
    if (state.timeoutID) {
      clearTimeout(state.timeoutID);
    }

    if (isImmediate) {
      dispatch({
        type: 'hide_immediate',
        viewClass: `${state.viewClass} hidden`,
        timeoutID: '',
      });
    } else {
      const newTimeoutID = setTimeout(() => dispatch({
        type: 'hide_immediate',
        viewClass: `${state.viewClass} hidden`,
        timeoutID: '',
      }), 5000);

      dispatch({
        type: 'hide_timeout',
        timeoutID: newTimeoutID,
      });
    }
  };

  const calculateTotal = () => {
    let sum = 0;
    for (let key in props.cart) {
      sum += props.cart[key].price * props.cart[key].quantity;
    }
    return sum;
  };

  const generateMiniCart = cartSize => {
    if (cartSize > 0) {
      const newCart = [];

      for (let i = 0; i < props.cartOrder.length; i += 1) {
        const currItem = props.cartOrder[i];
        newCart.push(
          <div className="cart-item" key={`cartItem${i}`}>
            <img className="cart-item-img" src={props.cart[currItem].imgUrl}/>
            <div className="cart-item-info">
              <span
                className="cart-item-info name"
                onClick={props.getNewPage.bind(null, props.cart[currItem].id)}>
                {props.cart[currItem].name}
              </span>
              <span className="cart-item-info qty">Quantity: {props.cart[currItem].quantity}</span>
              <span className="cart-item-info color">Color: {props.cart[currItem].color}</span>
              <span className="cart-item-info size">Size: {props.cart[currItem].size}</span>
            </div>
            <span className="cart-item-price">${props.cart[currItem].price / 100}</span>
          </div>
        );
      }

      return [
        <div className="minicart-user-cart" key="userCart">
          {newCart}
        </div>,
        <div className="minicart-total" key="cartTotal">
          <span className="total-item-count">TOTAL ({props.cartSize} ITEMS)</span>
          <span className="total-subtotal">${calculateTotal() / 100}</span>
        </div>,
        <div className="minicart-cart-controls" key="cartControls">
          <button className="minicart-view-cart-btn">VIEW BAG</button>
          <button className="minicart-checkout-btn">CHECKOUT</button>
        </div>,
        <span className="minicart-close-btn" key="closeBag" onClick={hideCart.bind(null, true)}>CLOSE BAG</span>,
      ];
    } else {
      return 'YOUR BAG IS EMPTY';
    }
  };

  return (
    <div className="minicart">
      <div className="minicart-icon"
          onMouseEnter={showCart}
          onMouseLeave={hideCart.bind(null, false)}>
        <span>{props.cartSize}</span>
      </div>
      <div className={state.viewClass}
        onMouseEnter={showCart}
        onMouseLeave={hideCart.bind(null, false)}>
        {generateMiniCart(props.cartSize)}
      </div>
    </div>
  );
}
