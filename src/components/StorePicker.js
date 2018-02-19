import React from 'react';
import PropTypes from 'prop-types';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {

  constructor(props) {
    super(props);
    const { history } = props;
    this.history = history;
  }

  goToStore(event) {
    event.preventDefault();
    const storeId = this.storeInput.value;
    console.log(`Going to store: ${storeId}`);
    // this.context.router.transitionTo(`/store/${storeId}`);
    this.history.push(`/store/${storeId}`);
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
        <button type="submit">Enter The Store <span role="img" aria-label="smile">😛</span></button>
      </form>
    );
  }

}

StorePicker.contextTypes = {
  router: PropTypes.object
};

export default StorePicker;