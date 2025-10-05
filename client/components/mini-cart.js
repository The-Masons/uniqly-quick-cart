import React from 'react';

export default function MiniCart({
  cart,
  cartOrder,
  cartSize,
  getNewPage,
  hideCart,
  showCart,
  viewClass,
}) {
  const calculateTotal = () => Object.keys(cart).reduce(
    (sum, key) => sum + cart[key].price * cart[key].quantity,
    0,
  );

  const displayPrice = (price) => {
    let priceStr = (price / 100).toString(10);
    const decIndex = priceStr.indexOf('.');
    if (decIndex === -1) {
      priceStr += '.00';
    } else if (decIndex === priceStr.length - 2) {
      priceStr += '0';
    }
    console.log(priceStr);
    return priceStr;
  };

  const generateMiniCart = () => {
    if (cartSize > 0) {
      const newCart = [];

      for (let i = 0; i < cartOrder.length; i += 1) {
        const currItem = cartOrder[i];
        newCart.push(
          <div className="cart-item" key={`cartItem${i}`}>
            <img className="cart-item-img" alt={`This is a fake product called item${i}`} src={cart[currItem].imgUrl} />
            <div className="cart-item-info">
              <button
                className="cart-item-info name"
                onClick={getNewPage.bind(null, cart[currItem].id)}
                onKeyDown={(e) => { if (e.key === 'Enter') { getNewPage(cart[currItem].id); } }}
                type="button"
              >
                {cart[currItem].name}
              </button>
              <span className="cart-item-info qty">
                Quantity:
                {cart[currItem].quantity}
              </span>
              <span className="cart-item-info color">
                Color:
                {cart[currItem].color}
              </span>
              <span className="cart-item-info size">
                Size:
                {cart[currItem].size}
              </span>
            </div>
            <span className="cart-item-price">
              $
              {displayPrice(cart[currItem].price)}
            </span>
          </div>,
        );
      }

      return [
        <div className="minicart-user-cart" key="userCart">
          {newCart}
        </div>,
        <div className="minicart-total" key="cartTotal">
          <span className="total-item-count">
            TOTAL (
            {cartSize}
            {' '}
            ITEMS)
          </span>
          <span className="total-subtotal">
            $
            {displayPrice(calculateTotal())}
          </span>
        </div>,
        <div className="minicart-cart-controls" key="cartControls">
          <button className="minicart-view-cart-btn" type="button">VIEW BAG</button>
          <button className="minicart-checkout-btn" type="button">CHECKOUT</button>
        </div>,
        <button
          className="minicart-close-btn"
          key="closeBag"
          onClick={hideCart.bind(null, true)}
          onKeyDown={(e) => { if (e.key === 'Enter') { hideCart(true); } }}
          type="button"
        >
          CLOSE BAG
        </button>,
      ];
    }
    return 'YOUR BAG IS EMPTY';
  };

  return (
    <div className="minicart">
      <div
        className="minicart-icon"
        onMouseEnter={showCart}
        onMouseLeave={hideCart.bind(null, false)}
      >
        <span>{cartSize}</span>
      </div>
      <div
        className={viewClass}
        onMouseEnter={showCart}
        onMouseLeave={hideCart.bind(null, false)}
      >
        {generateMiniCart()}
      </div>
    </div>
  );
}
