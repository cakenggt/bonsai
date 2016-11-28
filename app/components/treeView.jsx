import 'aframe';
import {Scene, Entity} from 'aframe-react';
import React from 'react';
import {connect} from 'react-redux';
import {prune, growTree} from '../actions';

var TreeView = React.createClass({
	render: function(){
		const blockScale = 0.1;
		const userHeight = 1.6;
		var [...blocks] = this.props.tree.get('blocks').entries();
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
					key={x+','+y+','+z}
					onClick={()=>{this.props.prune(key)}}/>
			)
		});
		return (
			<Scene
				onClick={()=>{console.log('grow');this.props.growTree()}}>
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
	}
});

var mapStateToProps = (state) => {
	return {
		tree: state
	}
};

var mapDispatchToProps = (dispatch) => {
	return {
		prune: function(key){
			dispatch(prune(key));
		},
		growTree: function(){
			dispatch(growTree({growTrunk: true}))
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(
	TreeView
);
