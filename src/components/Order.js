import React from 'react';
import { formatPrice } from '../helpers';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

class Order extends React.Component {

  constructor() {
    super();
    this.renderOrderRow = this.renderOrderRow.bind(this);
  }

  renderOrderRow(key) {

    const fish = this.props.fishes[key];
    const amount = this.props.order[key];
    const removeButton = <button onClick={() => this.props.removeFromOrder(key)}>&times;</button>;

    if (!fish || fish.status !== 'available') {
      return (
        <li key={ key }>
          Sorry! { fish ? fish.name : 'Fish' } is no longer available!
          {removeButton}
        </li>
      );
    } else {
      return (
        <li key={ key }>
          <span>
            <CSSTransitionGroup
              component="span"
              className="count"
              transitionName="count"
              transitionEnterTimeout={200}
              transitionLeaveTimeout={200}
            >
              <span key={amount}>{ amount }</span>
            </CSSTransitionGroup>
            lbs { fish.name }
          </span> {removeButton}
          <span className="price">{ formatPrice(amount * fish.price) }</span>
        </li>
      );
    }
  }

  render() {
    const { fishes, order } = this.props;
    const orderIds = Object.keys(order);
    const total = orderIds.reduce((sum, key) => {
      const fish = fishes[key];
      const amount = order[key];
      const isAvailable = fish && fish.status === 'available';
      if (isAvailable) {
        return sum + (fish.price * amount || 0);
      } else {
        return sum;
      }
    }, 0);
    return (
      <div className="order-wrap">
        <h2>Your Order</h2>
        <CSSTransitionGroup
          className="order"
          component="ul"
          transitionName="order"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          { orderIds.map(this.renderOrderRow) }
          <li className="total">
            <strong>Total:</strong>
            { formatPrice(total) }
          </li>
        </CSSTransitionGroup>
      </div>
    )
  }
}

export default Order;
