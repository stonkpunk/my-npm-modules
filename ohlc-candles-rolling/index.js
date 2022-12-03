module.exports = function(maxPeriods=20000){
    var _this = this;
    this.index = 0;
    this.b = new Float32Array(maxPeriods);
    this.a = new Float32Array(maxPeriods);
    this.o = new Float32Array(maxPeriods);
    this.h = new Float32Array(maxPeriods);
    this.l = new Float32Array(maxPeriods);
    this.c = new Float32Array(maxPeriods);
    this.v = new Float32Array(maxPeriods);
    this.td = new Int32Array(maxPeriods);
    this.ts = new BigInt64Array(maxPeriods);

    this.submitCandle = function(o=0,h=0,l=0,c=0,v=0, b=0,a=0,td=0,ts=0){
        var i = _this.index;
        _this.b[i] = b;
        _this.a[i] = a;
        _this.o[i] = o;
        _this.h[i] = h;
        _this.l[i] = l;
        _this.c[i] = c;
        _this.v[i] = v;
        _this.td[i] = td;
        _this.ts[i] = BigInt((ts||0));
        _this.index=(_this.index+1)%maxPeriods;
    }

    this.getCandle = function(n){
        var i = (_this.index-n+maxPeriods)%maxPeriods;
        return {
            o: _this.o[i],
            h: _this.h[i],
            l: _this.l[i],
            c: _this.c[i],
            v: _this.v[i],
            b: _this.b[i],
            a: _this.a[i],
            td: _this.td[i],
            ts: _this.ts[i]
        }
    }

    return this;
}