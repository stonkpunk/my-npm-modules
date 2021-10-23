module.exports = function generate(nodes, adjacent, choose) {
	var node = choose(nodes)
	var stack = [node]
	var maze = new Map()
	for (var node of nodes) {
		maze.set(node, [])
	}
	while (node) {
		var neighbors = nodes.filter(other => !maze.get(other).length && adjacent(node, other))
		if (neighbors.length) {
			var neighbor = choose(neighbors)
			maze.get(node).push(neighbor)
			maze.get(neighbor).push(node)
			stack.unshift(neighbor)
			node = neighbor
		} else {
			stack.shift()
			node = stack[0]
		}
	}
	return maze
}
