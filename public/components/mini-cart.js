import React from 'react';

class MiniCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewClass: this.props.cartSize > 0 ? 'minicart-view hidden' : 'minicart-view empty hidden',
      timeoutID: '',
    };

    this.generateMiniCart = this.generateMiniCart.bind(this);
    this.showCart = this.showCart.bind(this);
    this.hideCart = this.hideCart.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cartSize < this.props.cartSize) {
      this.setState({
        viewClass: 'minicart-view',
      }, this.hideCart.bind(null, false));
    }
  }

  showCart() {
    if (this.state.timeoutID) {
      clearTimeout(this.state.timeoutID);
    }

    this.setState({
      viewClass: this.state.viewClass.replace(' hidden', ''),
    });
  }

  hideCart(isImmediate) {
    if (this.state.timeoutID) {
      clearTimeout(this.state.timeoutID);
    }

    if (isImmediate) {
      this.setState({
        viewClass: `${this.state.viewClass} hidden`,
        timeoutID: '',
      });
    } else {
      const newTimeoutID = setTimeout(() => this.setState({
        viewClass: `${this.state.viewClass} hidden`,
      }), 5000);

      this.setState({
        timeoutID: newTimeoutID,
      });
    }
  }

  calculateTotal() {
    let sum = 0;
    for (let key in this.props.cart) {
      sum += this.props.cart[key].price * this.props.cart[key].quantity;
    }
    return sum;
  }

  generateMiniCart(cartSize) {
    if (cartSize > 0) {
      const newCart = [];

      for (let i = 0; i < this.props.cartOrder.length; i += 1) {
        const currItem = this.props.cartOrder[i];
        newCart.push(
          <div className="cart-item" key={`cartItem${i}`}>
            <img className="cart-item-img" src={this.props.cart[currItem].imgUrl}/>
            <div className="cart-item-info">
              <span
                className="cart-item-info name"
                onClick={this.props.getNewPage.bind(null, this.props.cart[currItem].id)}>
                {this.props.cart[currItem].name}
              </span>
              <span className="cart-item-info qty">Quantity: {this.props.cart[currItem].quantity}</span>
              <span className="cart-item-info color">Color: {this.props.cart[currItem].color}</span>
              <span className="cart-item-info size">Size: {this.props.cart[currItem].size}</span>
            </div>
            <span className="cart-item-price">${this.props.cart[currItem].price / 100}</span>
          </div>
        );
      }

      return [
        <div className="minicart-user-cart" key="userCart">
          {newCart}
        </div>,
        <div className="minicart-total" key="cartTotal">
          <span className="total-item-count">TOTAL ({this.props.cartSize} ITEMS)</span>
          <span className="total-subtotal">${this.calculateTotal() / 100}</span>
        </div>,
        <div className="minicart-cart-controls" key="cartControls">
          <button className="minicart-view-cart-btn">VIEW BAG</button>
          <button className="minicart-checkout-btn">CHECKOUT</button>
        </div>,
        <span className="minicart-close-btn" key="closeBag" onClick={this.hideCart.bind(null, true)}>CLOSE BAG</span>,
      ];
    } else {
      return 'YOUR BAG IS EMPTY';
    }
  }

  render() {
    return (
      <div className="minicart">
        <div className="minicart-icon"
            onMouseEnter={this.showCart}
            onMouseLeave={this.hideCart.bind(null, false)}>
          <span>{this.props.cartSize}</span>
        </div>
        <div className={this.state.viewClass}
          onMouseEnter={this.showCart}
          onMouseLeave={this.hideCart.bind(null, false)}>
          {this.generateMiniCart(this.props.cartSize)}
        </div>
      </div>
    );
  }
};

export default MiniCart;
