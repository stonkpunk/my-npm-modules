const generate = require('./')
const { abs, floor, random } = Math
const sprites = {
	floor: '  ',
	wall: String.fromCharCode(0x2588).repeat(2)
}

var world = {
	width: 15,
	height: 15,
	tiles: new Array(15 * 15).fill('wall')
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

function render(world) {
	var view = ''
	for (var cell of cells(world)) {
		var tile = world.tiles[locate(world, cell)]
		var sprite = sprites[tile]
		if (!cell.x && cell.y) {
			view += '\n' + sprite
		} else {
			view += sprite
		}
	}
	return view
}
