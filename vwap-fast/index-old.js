//old version, memory-inefficient

var DEFAULT_CONFIG = {
    maximumRows: 15000, //maximum rows to store [will actually store up to maximumRows+purgeEvery -- then occasionally the extra gets purged/deleted]
    doAutoPurge: true, //enable occasional purging of old candles "beyond the horizon" of maximumRows
    purgeEvery: 15000, //how many extra candles beyond maximumRows are allowed to be stored before purge. set to a higher value to make the purges "rare" because memory re-allocations are slow.
    doShiftValuesDownAfterPurge: true, //during purge, prefix sums are reset to "start from zero" again [improves numerical stability, should not affect results]
}

function Vwap(config=DEFAULT_CONFIG){

    var _this = this;
    var maximumRows = config.maximumRows;
    var purgeEvery = config.purgeEvery;
    var doAutoPurge = config.doAutoPurge;
    var doShiftValuesDownAfterPurge = config.doShiftValuesDownAfterPurge; //if true, reduces all the summed prefixes so they start at zero after each purge. should improve numerical stability.
    var lengthLimit = maximumRows+purgeEvery;
    var prefixSums_PriceTimesVolume=[];
    var prefixSums_Volume=[];

    this.totalCandles=0;
    this.prefixSums_PriceTimesVolume = prefixSums_PriceTimesVolume;
    this.prefixSums_Volume = prefixSums_Volume;

    this.generateFakeCandle = function(){
        var o = 100+Math.random()*100.0;
        var res = { //these
            o:o,
            h:o+1,
            l:o-1,
            c:o,
            v:Math.random()*1000000.0
        }
        //average should be 150
        return res;
    }

    this.submitCandle = function(candle, useTypicalPrice=true){ //candle = {o,h,l,c,v}
        var typ = useTypicalPrice ? (candle.h+candle.l+candle.c)/3.0 : candle.c; //typical price
        var previousValuePV = prefixSums_PriceTimesVolume.length ? prefixSums_PriceTimesVolume[prefixSums_PriceTimesVolume.length-1] : 0;
        var previousValueV = prefixSums_Volume.length ? prefixSums_Volume[prefixSums_Volume.length-1] : 0;
        prefixSums_PriceTimesVolume.push(previousValuePV+typ*candle.v);
        prefixSums_Volume.push(previousValueV+candle.v);
        //candles.push(c);
        if(doAutoPurge && prefixSums_Volume.length>lengthLimit){ //do cleanup "in batches" instead of for every step
            //candles.splice(0,purgeEvery);
            prefixSums_Volume.splice(0,purgeEvery);
            prefixSums_PriceTimesVolume.splice(0,purgeEvery);

            if(doShiftValuesDownAfterPurge){
                var startingVolume = prefixSums_Volume[0]+0;
                var startingVolumeTimesPrice = prefixSums_PriceTimesVolume[0]+0;

                for(var i=0;i<prefixSums_Volume.length;i++){
                    prefixSums_Volume[i]-=startingVolume;
                    prefixSums_PriceTimesVolume[i]-=startingVolumeTimesPrice;
                }
            }
        }
        _this.totalCandles++;
    }

    this.getVwap = function(nPeriods=1){
        if(nPeriods<1){throw 'nPeriods must be greater than zero'}
        if(prefixSums_PriceTimesVolume.length<1){throw 'vwap requires at least 1 candle to be submitted'}

        var nPeriodsBack = nPeriods - 1;
        var i0 = Math.max(0,prefixSums_PriceTimesVolume.length-1-nPeriodsBack);
        var lastPriceTimesVolume = prefixSums_PriceTimesVolume[prefixSums_PriceTimesVolume.length-1];
        var lastVolume = prefixSums_Volume[prefixSums_Volume.length-1];

        if(nPeriodsBack==0){ //if only 1 value available, return it
            return lastPriceTimesVolume/lastVolume;
        }

        var sumPriceTimesVolume = lastPriceTimesVolume - prefixSums_PriceTimesVolume[i0];
        var sumVolume = lastVolume - prefixSums_Volume[i0];
        return sumPriceTimesVolume/sumVolume;
    }

    return this;
}

module.exports = Vwap;