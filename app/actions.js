/* jshint -W138 */
import Immutable from 'immutable';
import {grow} from './treeLogic';

export function prune(key){
	return function(dispatch){
		dispatch({
			type: 'DELETE',
			data: key
		});
	};
}

export function growTree(options){
	return function(dispatch, getState){
		dispatch({
			type: 'LOAD',
			data: grow(getState(), options)
		});
	};
}
