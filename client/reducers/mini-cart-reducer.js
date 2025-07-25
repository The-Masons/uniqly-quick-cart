export default function miniCartReducer(state, action) {
	switch (action.type) {
		case 'item_added':
			return {
				viewClass: action.viewClass,
				timeoutID: state.timeoutID,
			};
		case 'hide_immediate':
			return {
				viewClass: action.viewClass,
				timeoutID: action.timeoutID,
			};
		case 'hide_delayed':
			return {
				viewClass: state.viewClass,
				timeoutID: action.timeoutID,
			};
		default:
			break;
	}
};
