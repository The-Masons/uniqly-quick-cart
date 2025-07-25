import { useReducer } from 'react';
import quickAddReducer from '../reducers/quick-add-reducer.js';

export default function QuickAdd (props) {
  const [state, dispatch] = useReducer(quickAddReducer, {
    currentSize: props.sizes[0],
    currentQty: props.quantities[props.sizes[0]] > 0 ? 1 : 'Out of Stock',
    buttonClass: props.quantities[props.sizes[0]] > 0 ? 'quickadd-btn' : 'quickadd-btn disabled',
  });

  const handleSelect = e => {
    const newSize = e.target.form[0].value;
    const newButtonClass = props.quantities[newSize] > 0 ? 'quickadd-btn' : 'quickadd-btn disabled';

    let newQty = e.target.form[1].value;
    if (e.target.classList[1] === 'quickadd-select-sizes') {
      newQty = props.quantities[newSize] > 0 ? 1 : 'Out of Stock';
    }

    dispatch({
      type: 'select',
      currentSize: newSize,
      currentQty: newQty,
      buttonClass: newButtonClass,
    });
  };

  const handleAdd = e => {
    e.preventDefault();
    const size = state.currentSize;
    const qty = state.currentQty;
    if (qty !== 'Out of Stock') {
      props.addToCart(size, qty);
    }
  };

  const generateSizes = sizes => {
    const results = [];
    for (let i = 0; i < sizes.length; i += 1) {
      results.push(
        <option key={`sizeOpt${i}`}>{sizes[i]}</option>
      );
    }
    return results;
  };

  const generateQtys = currSize => {
    const results = [];
    const quantity = props.quantities[currSize] < 99 ? props.quantities[currSize] : 99;
    for (let i = 0; i < quantity; i += 1) {
      results.push(
        <option key={`qtyOpt${i}`}>{i + 1}</option>
      );
    }
    return results.length > 0 ? results : <option>Out of Stock</option>;
  }

  return (
    <div className="quickadd">
      <form className="quickadd-form">
        <div className="quickadd-select">
          <select
            className="quickadd-dropdown quickadd-select-sizes"
            onChange={handleSelect}
            value={state.currentSize}>
            {generateSizes(props.sizes)}
          </select>
          <select
            className="quickadd-dropdown quickadd-select-quantity"
            onChange={handleSelect}
            value={state.currentQty}>
            {generateQtys(state.currentSize)}
          </select>
        </div>
        <button className={state.buttonClass} onClick={handleAdd}>ADD TO BAG</button>
      </form>
    </div>
  );
};
