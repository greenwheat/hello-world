/**
 * Created by Administrator on 2016/4/22.
 */
var utils = {
    listToArray : function (likeArray) {
        var ary = [];
        try{
            ary = Array.prototype.slice.call(likeArray);
        }catch(e){
            for(var i=0;i<likeArray.length;i++){
                ary[ary.length] = likeArray[i];
            }
        }
        return ary;
    },
    jsonParse : function (str) {
        return "JSON" in window ? JSON.parse(str) : eval("("+str+")");
    }
    
};