import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {

  goToStore(event) {
    event.preventDefault();
    const storeId = this.storeInput.value;
    console.log(`Going to store: ${storeId}`);
    this.context.router.transitionTo(`/store/${storeId}`);
  }

  render() {
    return (
      <form className="store-selector" onSubmit={ this.goToStore.bind(this) }>
        <h2>Please Enter A Store</h2>
        <input type="text" required placeholder="Store Name"
          defaultValue={ getFunName() }
          ref={ (input) => this.storeInput = input }
          onDoubleClick={() => this.storeInput.value = 'plain-thoughtless-fungi'}
        />
        <button type="submit">Enter The Store 😛</button>
      </form>
    );
  }

}

StorePicker.contextTypes = {
  router: React.PropTypes.object
};

export default StorePicker;