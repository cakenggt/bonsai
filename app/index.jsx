import 'babel-polyfill';
import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux';
import {treeReducer} from './reducers';
import TreeView from './components/treeView.jsx';

var store = createStore(
  treeReducer,
  applyMiddleware(thunk)
);

var Index = React.createClass({
  render: function() {
    return (
      <TreeView/>
    );
  }
});

var router = (
  <Router history={browserHistory}>
    <Route path="/" >
      <IndexRoute component={Index}/>
    </Route>
  </Router>
);

render(
  <Provider store={store}>{router}</Provider>,
  document.getElementById('app')
);
