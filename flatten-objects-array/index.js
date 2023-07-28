//recursively traverses an object and returns a list of fields like "apple[0].seed" etc
function getObjectFieldsList(obj, path = '', fields = []) {
    for (const key in obj) {
        const value = obj[key];
        const newPath = path ? `${path}.${key}` : key;

        if (typeof value === 'object' && value !== null) {
            getObjectFieldsList(value, newPath, fields);
        } else {
            fields.push(newPath);
        }
    }

    return fields;
}

//extract value from "path" string like apple.seed etc
function getValueFromPath(obj, path) {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
        if (value && value.hasOwnProperty(key)) {
            value = value[key];
        } else if (Array.isArray(value) && /^\d+$/.test(key)) {
            const index = parseInt(key, 10);
            if (value.length > index) {
                value = value[index];
            } else {
                value = undefined;
                break;
            }
        } else {
            value = undefined;
            break;
        }
    }
    return value;
}

function getTypeFromPath(obj, path) {
    const value = getValueFromPath(obj, path);
    return getType(value);
}

function getType(value) {
    if (Array.isArray(value)) {
        return 'array';
    } else {
        return typeof value;
    }
}

//set or create fields given a string like "apple[0].seed" and a value

function setFieldValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];
        const isArray = /\[(\d+)\]$/.exec(nextKey);

        if (isArray) {
            const index = parseInt(isArray[1]);
            current = current[key] = current[key] || [];
            current = current[index] = current[index] || {};
        } else {
            current = current[key] = current[key] || {};
        }
    }

    current[keys[keys.length - 1]] = value;
    return obj;
}

//takes a list of fields like "apple[0].seed" alongside a list of values and builds the resulting object, using the functions form before
function buildObjectFromFields(fields, values) {
    const obj = {};
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const value = values[i];
        setFieldValue(obj, field, value);
    }
    return replaceNumericObjectsWithArrays(obj);
}

function loadObjectsIntoFloatArray(objList, _fieldsLong){
    var obj = objList[0];
    var fieldsLong = _fieldsLong || getObjectFieldsList(obj);
    var maxElems = objList.length;
    var pointSize = maxElems * fieldsLong.length * Float32Array.BYTES_PER_ELEMENT;
    var pointBuffer = new ArrayBuffer(pointSize);
    var points = new Float32Array(pointBuffer);
    objList.forEach(function(obj,i){
        fieldsLong.forEach(function(f,j){
            points[i*fieldsLong.length+j]=getValueFromPath(obj,f);
        });
    });
    return points;
}

function loadObjectsIntoArray(objList, _fieldsLong){
    var obj = objList[0];
    var fieldsLong = _fieldsLong || getObjectFieldsList(obj);
    var maxElems = objList.length;
    var points = new Array(maxElems * fieldsLong.length);
    objList.forEach(function(obj,i){
        fieldsLong.forEach(function(f,j){
            points[i*fieldsLong.length+j]=getValueFromPath(obj,f);
        });
    });
    return points;
}

function loadObjectsIntoArrayOfArrays(objList, _fieldsLong){
    var obj = objList[0];
    var fieldsLong = _fieldsLong || getObjectFieldsList(obj);
    var points = [];
    objList.forEach(function(obj,i){
        var thePt = [];
        fieldsLong.forEach(function(f,j){
            thePt.push(getValueFromPath(obj,f));
        });
        points.push(thePt);
    });
    return points;
}

function loadObjectsIntoIntArray(objList, _fieldsLong){
    var obj = objList[0];
    var fieldsLong = _fieldsLong || getObjectFieldsList(obj);
    var maxElems = objList.length;
    var pointSize = maxElems * fieldsLong.length * Int32Array.BYTES_PER_ELEMENT;
    var pointBuffer = new ArrayBuffer(pointSize);
    var points = new Int32Array(pointBuffer);
    objList.forEach(function(obj,i){
        fieldsLong.forEach(function(f,j){
            points[i*fieldsLong.length+j]=getValueFromPath(obj,f);
        });
    });
    return points;
}

function loadObjectsFromArray(arrFloat, fieldsLong){
    var numObjects = arrFloat.length / fieldsLong.length;
    var res = []
    for(var i=0;i<numObjects;i++){
        var vals = [];
        for(var j=0;j<fieldsLong.length;j++){
            vals.push(arrFloat[i*fieldsLong.length+j]);
        }
        var theObj = buildObjectFromFields(fieldsLong, vals);
        res.push(theObj);
    }
    return res;
}

function loadObjectsFromArrayOfArrays(arrsFloat, fieldsLong){
    var res = []
    for(var i=0;i<arrsFloat.length;i++){
        var vals = [];
        for(var j=0;j<fieldsLong.length;j++){
            vals.push(arrsFloat[i][j]);
        }
        var theObj = buildObjectFromFields(fieldsLong, vals);
        res.push(theObj);
    }
    return res;
}

function replaceNumericObjectsWithArrays(obj) {
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            obj[i] = replaceNumericObjectsWithArrays(obj[i]);
        }
    } else if (typeof obj === 'object' && obj !== null) {
        const keys = Object.keys(obj);
        let allNumeric = true;
        for (const key of keys) {
            if (!/^\d+$/.test(key)) {
                allNumeric = false;
                break;
            }
        }
        if (allNumeric) {
            const arr = [];
            for (const key of keys) {
                arr[parseInt(key)] = replaceNumericObjectsWithArrays(obj[key]);
            }
            obj = arr;
        } else {
            for (const key of keys) {
                obj[key] = replaceNumericObjectsWithArrays(obj[key]);
            }
        }
    }
    return obj;
}

module.exports = {
    loadObjectsIntoArray, replaceNumericObjectsWithArrays, loadObjectsFromArrayOfArrays , loadObjectsIntoArrayOfArrays, loadObjectsIntoIntArray, loadObjectsIntoFloatArray, loadObjectsFromArray, getObjectFieldsList, getValueFromPath, getTypeFromPath, getType, setFieldValue, buildObjectFromFields
}