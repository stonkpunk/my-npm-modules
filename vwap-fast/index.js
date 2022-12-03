function Vwap(maximumRows=20000){
    var _this = this;

    var currentArrayIndex = 0;
    var prefixSums_PriceTimesVolume=new Float64Array(maximumRows);//.fill(0.0); //typed arrays are already initialized to zero
    var prefixSums_Volume=new Float64Array(maximumRows);//.fill(0.0);

    this.totalCandles=0;
    this.prefixSums_PriceTimesVolume = prefixSums_PriceTimesVolume;
    this.prefixSums_Volume = prefixSums_Volume;
    this.currentArrayIndex = currentArrayIndex;

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

    this.submitCandle = function(candle, useTypicalPrice=true, doAutoShift=true){ //candle = {o,h,l,c,v}
        var typ = useTypicalPrice ? (candle.h+candle.l+candle.c)/3.0 : candle.c; //typical price

        var previousIndex = (currentArrayIndex + maximumRows-1)%maximumRows;
        var nextIndex = (currentArrayIndex+1)%maximumRows;

        if(doAutoShift && nextIndex==0){ //shift values down after every "loop"
            var startingVolume = prefixSums_Volume[0]+0;
            var startingVolumeTimesPrice = prefixSums_PriceTimesVolume[0]+0;
            for(var i=0;i<prefixSums_Volume.length;i++){
                prefixSums_Volume[i]-=startingVolume;
                prefixSums_PriceTimesVolume[i]-=startingVolumeTimesPrice;
            }
            //set start to exactly zero
            prefixSums_Volume[0]=0;
            prefixSums_PriceTimesVolume[0]=0;
        }

        var previousValuePV = prefixSums_PriceTimesVolume[currentArrayIndex];
        var previousValueV = prefixSums_Volume[currentArrayIndex];

        prefixSums_PriceTimesVolume[nextIndex] = (previousValuePV+typ*candle.v);
        prefixSums_Volume[nextIndex] = (previousValueV+candle.v);

        _this.totalCandles++;
        currentArrayIndex=nextIndex;
        _this.currentArrayIndex = currentArrayIndex;
    }

    this.getVwap = function(nPeriods=1){
        //if(nPeriods<1){throw 'nPeriods must be greater than zero'}
        //if(prefixSums_PriceTimesVolume.length<1){throw 'vwap requires at least 1 candle to be submitted'}

        if(nPeriods>maximumRows){
            throw 'nPeriods must be <= maximumRows'
        }

        var nPeriodsBack = nPeriods - 1;
        var i0 = (currentArrayIndex-nPeriodsBack+maximumRows)%maximumRows;
        var lastPriceTimesVolume = prefixSums_PriceTimesVolume[currentArrayIndex];
        var lastVolume = prefixSums_Volume[currentArrayIndex];

        if(nPeriodsBack==0){ //if only 1 value available, return it
            return lastPriceTimesVolume/lastVolume;
        }

        var sumPriceTimesVolume = lastPriceTimesVolume - prefixSums_PriceTimesVolume[i0];
        var sumVolume = lastVolume - prefixSums_Volume[i0];
        return sumPriceTimesVolume/sumVolume;
    }

    this.getVwapNPeriodsAgo = function(nPeriodsInVwap=1, nPeriodsAgo=0){
        //if(nPeriods<1){throw 'nPeriods must be greater than zero'}
        //if(prefixSums_PriceTimesVolume.length<1){throw 'vwap requires at least 1 candle to be submitted'}

        if(nPeriodsInVwap>maximumRows){
            throw 'nPeriods must be <= maximumRows'
        }

        var _currentArrayIndex = (currentArrayIndex-nPeriodsAgo+maximumRows)%maximumRows;

        var nPeriodsBack = nPeriodsInVwap - 1;
        var i0 = (_currentArrayIndex-nPeriodsBack+maximumRows)%maximumRows;
        var lastPriceTimesVolume = prefixSums_PriceTimesVolume[_currentArrayIndex];
        var lastVolume = prefixSums_Volume[_currentArrayIndex];

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