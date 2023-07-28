// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © wugamlo
// simplified js port by stonkpunk

// This experimental Indicator helps identifying instituational Order Blocks.
// Often these blocks signal the beginning of a strong move, but there is a significant probability that these price levels will be revisited at a later point in time again.
// Therefore these are interesting levels to place limit orders (Buy Orders for Bullish OB / Sell Orders for Bearish OB).
//
// A Bullish Order block is defined as the last down candle before a sequence of up candles. (Relevant price range "Open" to "Low" is marked)  / Optionally full range "High" to "Low"
// A Bearish Order Block is defined as the last up candle before a sequence of down candles. (Relevant price range "Open" to "High" is marked) / Optionally full range "High" to "Low"
//
// In the settings the number of required sequential candles can be adjusted.
// Furthermore a %-threshold can be entered. It defines which %-change the sequential move needs to achieve in order to identify a relevant Order Block.
// Channels for the last Bullish/Bearish Block can be shown/hidden.
//
// In addition to the upper/lower limits of each Order Block, also the equlibrium (average value) is marked as this is an interesting area for price interaction.
//
// Alerts added: Alerts fire when an Order Block is detected. The delay is based on the "Relevant Periods" input. Means with the default setting "5" the alert will trigger after the
// number of consecutive candles is reached.

function getCloseNPeriodsAgo(n, candlesAll, candleIndex) {return candlesAll[Math.max(0,candleIndex-n)].close;}
function getLowNPeriodsAgo(n, candlesAll, candleIndex) {return candlesAll[Math.max(0,candleIndex-n)].low;}
function getOpenNPeriodsAgo(n, candlesAll, candleIndex) {return candlesAll[Math.max(0,candleIndex-n)].open;}
function getHighNPeriodsAgo(n, candlesAll, candleIndex) {return candlesAll[Math.max(0,candleIndex-n)].high;}

function _orderBlockFinder(candlesAll, candleIndex, periods=5, threshold=0.0, usewicks=false) {
  var ca = candlesAll;
  var ci = candleIndex;
  var obp = periods + 1; //order block period 
  var absmove =
    ((Math.abs(getCloseNPeriodsAgo(obp, ca, ci) - getCloseNPeriodsAgo(1, ca, ci))) /
      getCloseNPeriodsAgo(obp, ca, ci)) *
    100;
  var relmove = absmove >= threshold;

  var bullishOB = getCloseNPeriodsAgo(obp, ca, ci) < getOpenNPeriodsAgo(obp, ca, ci);

  var upcandles = 0;
  for (var i = 1; i <= periods; i++) {
    upcandles += getCloseNPeriodsAgo(i, ca, ci) > getOpenNPeriodsAgo(i, ca, ci) ? 1 : 0;
  }

  var OB_bull = bullishOB && upcandles === periods && relmove;
  var OB_bull_high = OB_bull
    ? usewicks
      ? getHighNPeriodsAgo(obp, ca, ci)
      : getOpenNPeriodsAgo(obp, ca, ci)
    : null;
  var OB_bull_low = OB_bull ? getLowNPeriodsAgo(obp, ca, ci) : null;
  var OB_bull_avg = OB_bull ? (OB_bull_high + OB_bull_low) / 2 : null;

  var bearishOB = getCloseNPeriodsAgo(obp, ca, ci) > getOpenNPeriodsAgo(obp, ca, ci);

  var downcandles = 0;
  for (var i = 1; i <= periods; i++) {
    downcandles += getCloseNPeriodsAgo(i, ca, ci) < getOpenNPeriodsAgo(i, ca, ci) ? 1 : 0;
  }

  var OB_bear = bearishOB && downcandles === periods && relmove;
  var OB_bear_high = OB_bear ? getHighNPeriodsAgo(obp, ca, ci) : null;
  var OB_bear_low = OB_bear
    ? usewicks
      ? getLowNPeriodsAgo(obp, ca, ci)
      : getOpenNPeriodsAgo(obp, ca, ci)
    : null;
  var OB_bear_avg = OB_bear ? (OB_bear_low + OB_bear_high) / 2 : null;

  var RES = {};

  if (OB_bull) {
      RES.bull = {
          candleStart: candlesAll[candleIndex],
          indexStart: candleIndex,
          avg: OB_bull_avg,
          high: OB_bull_high,
          low: OB_bull_low
      }
  }

  if (OB_bear) {
      RES.bear = {
          candleStart: candlesAll[candleIndex],
          indexStart: candleIndex,
          avg: OB_bear_avg,
          high: OB_bear_high,
          low: OB_bear_low
      }
  }

  return (OB_bear || OB_bull) ? RES : {};
}

function orderBlockFinder(candles, periods=5, threshold=0.0, usewicks=false) {
    return candles.map(function(c,i){
        return _orderBlockFinder(candles, i, periods, threshold, usewicks);
    });
}

function applyRecentOrderBlocks(candles, periods=5, threshold=0.0, usewicks=false){
     var mostRecentBull = null;
     var mostRecentBear = null;
     var ordersData = orderBlockFinder(candles, periods, threshold, usewicks);
     return candles.map(function(c,i){
         // apply 'recent order blocks' data to candles
         if(ordersData[i].bull){
             mostRecentBull = ordersData[i].bull;
         }
         if(ordersData[i].bear){
             mostRecentBear = ordersData[i].bear;
         }
         c.mostRecentBullBlock = mostRecentBull;
         c.mostRecentBearBlock = mostRecentBear;

         c.index = i;
         //format:
         // RES.bear = {
         //      candleStart: candlesAll[candleIndex],
         //      indexStart: candleIndex,
         //      avg: OB_bear_avg,
         //      high: OB_bear_high,
         //      low: OB_bear_low
         //  }

         return c;
    });
}

module.exports = {orderBlockFinder, applyRecentOrderBlocks}