import React from 'react';
import QuickAdd from './quick-add.jsx';

describe('QuickAdd', () => {
  test('should populate dropdowns with given data', () => {
    const quickAdd = mount(
      <QuickAdd sizes={[
        'Fake Size 0',
        'Fake Size 1',
        'Fake Size 2',
      ]}
      quantities={{
        'Fake Size 0': 10,
        'Fake Size 1': 11,
        'Fake Size 2': 12,
      }}/>
    );

    expect(quickAdd).toMatchSnapshot();
  });

  test('should populate quantity dropdown with the correct number of options', () => {
    const quickAdd = mount(
      <QuickAdd sizes={[
        'Fake Size 0',
        'Fake Size 1',
        'Fake Size 2',
      ]}
      quantities={{
        'Fake Size 0': 10,
        'Fake Size 1': 11,
        'Fake Size 2': 12,
      }}/>
    );

    expect(quickAdd.find('.quickadd-select-quantity').children().length).toEqual(10);
    quickAdd.find('.quickadd-select-sizes').simulate('change',
      {
        target: {
          form: [
            { value: 'Fake Size 2' },
            { value: 12 },
          ],
          classList: [
            '',
            'quickadd-select-sizes',
          ],
        },
      });
    expect(quickAdd.state('currentSize')).toEqual('Fake Size 2');
    expect(quickAdd.find('.quickadd-select-quantity').children().length).toEqual(12);
  });

  test('should update state according to form values', () => {
    const quickAdd = mount(
      <QuickAdd sizes={[
        'Fake Size 0',
        'Fake Size 1',
        'Fake Size 2',
      ]}
      quantities={{
        'Fake Size 0': 10,
        'Fake Size 1': 11,
        'Fake Size 2': 12,
      }}/>
    );

    quickAdd.find('.quickadd-select-sizes').simulate('change',
      {
        target: {
          form: [
            { value: 'Fake Size 0' },
            { value: 3 },
          ],
          classList: [
            '',
            'quickadd-select-quantity',
          ],
        },
      });
    expect(quickAdd.state('currentSize')).toEqual('Fake Size 0');
    expect(quickAdd.state('currentQty')).toEqual(3);
    quickAdd.find('.quickadd-select-sizes').simulate('change',
      {
        target: {
          form: [
            { value: 'Fake Size 1' },
            { value: 1 },
          ],
          classList: [
            '',
            'quickadd-select-size',
          ],
        },
      });
    expect(quickAdd.state('currentSize')).toEqual('Fake Size 1');
    expect(quickAdd.state('currentQty')).toEqual(1);
  });

  test('should handle out of stock items', () => {
    const mockAdd = jest.fn();
    const quickAdd = mount(
      <QuickAdd sizes={[
        'Fake Size 0',
        'Fake Size 1',
        'Fake Size 2',
      ]}
      quantities={{
        'Fake Size 0': 0,
        'Fake Size 1': 0,
        'Fake Size 2': 0,
      }}/>
    );

    expect(quickAdd.state('currentQty')).toEqual('Out of Stock');
    expect(quickAdd.state('buttonClass')).toEqual('quickadd-btn disabled');
    quickAdd.find('.quickadd-btn').simulate('click');
    expect(mockAdd).toHaveBeenCalledTimes(0);
  });

  test('should add an item to the cart when "ADD TO BAG" is clicked', () => {
    const mockAdd = jest.fn();
    const quickAdd = mount(
      <QuickAdd sizes={[
        'Fake Size 0',
        'Fake Size 1',
        'Fake Size 2',
      ]}
      quantities={{
        'Fake Size 0': 10,
        'Fake Size 1': 11,
        'Fake Size 2': 12,
      }}
      addToCart={mockAdd}/>
    );

    quickAdd.find('.quickadd-btn').simulate('click');
    expect(mockAdd).toHaveBeenCalledWith('Fake Size 0', 1);
  });
});
