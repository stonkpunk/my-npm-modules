box-frustum
===========
A function to test if an axis aligned bounding box interesects the camera frustum.

Usage/Installation
==================
First, pull this in via npm:

    npm install box-frustum
    
Then you can do a frustum test like this:

    require("box-frustum")(
      [1, 0, 0, 0,
       0, 1, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1],
      [[-1,-1,-1], [1,1,1]])
      
Which will check if axis-aligned bounding box from (-1,-1,-1) to (1,1,1) intersects the frustum for the unit matrix.

`require("box-frustum")(m, box)`
--------------------------------
module.exports implements the frustum test. It takes two arguments:

* `m` is an array of 16 float values representing the homogeneous clip coordinate matrix for the camera in row major order.
* `box = [lo, hi]` is an array of two length 3 arrays giving the bounds for the axis aligned bounding.

Results: true if the box intersects the camera frustum, flase otherwise.


Credits
=======
(c) 2013 Mikola Lysenko. BSD
