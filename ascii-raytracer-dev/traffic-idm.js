//https://traffic-simulation.de/info/info_IDM.html
const lu = require("./lines-utils");
const interpLines = require("lines-path-interpolate");

//TODO try add lanes?

function trafficIDM(car, dt){
    //own speed v
    var v = car.speed;
    //the bumper-to-bumper gap s to the leading vehicle
    var s = car.carsAhead.length > 0 ? lu.lineLength([car.carsAhead[0].pt_roadRight, car.pt_roadRight]) : 99999;
    //the relative speed (speed difference) Δ v = v-vlead of the two vehicles (positive when approaching)
    var deltaV = car.carsAhead.length > 0 ? car.speed - car.carsAhead[0].speed * lu.dotProductLines(car.dirFwd, car.carsAhead[0].dirFwd)  : 0;

    //Desired speed v0
    var v0 = car.idealSpeed; //km-per-hr
    //Time headway T
    var T = 1000.5; //msec
    //Minimum gap s0
    var s0 = 10.50;
    //Acceleration a
    var a = 0.300/100.0; //m/s -- should be lower than braking by like 10x
    //Deceleration b
    var b = 3.0/100.0; //m/s

    // if(s<9999)
    // console.log(s);

    var g = 2; //arbitrary (?) exponent [was 4]

    //trucks are characterized by low values of v0, a, and b,
    //careful drivers drive at a high safety time headway T,
    //aggressive ("pushy") drivers are characterized by a low T in connection with high values of v0, a, and b.

    function sStar(_v, _deltaV){
        return s0 + Math.max(0, (v*T+ v*deltaV/(2*Math.sqrt(a*b)) ));
    }

    var brakingTerm = Math.pow(sStar(v,deltaV)/s ,2);
    var desiredSpeedTerm = Math.pow(v/v0,g);
    //console.log(dec);

    var dvdt = a * (1 - desiredSpeedTerm -  brakingTerm );

    car.speed+=dvdt*dt*0.001;

    car.speed = Math.max(0.0,car.speed);
}


var _ = require('underscore');
const sp = require("./pts-shortest-path");
const dfu = require("./distance-function-utils");
const art = require("./index");
function generatePathLoop(pointsWithNeighbors, TWO_WAY_CONNECTIONS){
    var numDests = 5;
    var ptsIds = pointsWithNeighbors.map((f,i)=>i);
    var destIds = _.sample(ptsIds, numDests);
    var allLines = [];
    for(var i=0;i<numDests;i++){
        allLines.push(...getPathLines(pointsWithNeighbors, destIds[i],destIds[(i+1)%numDests], TWO_WAY_CONNECTIONS));
    }
    return allLines;
}

function getPathLines(pointsWithNeighbors, src, trg, TWO_WAY_CONNECTIONS){
    var ptsIds = sp.setOfPointsShortestPath2(pointsWithNeighbors, trg, src, undefined, !TWO_WAY_CONNECTIONS);
    var pathLines = lu.pts2Lines(pointsWithNeighbors,ptsIds);
    return pathLines;
}

function generateCar(nres, TWO_WAY_CONNECTIONS, _roadSize=1.0){
    var pathLines = generatePathLoop(nres, TWO_WAY_CONNECTIONS);//getPathLines(src, trg);

    //TODO remove lines from pathlines that are not in the original set of lines ! -- prevent "teleporting" across the land parts / going wrong way on street
    //^^ does using road loops fix this automagically?

    var speed = 0.005251*(1.0+Math.random()/2.0);
    var idealSpeed = 0.005251*(1.0+Math.random()/2.0);
    var totalPathLength = lu.linesLength(pathLines);
    var expectedTimeForPath = totalPathLength / speed;
    var t = Math.random();
    var dist = t*totalPathLength;
    var carSize = 0.50;//Math.random()*1.0+1.0;
    var pt_roadCenter = interpLines.interpAlongLines_bezier_dist(pathLines,dist%totalPathLength);
    var prevPt_roadCenter = interpLines.interpAlongLines_bezier_dist(pathLines,(dist-0.001+totalPathLength)%totalPathLength);

    var color = [Math.random(),Math.random(),Math.random()];

    //var rightDir = interpLines.interpAlongLineset_bezier_getRightDir(pathLines,dist%totalPathLength);

    var roadSize = _roadSize || 2.0;

    var dirFwd = lu.normalizeLine([prevPt_roadCenter,pt_roadCenter]);
    var dirUp = lu.normalizeLine([[0,0,0],[0,-1,0]]);
    var dirRight = lu.crossProductLines(dirFwd, dirUp);

    var pt_roadRight = lu.addPts(pt_roadCenter, lu.scalePt(dirRight,roadSize));
    var prevPt_roadRight = lu.addPts(prevPt_roadCenter, lu.scalePt(dirRight,roadSize));

    var dirFwdRight =  lu.normalizeLine([prevPt_roadRight,pt_roadRight]);
    var prev_dirFwdRight = dirFwdRight;

    var carsAhead = [];
    return {color, dirFwdRight, prev_dirFwdRight, pt_roadRight, prevPt_roadRight, roadSize, carsAhead, prevPt_roadCenter, pt_roadCenter,dist,carSize,pathLines,speed,idealSpeed, totalPathLength,expectedTimeForPath,t,dirFwd,dirUp,dirRight};
}

//var LANE_SIZE = 3.0 / 2.0 / 2.0;
function updateCars(cars, deltaTime){
    var timeSinceLastUpdate = deltaTime;//Date.now()-t0;

    var carsNearbyRadius = 10.0;
    var carsNearbyRadius2 = 4.0;

    //radius based...
    //var carsNearbyFunc = dfu.sectorsNearbyPtFunc(cars.map(car=>[car.pt_roadRight,car.pt_roadRight, car]), carsNearbyRadius)

    //more efficient...
    var carsNearbyFunc2 = dfu.linesNearbyLineFunc(cars.map(car=>[car.pt_roadRight,lu.jitterPt(car.pt_roadRight,0.1), car]), carsNearbyRadius2)

    cars.forEach(function(car){

        if(car.dirFwdRight){
            var lineFwd = lu.scaleLine(car.dirFwdRight, car.carSize*10);
            var carsNearby= carsNearbyFunc2(lineFwd).map(res=>res[2]);

            car.carsAhead = carsNearby.filter(function(otherCar){
                var t = lu.lineClosestTForPt(car.dirFwdRight, otherCar.pt_roadRight);
                //var moveDir = lu.normalizeAndCenterLine(car.dirFwdRight);
                //var prevMoveDir = lu.normalizeAndCenterLine(car.prev_dirFwdRight);
                //var turnDist = lu.ptLength(lu.ptDiff(moveDir[1], prevMoveDir[1])); //zero if moving in straight line

                return otherCar!=car &&
                    //lu.angleBetweenLines_degrees(car.dirFwdRight, [car.dirFwdRight[0], otherCar.dirFwdRight[0]]) < 1 && //check for same lane
                    lu.angleBetweenLines_degrees(car.dirFwdRight, otherCar.dirFwdRight) < 20 &&
                    //lu.lineDistance(otherCar.pt_roadRight,lineFwd) < t*turnDist && //must be on road/same lane [without rejecting cars in intersections]
                    t > 0.0 //&& //&& //must be in front not behind
                    //lu.lineLength([car.pt_roadCenter,otherCar.pt_roadCenter])>1.0 &&
                    //lu.dotProductLines(car.dirFwdRight, otherCar.dirFwdRight) > 0.0; // > 0 means acute angle formed, otherwise obtuse
            }).sort(function(a,b){//sort by dist asc
                return lu.lineLengthSquared([car.pt_roadRight,a.pt_roadRight])-lu.lineLengthSquared([car.pt_roadRight,b.pt_roadRight]);
            });

            //console.log(carsAhead.length);
        }

        trafficIDM(car, timeSinceLastUpdate);


        var prevPt_roadCenter = lu.addPts(car.pt_roadCenter,[0,0,0]);
        //car.expectedTimeForPath = car.totalPathLength / car.speed;
        //car.t+= timeSinceLastUpdate/car.expectedTimeForPath;
        car.dist += car.speed*timeSinceLastUpdate;//car.totalPathLength * timeSinceLastUpdate/car.expectedTimeForPath;

        car.prevPt_roadCenter = prevPt_roadCenter;
        car.pt_roadCenter = interpLines.interpAlongLines_bezier_dist(car.pathLines,car.dist%car.totalPathLength); //interpAlongLineset_dist

        var motionDir = lu.normalizeLine([car.prevPt_roadCenter,car.pt_roadCenter]);
        var upDir = lu.normalizeLine([[0,0,0],[0,-1,0]]);

        //var rightDir = interpLines.interpAlongLineset_bezier_getRightDir(car.pathLines,car.dist%car.totalPathLength);

        var rightDir = lu.crossProductLines(motionDir, upDir);

        car.dirFwd = motionDir;
        car.dirUp = upDir;
        car.dirRight = car.speed > 0 ? rightDir : car.dirRight;

        car.pt_roadRight = lu.addPts(car.pt_roadCenter, lu.scalePt(car.dirRight,car.roadSize));
        car.prevPt_roadRight = lu.addPts(car.prevPt_roadCenter, lu.scalePt(car.dirRight,car.roadSize));
        car.prev_dirFwdRight = car.dirFwdRight;
        car.dirFwdRight =  lu.normalizeLine([car.prevPt_roadRight,car.pt_roadRight]);

        //xs.push(...lu.pt2XLines(car.pt_roadRight,car.carSize));
    });

    //art.updateDfForLines([].concat(choppedLines,xs));
    //t0=Date.now();
}

module.exports = {updateCars, trafficIDM, generateCar};