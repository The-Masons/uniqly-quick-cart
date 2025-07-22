import React from 'react';

class QuickAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSize: this.props.sizes[0],
      currentQty: this.props.quantities[this.props.sizes[0]] > 0 ? 1 : 'Out of Stock',
      buttonClass: this.props.quantities[this.props.sizes[0]] > 0 ? 'quickadd-btn' : 'quickadd-btn disabled',
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleSelect(e) {
    const newSize = e.target.form[0].value;
    const newButtonClass = this.props.quantities[newSize] > 0 ? 'quickadd-btn' : 'quickadd-btn disabled';

    let newQty = e.target.form[1].value;
    if (e.target.classList[1] === 'quickadd-select-sizes') {
      newQty = this.props.quantities[newSize] > 0 ? 1 : 'Out of Stock';
    }

    this.setState({
      currentSize: newSize,
      currentQty: newQty,
      buttonClass: newButtonClass,
    });
  }

  handleAdd(e) {
    e.preventDefault();
    const size = this.state.currentSize;
    const qty = this.state.currentQty;
    if (qty !== 'Out of Stock') {
      this.props.addToCart(size, qty);
    }
  }

  generateSizes(sizes) {
    const results = [];
    for (let i = 0; i < sizes.length; i += 1) {
      results.push(
        <option key={`sizeOpt${i}`}>{sizes[i]}</option>
      );
    }
    return results;
  }

  generateQtys(currSize) {
    const results = [];
    const quantity = this.props.quantities[currSize] < 99 ? this.props.quantities[currSize] : 99;
    for (let i = 0; i < quantity; i += 1) {
      results.push(
        <option key={`qtyOpt${i}`}>{i + 1}</option>
      );
    }
    return results.length > 0 ? results : <option>Out of Stock</option>;
  }

  render() {
    return (
      <div className="quickadd">
        <form className="quickadd-form">
          <div className="quickadd-select">
            <select
              className="quickadd-dropdown quickadd-select-sizes"
              onChange={this.handleSelect}
              value={this.state.currentSize}>
              {this.generateSizes(this.props.sizes)}
            </select>
            <select
              className="quickadd-dropdown quickadd-select-quantity"
              onChange={this.handleSelect}
              value={this.state.currentQty}>
              {this.generateQtys(this.state.currentSize)}
            </select>
          </div>
          <button className={this.state.buttonClass} onClick={this.handleAdd}>ADD TO BAG</button>
        </form>
      </div>
    );
  }
}

export default QuickAdd;
