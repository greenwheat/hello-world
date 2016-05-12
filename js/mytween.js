/**
 * Created by zhengli on 2016-05-10.
 */
var myEffects = {
    linear:function (t,b,c,d) {
        return t/d*c+b;
    }
};
function myAnimate(ele,attr,target,duration,effect,callback) {
    var fnEffect = myEffects.linear;
    if(typeof effect==="number"){
        switch(effect){
            case 0:
            case 1:
            case 2:
            case 3:
            default:
                fnEffect = myEffects.linear;
        }
    }else if(Object.prototype.toString.call(effect)==="[object Array]"){
        if(effect.length==2&&myEffects[effect[0]]&&myEffects[effect[0]][effect[1]]){
            fnEffect = myEffects[effect[0]][effect[1]];
        }else if(effect.length==1){
            fnEffect = myEffects[effect[0]];
        }else{
            fnEffect = myEffects.linear;
        }
    }else if(typeof effect==="function"){
        callback=effect;
    }
    var begin = myAnimate.css.call(ele,attr);
    var change = target - begin;
    if(change==0){
        return;
    }
    var interval = 15;
    var times = 0 ;
    window.clearInterval(ele.timer);
    ele.timer=null;
    function step() {
        times += interval;
        if(times>=duration){
            myAnimate.css.call(ele,attr,target);
            window.clearInterval(ele.timer);
            ele.timer=null;
            if(typeof callback==="function"){
                callback.call(ele);
            }
            return;
        }
        var val = fnEffect(times,begin,change,duration);
        myAnimate.css.call(ele,attr,val);
    }
    ele.timer = setInterval(step,interval);
}
myAnimate.css=function (attr,val) {
    if(typeof val==="undefined"){
        if("getComputedStyle" in window){
            return parseFloat(window.getComputedStyle(this,null)[attr]);
        }else{
            if(attr==="opacity"){
                var value = this.currentStyle.filter;
                var reg = /alpha\(opacity=(\d+(?:\.\d+)?)\)/i;
                console.log(value);
                return reg.test(value)?RegExp.$1:1;
            }
            return parseFloat(this.currentStyle[attr]);
        }
    }else{
        var cur = this.style;
        if(attr==="opacity"){
            cur.opacity = val;
            cur.filter = "alpha(opacity="+val*100+")";
        }else{
            cur[attr]=val+"px";
        }
    }
};