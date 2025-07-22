export default function quickCartReducer(state, action) {
	switch (action.type) {
		case 'init_components':
			return {
				sizes: action.sizes,
        quantities: action.quantities,
        cart: state.cart,
		    cartOrder: state.cartOrder,
		    cartSize: state.cartSize,
			};
		case 'update_qtys':
			return {
				sizes: state.sizes,
        quantities: state.quantities,
        cart: action.cart,
		    cartOrder: state.cartOrder,
		    cartSize: action.cartSize,
			};
		case 'add_item':
			return {
				sizes: state.sizes,
        quantities: state.quantities,
        cart: action.cart,
		    cartOrder: action.cartOrder,
		    cartSize: action.cartSize,
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
			};
		default:
			break;
	}
};