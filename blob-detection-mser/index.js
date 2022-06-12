
"use strict";

(function (global, factory) { // eslint-disable-line func-names

	if (typeof define === "function" && define.amd) {
		define([], function() { // eslint-disable-line func-names
			return factory();
		});
	} else if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = factory();
	} else {
		global.MSER = factory();
	}

}(this, function () { // eslint-disable-line no-invalid-this, func-names

	/**
	* Rect class
	*/

	var Rect = function Rect() {

		this.top = Infinity;
		this.bottom = 0;
		this.left = Infinity;
		this.right = 0;

		Object.defineProperty(this, "width", {
			get: function get() {
				return this.right - this.left;
			},
			enumerable: true
		});

		Object.defineProperty(this, "height", {
			get: function get() {
				return this.bottom - this.top;
			},
			enumerable: true
		});

		Object.defineProperty(this, "ratio", {
			get: function get() {
				return this.width / this.height;
			},
			enumerable: true
		});

		Object.defineProperty(this, "size", {
			get: function get() {
				return this.width * this.height;
			},
			enumerable: true
		});

		this.add = function add(x, y) {
			this.top = Math.min(this.top, y);
			this.bottom = Math.max(this.bottom, y + 1);
			this.left = Math.min(this.left, x);
			this.right = Math.max(this.right, x + 1);
		};

		this.intersect = function intersect(rect) {
			var intersection = !(rect.left > this.right || rect.right < this.left || rect.top > this.bottom || rect.bottom < this.top);
			if (intersection) {
				intersection = new Rect();
				intersection.left = Math.max(this.left, rect.left);
				intersection.top = Math.max(this.top, rect.top);
				intersection.right = Math.min(this.right, rect.right);
				intersection.bottom = Math.min(this.bottom, rect.bottom);
			}
			return intersection;
		};

		this.merge = function merge(rect, strict) {
			if (strict) {
				var intersection = this.intersect(rect);
				if (!intersection || intersection.size < this.size / 4) return;
			}
			this.top = Math.min(this.top, rect.top);
			this.bottom = Math.max(this.bottom, rect.bottom);
			this.left = Math.min(this.left, rect.left);
			this.right = Math.max(this.right, rect.right);
		};

	};

	/**
	* Region class
	*/

	var Region = function Region(level) {

		this.level = level;
		this.moments = [0, 0, 0, 0, 0];
		this.area = 0;
		this.variation = Infinity;
		this.stable = false;
		this.rect = new Rect();

		this.accumulate = function accumulate(x, y) {
			this.area += 1;
			this.moments[0] += x;
			this.moments[1] += y;
			this.moments[2] += x * x;
			this.moments[3] += x * y;
			this.moments[4] += y * y;
			this.rect.add(x, y);
		};

		this.merge = function merge(child) {
			this.area += child.area;
			this.moments[0] += child.moments[0];
			this.moments[1] += child.moments[1];
			this.moments[2] += child.moments[2];
			this.moments[3] += child.moments[3];
			this.moments[4] += child.moments[4];
			child.next = this.child;
			this.child = child;
			child.parent = this;
			this.rect.merge(child.rect);
		};

		this.process = function process(delta, minArea, maxArea, maxVariation, minDiversity) {
			var parent = this; // eslint-disable-line consistent-this
			while (parent.parent && parent.parent.level <= this.level + delta) parent = parent.parent;
			this.variation = (parent.area - this.area) / this.area;
			this.stable = this.area >= minArea && this.area <= maxArea && this.variation <= maxVariation;
			for (parent = this.parent; parent && this.area > minDiversity * parent.area; parent = parent.parent) {
				if (parent.variation <= this.variation) this.stable = false;
				if (this.variation < parent.variation) parent.stable = false;
			}
			for (var child = this.child; child; child = child.next) {
				child.process(delta, minArea, maxArea, maxVariation);
			}
		};

		this.save = function save(regions) {
			if (this.stable) regions.push(this);
			for (var child = this.child; child; child = child.next) {
				child.save(regions);
			}
		};

		this.getRect = function getRect() {
			return this.rect;
		};

	};

	/**
	* MSER algorithm implementation
	*/

	var MSER = function MSER(opts) {

		var options = Object.assign({
				delta: 2,
				minArea: 0.0005,
				maxArea: 0.1,
				maxVariation: 0.5,
				minDiversity: 0.5
			}, opts),
			MAX_LEVEL = 256;
        var _this = this;
		this.eight = true;

        this.mergeRects = function(rects){
            // merge overlapping regions
            var intersection;
            for (var i = rects.length-1; i >= 0; i--) {
                for (var j = i-1; j >= 0; j--) {
                    intersection = rects[j].intersect(rects[i]);
                    if(intersection && (intersection.size > 0.5 * rects[j].size || intersection.size > 0.5 * rects[i].size)) {
                        rects[j].merge(rects[i]);
                        rects.splice(i, 1);
                        break;
                    }
                }
            }
            return rects;
        }

        this.drawRectSolid= function (rect,rgba,imgData){
            for(var _x=rect.left;_x<rect.left+rect.width;_x++){
                for(var _y=rect.top;_y<rect.top+rect.height;_y++){
                    imgData.data[4*(_x+_y*imgData.width)] = rgba[0];
                    imgData.data[4*(_x+_y*imgData.width)+1] = rgba[1];
                    imgData.data[4*(_x+_y*imgData.width)+2] = rgba[2];
                    imgData.data[4*(_x+_y*imgData.width)+3] = rgba[3];
                }
            }
        }

        this.drawRectOutline = function (rect,rgba,imgData){
            _this.drawRectSolid({left: rect.left, top: rect.top, width: rect.width, height: 1},rgba,imgData);
            _this.drawRectSolid({left: rect.left, top: rect.top+rect.height-1, width: rect.width, height: 1},rgba,imgData);
            _this.drawRectSolid({left: rect.left, top: rect.top, width: 1, height: rect.height},rgba,imgData);
            _this.drawRectSolid({left: rect.left+rect.width-1, top: rect.top, width: 1, height: rect.height},rgba,imgData);
        }

        /**
         * Extract maximally stable extremal regions from ImageData object
         * @param {ImageData} imageData - image ImageData object
         */

		this.extract = function extract(imageData) {

			var mask = [],
				accessible = [],
				boundaryPixels = [],
				priority = MAX_LEVEL,
				stack = [],
				regions = [],
				data = imageData.data,
				width = imageData.width,
				height = imageData.height;

			var processStack = function processStack(level, pixel) {
				var top;
				while (level > stack[stack.length - 1].level) {
					top = stack.pop();
					if (level < stack[stack.length - 1].level) {
						stack.push(new Region(level, pixel));
						stack[stack.length - 1].merge(top);
						return;
					}
					stack[stack.length - 1].merge(top);
				}
			};

			var index = 0, i, n = data.length;
			for (i = 0; i < n; i += 4) {
				mask[index] = data[i];
				index += 1;
			}
			n = width * height;
			for (i = 0; i < n; i += 1) accessible[i] = false;
			for (i = 0; i < MAX_LEVEL; i += 1) boundaryPixels[i] = [];

			stack.push(new Region(MAX_LEVEL));

			var curPixel = 0,
				curEdge = 0,
				curLevel = mask[0];
			accessible[0] = true;
			stack.push(new Region(curLevel));

			var x, y, nx, ny, neighborPixel, neighborLevel, newLevel,
				offsets = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [-1, -1], [1, -1]];

			for (;;) {
				x = curPixel % width;
				y = Math.floor(curPixel / width);
				for (; curEdge < (this.eight ? 8 : 4); ++curEdge) {
					nx = x + offsets[curEdge][0];
					ny = y + offsets[curEdge][1];
					if (nx >= 0 && ny >= 0 && nx < width && ny < height) {
						neighborPixel = (ny * width) + nx;
						if (!accessible[neighborPixel]) {
							neighborLevel = mask[neighborPixel];
							accessible[neighborPixel] = true;
							if (neighborLevel < curLevel) {
								boundaryPixels[curLevel].push((curPixel << 4) | curEdge + 1);
								priority = Math.min(curLevel, priority);
								curPixel = neighborPixel;
								curEdge = 0;
								curLevel = neighborLevel;
								stack.push(new Region(curLevel));
								x = curPixel % width;
								y = Math.floor(curPixel / width);
								continue;
							}
							boundaryPixels[neighborLevel].push(neighborPixel << 4);
							priority = Math.min(neighborLevel, priority);
						}
					}
				}
				stack[stack.length - 1].accumulate(x, y);

				if (priority === MAX_LEVEL) {
					processStack(MAX_LEVEL, curPixel);
					stack[stack.length - 1].process(options.delta, options.minArea * width * height, options.maxArea * width * height, options.maxVariation, options.minDiversity);
					stack[stack.length - 1].save(regions);
					return regions;
				}
				curPixel = boundaryPixels[priority][boundaryPixels[priority].length - 1] >> 4;
				curEdge = boundaryPixels[priority][boundaryPixels[priority].length - 1] & 15;
				boundaryPixels[priority].pop();

				while (priority < MAX_LEVEL && boundaryPixels[priority].length === 0) ++priority;

				newLevel = mask[curPixel];
				if (newLevel !== curLevel) {
					processStack(newLevel, curPixel);
					curLevel = newLevel;
				}
			}

		};

	};

	return MSER;

}));
