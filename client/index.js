import React from 'react';
import ReactDOM from 'react-dom';
import QuickCart from './components/quick-cart.js';

ReactDOM.render(<QuickCart item={parseInt(window.location.href.split('/').pop()) || 0} />, document.getElementById('quick-cart-app'));
