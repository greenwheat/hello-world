var DOM = {
    isLowerIE: /MSIE (6|7|8)/i.test(navigator.userAgent),
    listToArray: function (list) {
        var arr=[];
        try{
            arr = Array.prototype.slice.call(list);
        }catch (e){
            for(var i=0;i<list.length;i++){
                arr[arr.length] = list[i];
            }
        }
        return arr;
    },
    /**
     * children的兼容方法
     * @param ele
     * @returns {Array}
     */
    getChildren: function (ele) {
        var childNodes = ele.children;
        var arr = [];
        if(this.isLowerIE){
            for(var i=0;i<childNodes.length;i++){
                var cur = childNodes[i];
                if(cur.nodeType==1){
                    arr[arr.length] = cur;
                }
            }
        }else{
            arr = this.listToArray(childNodes);
        }
        return arr;
    },
    getPrev: function (ele) {
        var p = ele.previousSibling;
        while(p&&p.nodeType!==1){
            p = p.previousSibling;
        }
        return p;
    },
    getNext: function (ele) {
        var n = ele.nextSibling;
        while(n&&n.nodeType!==1){
            n = n.nextSibling;
        }
        return n;
    },
    getPrevAll: function (ele) {
        var arr = [];
        var p = this.getPrev(ele);
        while(p){
            arr[arr.length] = p;
            p = this.getPrev(p);
        }
        return arr.reverse();
    },
    getNextAll: function (ele) {
        var arr = [];
        var n = this.getNext(ele);
        while(n){
            arr[arr.length] = n;
            n = this.getNext(n);
        }
        return arr;
    },
    getSibling: function (ele) {
        var arr = [];
        this.getPrev(ele)?arr.push(this.getPrev(ele)):void 0;
        this.getNext(ele)?arr.push(this.getNext(ele)):void 0;
        return arr;
    },
    getSiblings: function (ele) {
        return this.getPrevAll(ele).concat(this.getNextAll(ele));
    },
    index: function (ele) {
        return this.getPrevAll(ele).length;
    },
    firstChild: function (ele) {
        if(this.isLowerIE){
            var c = this.getChildren(ele);
            return c.length?c[0]:null;
        }
        return ele.firstElementChild;
    },
    lastChild: function (ele) {
        var c = this.getChildren(ele);
        return c.length?c[c.length-1]:null;
    },
    append: function (ele,container) {
        return container.appendChild(ele);
    },
    preAppend: function (ele,container) {
        return container.insertBefore(ele,this.firstChild(container));
    },
    insertBefore: function (newEle,oldEle) {
        if(typeof oldEle == 'undefined'){
            return document.body.insertBefore(newEle);
        }
        var par = oldEle.parentNode || document.body;
        return par.insertBefore(newEle,oldEle);
    },
    insertAfter: function (newEle,oldEle) {
        if(typeof oldEle == 'undefined'){
            return this.insertBefore(newEle);
        }
        return this.insertBefore(newEle,this.getNext(oldEle));
    },
    getByClass: function (className,container) {
        var allTags = container.getElementsByTagName('*');
        var classList = className.split(/\s+/);
        var arr = [];
        for(var i=0;i<allTags.length;i++){
            var cur = allTags[i];
            var flag = true;
            for(var j=0;j<classList.length;j++){
                var reg = new RegExp('(?:^| )'+classList[j]+'(?: |$)');
                if(!reg.test(cur.className)){
                    flag = false;
                    break;
                }
            }
            if(flag){
                arr[arr.length] = cur;
            }
        }
        return arr;
    },
    hasClass: function (ele,className) {
        var classList = className.replace(/^ +| +$/g,'').split(/\s+/); //去看开头或结尾的空格，避免split时产生空项
        var flag = true;
        for(var i=0;i<classList.length;i++){
            var reg = new RegExp('(?:^| +)'+classList[i]+'(?: +|$)');
            if(!reg.test(ele.className)){
                flag = false;
                break;
            }
        }
        return flag;
    },
    addClass: function (ele,className) {
        var classList = className.replace(/^ +| +$/g,'').split(/\s+/);
        for(var i=0;i<classList.length;i++){
            if(!this.hasClass(ele,classList[i])){
                ele.className = ele.className.replace(/ +$/,'')+ " " + classList[i];
            }
        }
        return ele.className;
    },
    removeClass: function (ele,className) {

        //var eleClass = ele.className.split(/\s+/);
        //var arr = [];
        console.log(ele.className);
        // console.log(eleClass);
        var classList = className.replace(/^ +| +$/g,'').split(/\s+/);
        for(var i=0;i<classList.length;i++){
            var reg = new RegExp("(?:^|\\s+?|\\b)"+classList[i]+"(\\s+?|$)","g");
            ele.className = ele.className.replace(reg,"$1");
        }
        ele.className = ele.className.replace(/\s+/g,' ');
        /*for(var i=0;i<eleClass.length;i++){
            var cur = eleClass[i];
            for(var j= 0;j<classList.length;j++){
                if(classList[j]!==cur){
                    arr[arr.length] = cur;
                }else{
                    break;
                }
            }
        }
        ele.className = arr.join(" ");*/
        return ele.className;
    },
    getCSS: function (ele,attr,selector) {
        var val = "";
        if(ele&&ele.nodeType==1&&typeof attr=='string'){
            if('getComputedStyle' in window){
                selector = (typeof selector!=='string')?null:selector;
                val = getComputedStyle(ele,selector)[attr];
            }else{
                if(attr === 'opacity'){
                    val = ele.currentStyle['filter'];
                    var reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
                    val = reg.exec(val)[1]/100;
                }else{
                    console.log(attr);
                    val = ele.currentStyle[attr];
                }
            }
            console.log(val);
            return /^-?\d+(?:\.\d+)?(?:px|pt|em|rem)?$/.test(val)?parseFloat(val):val;
        }else{
            alert('getCSS arguments error');
            return val;
        }
    },
    setCSS: function (ele,attr,val) {
        if(ele&&ele.nodeType==1&&typeof attr=='string'){
            if(attr=='opacity'&&typeof val=='number'){
                val<0?val=0:void 0;
                val>100?val=100:void 0;
                ele.style['opacity'] = val;
                ele.style['filter'] = 'alpha(opacity=' +(val*100)+')';
            }else if(attr=='float'){
                ele.style['cssFloat'] = val;
                ele.style['styleFloat'] = val;
            }else if(/left|top|width|height|borderRadius/.test(attr)&&(!isNaN(val))){
                ele.style[attr] = val + 'px';
            }else{
                ele.style[attr] = val;
            }
        }else{
            alert('setCSS arguments error');
            return false;
        }
    },
    setGroupCSS: function (ele,groupCSS) {
        if(groupCSS&&typeof groupCSS=='object'){
            if(ele&&ele.nodeType&&ele.nodeType===1){
                for(var key in groupCSS){
                    if(groupCSS.hasOwnProperty(key)){
                        this.setCSS(ele,key,groupCSS[key]);
                    }
                }
            }else if(ele&&ele.length&&ele.length>0){
                for(var i=0;i<ele.length;i++){
                    for(key in groupCSS){
                        if(groupCSS.hasOwnProperty(key)){
                            this.setCSS(ele[i],key,groupCSS[key]);
                        }
                    }
                }
            }else{
                alert('setGroupCSS arguments[0] error');
            }
        }else{
            alert('setGroupCSS arguments[1] error');
        }
    },
    css: function (ele) {
        var attr = arguments[1];
        if(typeof attr==="string"){
            var val = arguments[2];
            if(typeof val==="undefined"){
                return this.getCSS.apply(this,arguments);
            }
            this.setCSS.apply(this,arguments);
            return;
        }
        attr = attr||0;
        if(attr.toString()==="[object Object"){
            this.setGroupCSS.apply(this,arguments);
        }
   /*     console.log(attr,val);
        if(ele&&ele.nodeType&&ele.nodeType===1){
            if(attr&&typeof attr==='string'){
                console.log(attr,val);
                typeof val==='undefined'?this.getCSS(ele,attr):this.setCSS(ele,attr,val);
            }else if(attr&&typeof attr ==='object'){
                this.setGroupCSS(ele,attr);
            }else{
                alert('css arguments[1] error');
            }
        }else if(ele&&ele.length&&ele.length>0){
            this.setGroupCSS(ele,attr);
        }else{
            alert('css arguments[0] error');
        }
*/
    },
    win:function (attr,val) {
        if(typeof val=='undefined'){
            return document.documentElement[attr]||document.body[attr];
        }
        document.documentElement[attr] = val;
        document.body[attr] = val;
    },
    offSet: function (ele) {
        var x = ele.offsetLeft;
        var y = ele.offsetTop;
        var p = ele.offsetParent;
        while(p){
            x += p.offsetLeft;
            y += p.offsetTop;
            p = p.offsetParent;
        }
        return {x:x,y:y};
    }
};
