/* jshint -W138 */
import Immutable from 'immutable';
import {prune} from './treeLogic.js';

var defaultState = Immutable.fromJS({
	base: [
		'0,0,0'
	],
	blocks: {
		'0,0,0': 'TRUNK',
		'0,1,0': 'LEAF'
	}
});

export function treeReducer(state = defaultState, action){
  switch (action.type){
		case 'DELETE':
			return prune(state, action.data);
		case 'LOAD':
			return action.data;
    default:
      return state;
  }
}
