export default function quickAddReducer(state, action) {
	switch (action.type) {
		case 'init':
		case 'select':
			return {
				currentSize: action.currentSize,
      	currentQty: action.currentQty,
     	  buttonClass: action.buttonClass,
			};
		default:
			break;
	}
};
