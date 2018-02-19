import React from 'react';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from './base';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      fishes: {},
      order: {}
    };
    this.bindMethods(
      'loadSamples',
      'addFish',
      'updateFish',
      'removeFish',
      'addToOrder',
      'removeFromOrder'
    );
  }

  bindMethods(...methods) {
    methods.forEach(method => this[method] = this[method].bind(this));
  }

  componentWillMount() {
    this.syncRef = base.syncState(`${this.props.params.storeId}/fishes`, {
    // this.syncRef = base.syncState(`plain-thoughtless-fungi/fishes`, {
      context: this,
      state: 'fishes'
    });
    if (localStorage.order) {
      this.setState({ order: JSON.parse(localStorage.order) });
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.syncRef);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('order', JSON.stringify(nextState.order));
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes
    });
  }

  addFish(fish) {
    const fishes = { ...this.state.fishes };
    const now = Date.now();
    fishes[`fish-${now}`] = fish;
    this.setState({ fishes });
  }

  updateFish(key, updatedFish) {
    const fishes = {...this.state.fishes};
    fishes[key] = updatedFish;
    this.setState({ fishes });
  }

  removeFish(key) {
    const fishes = {...this.state.fishes};
    fishes[key] = null;
    this.setState({ fishes });
  }

  addToOrder(key) {
    const order = { ...this.state.order };
    order[key] = order[key] + 1 || 1;
    this.setState({ order });
  }

  removeFromOrder(key) {
    const order = {...this.state.order};
    delete order[key];
    this.setState({ order });
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {
              Object.keys(this.state.fishes)
                .map(key => (
                  <Fish
                    key={ key }
                    index={ key }
                    details={ this.state.fishes[key] }
                    addToOrder={ this.addToOrder }
                  />
                ))
            }
          </ul>
        </div>
        <Order
          fishes={ this.state.fishes }
          order={ this.state.order }
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory
          fishes={ this.state.fishes }
          addFish={ this.addFish }
          updateFish={ this.updateFish }
          removeFish={ this.removeFish }
          loadSamples={ this.loadSamples }
          storeId={this.props.params.storeId}
        />
      </div>
    )
  }
}

console.dir(App.prototype);
export default App;