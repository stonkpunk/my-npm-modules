
var rcd = require('./index.js');

var r0 = 1;
var r1 = 5;
var pointA = [0,0,0];
var pointB = [10,3,-5];

var samplingPoint = [10,10,10];

var distance = rcd.roundConeDistance(samplingPoint, pointA, pointB, r0,r1);
console.log(distance) //12.493968786553904

var distanceSquared = rcd.roundConeDistanceSquared(samplingPoint, pointA, pointB, r0,r1);
console.log(distanceSquared) //248.8507665662628
