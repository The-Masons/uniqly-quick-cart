import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import MiniCart from './mini-cart.jsx';
import QuickAdd from './quick-add.jsx';

class QuickCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: parseInt(window.location.href.split('/').pop()) || 0,
      sizes: [],
      quantities: {},
      cart: {},
      cartOrder: [],
      cartSize: 0,
    };

    this.renderComponents = this.renderComponents.bind(this);
    this.getSizesQtys = this.getSizesQtys.bind(this);
    this.addToCart= this.addToCart.bind(this);
  }

  componentDidMount() {
    this.getSizesQtys(this.state.item);
  }

  getSizesQtys(productId) {
    $.ajax({
      url: `/product/${productId}/sizes_qtys`,
      method: 'GET',
      success: (data) => {
        const newSizes = [];
        const newQuantities = {};
        for (let i = 0; i < data.length; i += 1) {
          newSizes.push(data[i].size_name);
          newQuantities[data[i].size_name] = data[i].quantity;
        }
        this.setState({
          currentItem: productId,
          sizes: newSizes,
          quantities: newQuantities,
        }, () => this.renderComponents());
      },
      error: (err) => {
        this.setState({
          sizes: ['ERROR'],
          quantities: {
            ERROR: -1,
          },
        }, () => this.renderComponents());
        console.log('Error', err);
      },
    });
  }

  addToCart(size, quantity) {
    $.ajax({
      url: `/product/${this.state.item}/addtocart`,
      method: 'GET',
      success: (data) => {
        const newCart = Object.assign({}, this.state.cart);
        const cartKey = this.state.item + ' ' + size;
        if (this.state.cart.hasOwnProperty(cartKey)) {
          newCart[cartKey].quantity += parseInt(quantity);
          const newCartSize = this.state.cartSize + parseInt(quantity);
          this.setState({
            cart: newCart,
            cartSize: newCartSize,
          }, () => this.renderComponents());
        } else {
          newCart[cartKey] = {
            id: this.state.item,
            name: data[0].name_name,
            color: data[0].color_name,
            quantity: parseInt(quantity),
            size: size,
            price: data[0].price,
            imgUrl: data[0].img_url,
          };
          const newCartSize = this.state.cartSize + parseInt(quantity);
          const newOrder = this.state.cartOrder.slice();
          newOrder.unshift(cartKey);
          this.setState({
            cart: newCart,
            cartSize: newCartSize,
            cartOrder: newOrder,
          }, () => this.renderComponents());
        }
      },
      error: (err) => {
        console.log('Error', err);
      },
    });
  }

  renderComponents() {
    ReactDOM.render(
      <MiniCart
        cart={this.state.cart}
        cartSize={this.state.cartSize}
        cartOrder={this.state.cartOrder}
        getNewPage={this.getSizesQtys}
        />, document.getElementById('mini-cart-app'));

    ReactDOM.render(
      <QuickAdd
        sizes={this.state.sizes}
        quantities={this.state.quantities}
        addToCart={this.addToCart}
        />, document.getElementById('quick-add-app'));
  }

  render() {
    return(
      <div className="quickCart"></div>
    );
  }
}

export default QuickCart;
