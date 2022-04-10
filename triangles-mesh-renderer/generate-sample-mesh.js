var gen = require('generate-heightmap-mesh');

module.exports= function(resolution=32){
    //var resolution = 256; //x-z resolution of mesh
    var size = 64;
    var boundingBox_XZ = [[-size,0,-size],[size,0,size]];
    var df = gen.dfHillsWorld2D; //default distance function
    var yCoordinate=0.0; //y-coord to use in 3d distance function sampler
    var df_scaleXZ=100.0; //scale df along x-z, default 100 -- you can leave this constant to have the bounding box reveal more land as it expands, OR make this value proportional to the bounding box, to have the result expand to the same size as the bounding box
    var df_scaleY=4; //scale result height, default 4
    var postSimplifyFactor=1; //default 1 [no simplify] -- if less than 1, decimate triangles to the fraction indicated
    var doAddSkirt = true; //add "skirt" to heightmap to make it an enclosed mesh. default false.
    var skirtY = -10; //y coord for the skirt floor. default 0.

    var triangles = gen.generateHeightmapMeshXZ(resolution, boundingBox_XZ, df, yCoordinate, df_scaleXZ, df_scaleY, postSimplifyFactor, doAddSkirt, skirtY);
    return triangles;
};