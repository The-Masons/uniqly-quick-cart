const updatedState = (state, action) => ({
	currentSize: action.currentSize || state.currentSize,
	currentQty: action.currentQty || state.currentQty,
  buttonClass: action.buttonClass || state.buttonClass,
});

export default function quickAddReducer(state, action) {
	switch (action.type) {
		case 'init':
		case 'select':
			return updatedState(state, action);
		default:
			break;
	}
};
