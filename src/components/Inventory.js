import React from 'react';
import AddFishForm from './AddFishForm';
import base from './base';

class Inventory extends React.Component {

  constructor(props) {
    super(props);
    this.state = { uid: null, owner: null };
    const methodsToBind = [
      'handleChange',
      'authenticate',
      'authHandler',
      'logOut',
      'renderLogin',
      'renderInventory'
    ];
    methodsToBind.forEach(method => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    base.onAuth(user => {
      if (user) this.authHandler(null, { user });
    });
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key];
    const updatedFish = {
      ...fish,
      [e.target.name]: e.target.value
    };
    this.props.updateFish(key, updatedFish);
  }

  authenticate(provider) {
    console.log(`Trying to log in with ${provider} account.`);
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(err, authData) {
    console.log(authData);

    if (err) {
      console.error(err);
      return;
    }

    const storeRef = base.database().ref(this.props.storeId);

    storeRef.once('value', snapshot => {
      const data = snapshot.val() || {};

      // if no owner set for this store claim current user as the owner
      if (!data.owner) {
        storeRef.set({ owner: authData.user.uid });
      }

      this.setState({
        owner: data.owner,
        uid: authData.user.uid
      });

    });
  }

  logOut() {
    base.unauth();
    this.setState({ uid: null });
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={() => this.authenticate('github')}>Log In with Github</button>
        <button className="facebook" onClick={() => this.authenticate('facebook')}>Log In with Facebook</button>
        <button className="twitter" onClick={() => this.authenticate('twitter')}>Log In with Twitter</button>
      </nav>
    );
  }

  renderInventory(key) {
    const fish = this.props.fishes[key];
    const handleChange = e => this.handleChange(e, key);
    return (
      <div className="fish-edit" key={key}>
        <input type="text" name="name" value={fish.name} placeholder="Fish Name"
          onChange={handleChange} />
        <input type="text" name="price" value={fish.price} placeholder="Fish Price"
          onChange={handleChange} />
        <select name="status" value={fish.status}
          onChange={handleChange}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea name="desc" value={fish.desc} placeholder="Fish Desc"
          onChange={handleChange}></textarea>
        <input type="text" name="image" value={fish.image} placeholder="Fish Image"
          onChange={handleChange} />
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    );
  }

  render() {

    const logout = <button onClick={this.logOut}>Log Out</button>

    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    else if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you are not the owner of this store!</p>
          {logout}
        </div>
      );
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logout}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={ this.props.addFish } />
        <button onClick={ this.props.loadSamples }>Load Sample Fishes</button>
      </div>
    );

  }
}

export default Inventory;