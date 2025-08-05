const updatedState = (state, action) => ({
	sizes: action.sizes || state.sizes,
  quantities: action.quantities || state.quantities,
  cart: action.cart || state.cart,
  cartOrder: action.cartOrder || state.cartOrder,
  cartSize: action.cartSize || state.cartSize,
  viewClass: action.viewClass || state.viewClass,
  timeoutID: action.timeoutID || state.timeoutID,
});

export default function quickCartReducer(state, action) {
	switch (action.type) {
		case 'init_components':
		case 'update_quantity':
		case 'add_item':
		case 'show_mini_cart':
		case 'hide_timeout':
		case 'hide_immediate':
			return updatedState(state, action);
		case 'error_fetch':
		case 'error_server':
			console.error(action.error);
			return updatedState(state, action);
		default:
			break;
	}
};
