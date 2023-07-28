var erf = require( 'math-erf' );

/**
 * Calculate the probability that the price will be above the strike at expiration (or below for a put)
 *
 * @param   {Number} s Current price of the underlying asset
 * @param   {Number} k Strike price
 * @param   {Number} t Time to expiration in years
 * @param   {Number} v Volatility as a decimal
 * @param   {Number} r Annual risk-free interest rate as a decimal
 * @param   {Boolean} isCall is a call ? or a put
 * @returns {Number} The probability that the price will be above the strike at expiration
 */
function calculateProbability(s, k, t, v, r, isCall = true) {
  var d1 = calcD1(s,k,t,v,r);
  var probability = isCall ? stdNormCDF(d1) : 1 - stdNormCDF(d1);
  return probability;
}

function calcD1(s, k, t, v, r){
    return (Math.log(s / k) + (r + Math.pow(v, 2) / 2) * t) / (v * Math.sqrt(t));
}

function calcD2(s, k, t, v, r){
    var d1 = calcD1(s,k,t,v,r);
    return d1 * v * Math.sqrt(d1);
}

function stdNormCDF(x) {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

module.exports = {calculateProbability, stdNormCDF, erf, calcD1, calcD2}
