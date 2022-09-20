//based on https://github.com/semibran/maze/blob/master/test.js
var mg = require('merge-boxes').mergeBoxes;
const generate = require('maze')
const { abs, floor, random } = Math
const sprites = {
	floor: '  ',
	wall: String.fromCharCode(0x2588).repeat(2)
}

function generateLetters(size, numLetters, doMerge){
	var letters = [];
	for(var i=0;i<numLetters;i++){
		letters.push(generateLetter(size,numLetters,doMerge));
	}
	return letters;
}

function shiftPt(pt,shift){
	return [
		pt[0]+shift[0],
		pt[1]+shift[1],
		pt[2]+shift[2]
	]
}

function shiftBlocks(blocks,shift){
	return blocks.map(function(block){
		return [shiftPt(block[0],shift), shiftPt(block[1],shift)];
	});
}

function generateLettersBlocks(size, numLetters, doMerge){
	var letters = generateLetters(size, numLetters, doMerge).map(function(obj, i){
		obj.blocksForeground = shiftBlocks(obj.blocksForeground,[size*i,0,0]);
		obj.blocksBackground = shiftBlocks(obj.blocksBackground,[size*i,0,0]);
		return obj;
	});

	var res = {
		blocksForeground: [].concat(...letters.map(l=>l.blocksForeground)),
		blocksBackground: [].concat(...letters.map(l=>l.blocksBackground))
	};

	if(doMerge){
		res.blocksForeground = mg(res.blocksForeground);
		res.blocksBackground = mg(res.blocksBackground);
	}

	return res;
}

function generateLetter(size = 7, doMerge){
	var S = size;
	S+=(S+1)%2; //force oddness. needs to be odd to have walls render correct.
	var world = {
		width: S,
		height: S,
		tiles: new Array(S * S).fill('wall')
	}

	var nodes = cells(world).filter(cell => cell.x % 2 && cell.y % 2)
	var maze = generate(nodes, adjacent, choose)
	connect(maze, world)

	var view = render(world)
	var parts = view.replace(/ /g,'0').replace(/█/g,'1').split('\n');
	var viewSectorsBackground = [].concat(...parts.map(function(row,r){
		return row.split('').map(function(col,c){
			var sector = [[r,0,c],[r+1,1,c+1]];
			return col=='1' ? sector : null;
		}).filter(i=>i);
	}));
	var viewSectorsForeground = [].concat(...parts.map(function(row,r){
		return row.split('').map(function(col,c){
			var sector = [[r,0,c],[r+1,1,c+1]];
			return col=='0' ? sector : null;
		}).filter(i=>i);
	}));

	if(doMerge){
		viewSectorsBackground=mg(viewSectorsBackground);
		viewSectorsForeground=mg(viewSectorsForeground);
	}

	//console.log(view,'\n\n',viewSectorsForeground)

	return {
		str: view,
		//merged: doMerge,
		blocksForeground: viewSectorsForeground,
		blocksBackground: viewSectorsBackground
	}
}

function cells(grid) {
	var { width, height } = grid
	var cells = new Array(width * height)
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			var cell = { x, y }
			cells[locate(grid, cell)] = cell
		}
	}
	return cells
}

function locate(grid, cell) {
	return cell.y * grid.width + cell.x
}

function adjacent(a, b) {
	return abs(b.x - a.x) + abs(b.y - a.y) === 2
}

function choose(array) {
	return array[floor(random() * array.length)]
}

function connect(maze, world) {
	for (var [node, neighbors] of maze) {
		world.tiles[locate(world, node)] = 'floor'
		for (var neighbor of neighbors) {
			var midpoint = {
				x: node.x + (neighbor.x - node.x) / 2,
				y: node.y + (neighbor.y - node.y) / 2
			}
			world.tiles[locate(world, midpoint)] = 'floor'
		}
	}
}

var maze_boxes = [];
function render(world) {
	var boxes = [];
	var view = ''
	for (var cell of cells(world)) {
		var tile = world.tiles[locate(world, cell)]
		var sprite = sprites[tile]
		if (!cell.x && cell.y) {
			view += '\n' + sprite
			if(sprite!='  '){
				boxes.push([[cell.x,0,cell.y],[cell.x+1,1,cell.y+1]]);
			}
		} else {
			view += sprite
			if(sprite!='  '){
				boxes.push([[cell.x,0,cell.y],[cell.x+1,1,cell.y+1]]);
			}
		}
	}
	//console.log(boxes)
	maze_boxes=boxes;
	return view
}

module.exports = {generateLetter, generateLetters, generateLettersBlocks};
