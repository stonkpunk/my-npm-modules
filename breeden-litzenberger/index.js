//Breeden-Litzenberger formula with central differences

//timeToExpiration = time in years [default 1 week]
//riskFreeRate = ^TNX/100
function calcFromLastPrices(optionsChain, timeToExpiration=0.01916, riskFreeRate= 0.0369){
  let riskNeutralDensities = [];
  for (let i = 1; i < optionsChain.length - 1; i++) {
    let prevOption = optionsChain[i - 1];
    let currentOption = optionsChain[i];
    let nextOption = optionsChain[i + 1];

    let strikeDiff = nextOption.strike - currentOption.strike;

    // First order derivative approximations (forward and backward differences)
    let dC1 = (nextOption.last - currentOption.last) / strikeDiff;
    let dC2 = (currentOption.last - prevOption.last) / strikeDiff;

    // Second order derivative approximation (central difference)
    let d2C = (dC1 - dC2) / strikeDiff;

    // Convert to risk-neutral density
    let riskNeutralDensity = d2C * Math.exp(riskFreeRate * timeToExpiration);
    let row = {
      strike: currentOption.strike,
      density: riskNeutralDensity,
      option: currentOption
    };
    riskNeutralDensities.push(row);
  }
  return riskNeutralDensities;
}

//timeToExpiration = time in years [default 1 week]
//riskFreeRate = ^TNX/100
function calcFromBidAskPrices(optionsChain, timeToExpiration=0.01916, riskFreeRate= 0.0369) {
  let riskNeutralDensities = [];
  for (let i = 1; i < optionsChain.length - 1; i++) {
    let prevOption = optionsChain[i - 1];
    let currentOption = optionsChain[i];
    let nextOption = optionsChain[i + 1];

    let strikeDiff = nextOption.strike - currentOption.strike;

    // Compute mid-market prices
    let prevMid = (prevOption.bid + prevOption.ask) / 2;
    let currentMid = (currentOption.bid + currentOption.ask) / 2;
    let nextMid = (nextOption.bid + nextOption.ask) / 2;

    // First order derivative approximations (forward and backward differences)
    let dP1 = (nextMid - currentMid) / strikeDiff;
    let dP2 = (currentMid - prevMid) / strikeDiff;

    // Second order derivative approximation (central difference)
    let d2P = (dP1 - dP2) / strikeDiff;

    // Convert to risk-neutral density
    let riskNeutralDensity = d2P * Math.exp(riskFreeRate * timeToExpiration);

    let row = {
      strike: currentOption.strike,
      density: riskNeutralDensity,
      option: currentOption
    };
    riskNeutralDensities.push(row);
  }
  return riskNeutralDensities;
}

module.exports = {
    calcFromLastPrices,
    calcFromBidAskPrices
}