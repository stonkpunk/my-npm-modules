[![npm version](https://badge.fury.io/js/kruskal-mst.svg)](https://badge.fury.io/js/kruskal-mst)
[![Build Status](https://travis-ci.com/dranidis/kruskal-mst.svg?branch=main)](https://travis-ci.com/dranidis/kruskal-mst)
[![Coverage Status](https://coveralls.io/repos/github/dranidis/kruskal-mst/badge.svg)](https://coveralls.io/github/dranidis/kruskal-mst)
[![Dependencies Status](https://status.david-dm.org/gh/dranidis/kruskal-mst.svg)](https://status.david-dm.org/gh/dranidis/kruskal-mst)



# kruskal-mst

Kruskal's algorithm finds a minimum spanning forest of an undirected edge-weighted graph. If the graph is connected, it finds a minimum spanning tree.

For more information read: https://en.wikipedia.org/wiki/Kruskal%27s_algorithm

## Usage

### Javascript
```javascript
k = require('kruskal-mst');
edges = [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'A', to: 'E', weight: 7 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'F', weight: 8 },
    { from: 'D', to: 'E', weight: 3 },
    { from: 'D', to: 'F', weight: 4 },
    { from: 'E', to: 'F', weight: 5 },
  ];
  mst = k.kruskal(edges);

  console.log(mst);
```

#### Output:
```javascript
[
  { from: 'A', to: 'B', weight: 1 },
  { from: 'B', to: 'C', weight: 2 },
  { from: 'D', to: 'E', weight: 3 },
  { from: 'D', to: 'F', weight: 4 },
  { from: 'B', to: 'D', weight: 5 }
]
```

### Typescript
```typescript
import { kruskal, Edge } from 'kruskal-mst';

const edges: Edge<string>[] = [
    { from: 'A', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'A', to: 'E', weight: 7 },
    { from: 'B', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'F', weight: 8 },
    { from: 'D', to: 'E', weight: 3 },
    { from: 'D', to: 'F', weight: 4 },
    { from: 'E', to: 'F', weight: 5 },
  ];
  const spanningTree = kruskal(edges);

  console.log(spanningTree);
```

