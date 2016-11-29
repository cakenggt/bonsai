import 'aframe';
import {Scene, Entity} from 'aframe-react';
import React from 'react';
import Immutable from 'immutable';

var TreeView = React.createClass({
	getInitialState: function(){
		return {
			data: Immutable.fromJS({
				base: [
					'0,0,0'
				],
				blocks: {
					'0,0,0': 'TRUNK',
					'0,1,0': 'LEAF'
				}
			})
		};
	},
	render: function(){
		const blockScale = 0.1;
		const userHeight = 1.6;
		var [...blocks] = this.state.data.get('blocks').entries();
		var aBlocks = blocks.map((elem) => {
			var key = elem[0];
			var [x, y, z] = key.split(',');
			var type = elem[1];
			var color = type == 'TRUNK' ? 'chocolate' : 'green';
			return (
				<Entity
					geometry={{
						primitive: 'box',
						depth: blockScale,
						height: blockScale,
						width: blockScale
					}}
					material={'color: '+color}
					position={[x*blockScale, y*blockScale+userHeight, z*blockScale]}
					key={x+','+y+','+z}/>
			)
		});
		return (
			<Scene
				onClick={()=>{console.log('grow');this.growTree()}}>
				{aBlocks}
				<Entity
					position={[0.2, 0, 0.2]}
					rotation={[0, 45, 0]}>
					<Entity
						primitive='a-camera'
						wasd-controls={{
							fly: true,
							acceleration: 2
						}}>
						<Entity
							position={[0, 0, -0.01]}
							geometry={{
								primitive: 'ring',
								"radius-inner": 0.0001,
								"radius-outer": 0.0002
							}}
							primitive='a-cursor'></Entity>
					</Entity>
				</Entity>
			</Scene>
		);
	},
	growTree: function(){
		var tree = this.state.data;
		var options = {
			growTrunk: true
		};
		var possibleTrunks = [];
		var possibleLeaves = [];
		var seen = new Set();
		var next = tree.get('base').toJS();
		while (next.length) {
			let nextNext = [];
			for (let i = 0; i < next.length; i++){
				let key = next[i];
				let type = tree.getIn(['blocks', key]);
				let [x, y, z] = key.split(',');
				x = parseInt(x);
				y = parseInt(y);
				z = parseInt(z);
				let newKeys = [
					(x+1)+','+y+','+z,
					(x-1)+','+y+','+z,
					x+','+(y+1)+','+z,
					x+','+(y-1)+','+z,
					x+','+y+','+(z+1),
					x+','+y+','+(z-1)
				];
				for (let k = 0; k < newKeys.length; k++){
					let newKey = newKeys[k];
					let newType = tree.getIn(['blocks', newKey]);
					let newY = parseInt(newKey.split(',')[1]);
					if (!seen.has(newKey)){
						if (tree.hasIn(['blocks', newKey])){
							nextNext.push(newKey);
							if (newType == 'LEAF' && type == 'TRUNK' && newY >= 0){
								//trunk grow into leaf
								possibleTrunks.push(newKey);
							}
						}
						else if (type == 'TRUNK' && newY >= 0){
							//Trunk grow into air
							possibleTrunks.push(newKey);
						}
					}
				}
				seen.add(key);
			}
			next = nextNext;
		}
		if (options.growTrunk){
			var selected = possibleTrunks[Math.floor(Math.random()*possibleTrunks.length)];
			tree = tree.set('blocks', tree.get('blocks').set(selected, 'TRUNK'));
			if (selected.split(',')[1] == '0'){
				//add to base
				tree = tree.set('base', tree.get('base').push(selected));
			}
		}
		this.setState({
			data: tree
		});
	}
});

export default TreeView;
