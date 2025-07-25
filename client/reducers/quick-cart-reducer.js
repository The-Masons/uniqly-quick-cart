export default function quickCartReducer(state, action) {
	switch (action.type) {
		case 'init_components':
			return {
				sizes: action.sizes,
        quantities: action.quantities,
        cart: state.cart,
		    cartOrder: state.cartOrder,
		    cartSize: state.cartSize,
		    viewClass: state.viewClass,
   		  timeoutID: state.timeoutID,
			};
		case 'update_qtys':
			return {
				sizes: state.sizes,
        quantities: state.quantities,
        cart: action.cart,
		    cartOrder: state.cartOrder,
		    cartSize: action.cartSize,
		    viewClass: state.viewClass,
   		  timeoutID: state.timeoutID,
			};
		case 'add_item':
			return {
				sizes: state.sizes,
        quantities: state.quantities,
        cart: action.cart,
		    cartOrder: action.cartOrder,
		    cartSize: action.cartSize,
		    viewClass: action.viewClass,
   		  timeoutID: state.timeoutID,
			};
		case 'show_mini_cart':
			return {
				sizes: state.sizes,
        quantities: state.quantities,
        cart: state.cart,
		    cartOrder: state.cartOrder,
		    cartSize: state.cartSize,
		    viewClass: action.viewClass,
   		  timeoutID: action.timeoutID,
			};
		case 'hide_timeout':
			return {
				sizes: state.sizes,
        quantities: state.quantities,
        cart: state.cart,
		    cartOrder: state.cartOrder,
		    cartSize: state.cartSize,
		    viewClass: state.viewClass,
   		  timeoutID: action.timeoutID,
			};
		case 'hide_immediate':
			return {
				sizes: state.sizes,
        quantities: state.quantities,
        cart: state.cart,
		    cartOrder: state.cartOrder,
		    cartSize: state.cartSize,
		    viewClass: action.viewClass,
   		  timeoutID: action.timeoutID,
			};
		case 'error_fetch':
		case 'error_server':
			console.error(action.error);
			return {
				sizes: action.sizes || state.sizes,
        quantities: action.quantities || state.quantities,
        cart: state.cart,
		    cartOrder: state.cartOrder,
		    cartSize: state.cartSize,
		    viewClass: state.viewClass,
   		  timeoutID: state.timeoutID,
			};
		default:
			break;
	}
};
