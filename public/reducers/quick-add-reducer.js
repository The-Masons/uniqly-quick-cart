export default function quickAddReducer(state, action) {
	switch (action.type) {
		case 'select':
			return {
				currentSize: action.newSize,
      	currentQty: action.newQty,
     	  buttonClass: action.newButtonClass,
			};
		default:
			break;
	}
};