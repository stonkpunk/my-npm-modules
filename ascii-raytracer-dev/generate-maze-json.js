//https://github.com/semibran/maze/blob/master/test.js

const generate = require('maze')
const { abs, floor, random } = Math
const sprites = {
	floor: '  ',
	wall: String.fromCharCode(0x2588).repeat(2)
}

var S = 5;
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
console.log(view)

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
	maze_boxes=require('jsonfile').readFileSync('./maze.json');

	var mg = require('merge-boxes');

	console.log(maze_boxes.length);
	mg.mergeBoxes(maze_boxes);
	console.log(maze_boxes.length);

	require('jsonfile').writeFileSync('maze.json',maze_boxes);
	return view
}
