exports.grow = function(tree, options){
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
	return tree;
};

exports.prune = function(tree, key){
	//deletes the key from the base and blocks
	tree = tree.set('base', tree.get('base').filter(elem => {
		return elem !== key;
	}))
	.deleteIn(['blocks', key]);
	//checks for any additional deletions
	var seen = new Set();
	var next = tree.get('base').toJS();
	while (next.length) {
		let nextNext = [];
		for (let i = 0; i < next.length; i++){
			let key = next[i];
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
				if (!seen.has(newKey) && tree.hasIn(['blocks', newKey])){
					nextNext.push(newKey);
				}
			}
			seen.add(key);
		}
		next = nextNext;
	}
	tree = tree.set('blocks', tree.get('blocks').filter((value, elemKey)=>{
		return seen.has(elemKey);
	}))
	return tree;
};
