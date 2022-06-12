function triangleInterpolateNormalsC(pt, tri, normalA, normalB, normalC) {
    var a = tri[0];
    var b = tri[1];
    var c = tri[2];

    var bax = b[0] - a[0];
    var cax = c[0] - a[0];
    var pax = pt[0] - a[0];

    var bay = b[1] - a[1];
    var cay = c[1] - a[1];
    var pay = pt[1] - a[1];

    var baz = b[2] - a[2];
    var caz = c[2] - a[2];
    var paz = pt[2] - a[2];

    var v9 = bax * bax + bay * bay + baz * baz; //9
    var v10 = bax * cax + bay * cay + baz * caz; //10

    var v11 = cax * cax + cay * cay + caz * caz; //11
    var v12 = pax * bax + pay * bay + paz * baz; //12

    var v13 = pax * cax + pay * cay + paz * caz; //13

    var v14 = v9 * v11 - v10 * v10; //14

    var v15 = (v11 * v12 - v10 * v13) / v14; //15
    var v16 = (v9 * v13 - v10 * v12) / v14; //16

    var tbcA = 1.0 - v15 - v16;
    var tbcB = v16;
    var tbcC = v15;

    return [
        normalA[0] * tbcA + normalB[0] * tbcB + normalC[0] * tbcC,
        normalA[1] * tbcA + normalB[1] * tbcB + normalC[1] * tbcC,
        normalA[2] * tbcA + normalB[2] * tbcB + normalC[2] * tbcC,
    ];
}