import 'babel-polyfill';
import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {render} from 'react-dom';
import {Provider, connect} from 'react-redux';
import {createStore} from 'redux';

var reducer = function(state = {}, action){
  switch (action.type){
    default:
      return state;
  }
};

var store = createStore(reducer);


var Index = connect()(React.createClass({
  render: function() {
    return (
      <div></div>
    );
  }
}));

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
