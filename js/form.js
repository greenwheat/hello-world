/*
 * 选项卡
 *
 * */
var oTab = document.getElementById("tabs");
var oUl = oTab.getElementsByTagName("ul")[0];
var oLis = oUl.getElementsByTagName("li");
var oDivs = oTab.getElementsByTagName("div");
function changeTab(index) {
    for (var i = 0; i < oLis.length; i++) {
        oLis[i].className = "";
        oDivs[i].className = "";
    }
    oLis[index].className = "select";
    oDivs[index].className = "select";
}
for (var i = 0; i < oLis.length; i++) {
    oLis[i].num = i;
    oLis[i].onmouseover = function () {
        changeTab(this.num);
    }
}
/*
 *
 * 表单验证：使用正则来验证输入信息，包括：
 * 非空验证、姓名中文2-4长度、密码6-10位必须同时包含大小写字母和数字
 *
 *
 * */
var oForm = document.forms.item(0);
var oName = oForm.name;
var oPsw = oForm.password;
/*
 *
 * 清空文本框默认值
 *
 * */
function clearContent() {
    this.style.color = "#000";
    if (this.value == this.defaultValue) {
        this.value = "";
    }
}
/*
 * 添加提示信息
 * @param str 想要提示的信息文本
 * @param bool 不同类型的信息，文本颜色不同
 *
 * */
function addTip(str, bool) {
    var oTip = document.getElementById(this.name);
    if (!oTip) {
        oTip = document.createElement("span");
        oTip.id = this.name;
        this.parentNode.insertBefore(oTip, this.nextSibling);
    }
    oTip.innerText = str;
    oTip.style.color = bool ? "green" : "red";

}
oName.onfocus = clearContent;
oName.onblur = function () {
    var tip = "";
    var bool = false;
    if (/^\s*$/.test(this.value)) {
        tip = "输入内容为空";
    }else if(/^[\u4e00-\u9fa5]{2,4}$/.test(this.value)) {
        tip = "√";
        bool = true;
        this.value.replace(/\s+/g,"");
    }else{
        tip = "请输入中文2-4位";
    }
    addTip.call(this, tip, bool);
    if (!bool) {
        this.value = this.defaultValue;
        this.style.color = "#999";
    }
};
oPsw.onfocus = clearContent;
oPsw.onblur = function () {
    var tip = "";
    var bool = false;
    var str = this.value;
    if(/^\s*$/.test(str)) {
        tip = "密码不能为空";
    }else if(/[^a-zA-Z0-9]/.test(str)){
        tip = "密码只能包含大小写字母或数字";
    }else if(/^[\w\W]{1,5}$/.test(str)) {
        tip = "密码长度不能少于6位";
    }else if(/^[\w\W]{11,}$/.test(str)){
        tip = "密码长度不要超过10位";
    }else if(/^[a-zA-Z0-9]{6,10}$/.test(str)) {
        tip = "√";
        bool = true;
    }else{
        tip = "请输入6-10位密码，包含大小写字母或数字"
    }
    addTip.call(this, tip, bool);
    if (!bool) {
        this.value = this.defaultValue;
        this.style.color = "#999";
    }
};

//提交，如果上述验证不通过，则不予提交
oForm.onsubmit = function () {
    if(!/^[\u4e00-\u9fa5]{2,4}$/.test(oName.value)||!/^[a-zA-Z0-9]{6,10}$/.test(oPsw.value)){
        new MessageBox("提示","姓名或密码不正确，请重新输入！").popUp();
        return false;//阻止表单提交
    }
};


/*表格排序*/
var oT = document.getElementById("table");
var tHead = oT.tHead;
var ths = tHead.rows[0].cells;
var tBody = oT.tBodies[0];
var oTrs = tBody.rows;

/*xml数据获取和绑定*/
var xhr = new XMLHttpRequest();
var data = null;
xhr.open('get','js/data.txt',false);
xhr.onreadystatechange = function () {
    if(xhr.readyState===4 && /^2\d{2}$/.test(xhr.status)){
        data = utils.jsonParse(xhr.responseText);
    }
};
xhr.send(null);

function changeBg() {
    for(var i=0;i<oTrs.length;i++){
        oTrs[i].style.backgroundColor = (i%2)?"#77c893":"#eee";
    }
}

function bindData() {
    var frg = document.createDocumentFragment();
    for(var j=0;j<data.length;j++){
        var oTr = document.createElement("tr");
        for(var key in data[j]){
            var otd = document.createElement("td");
            if(key=="sex"){
                otd.innerHTML = parseInt(data[j][key])?"男":"女";
            }else{
                otd.innerHTML = data[j][key];
            }
            oTr.appendChild(otd);
        }
        frg.appendChild(oTr);
    }
    tBody.appendChild(frg);
    frg = null;
    changeBg();
}
bindData();

function sortData(i) {
    var that = this;
    for(var m=0;m<ths.length;m++){
        if(ths[m]!=that){
            ths[m].flag = -1;
        }
    }
    that.flag *= -1;
    var arr = utils.listToArray(oTrs);
    arr.sort(function (a,b) {
        var _a = a.cells[i].innerHTML;
        var _b = b.cells[i].innerHTML;
        if(isNaN(parseFloat(_a))||isNaN(parseFloat(_b))){
            return (_a.localeCompare(_b))*that.flag;
        }else{
            return (parseFloat(_a)-parseFloat(_b))*that.flag;
        }
    });
    var frg = document.createDocumentFragment();
    for(var j=0;j<arr.length;j++){
        frg.appendChild(arr[j]);
    }
    tBody.appendChild(frg);
    frg = null;
    changeBg();
}
for(var j=0;j<ths.length;j++){
    ths[j].flag = -1;
    ths[j].num = j;
    ths[j].onclick = function () {
        var that = this;
        sortData.call(that,that.num);
        var timer = setTimeout(function () {
            clearTimeout(timer);
            that.style.backgroundColor = "#a35045";
            timer = setTimeout(function () {
                clearTimeout(timer);
                that.style.backgroundColor = "";
            },250);
        },0);
    }
}

/*千分符-正则复习*/
function judge() {
    var num = parseFloat(document.getElementsByName("number").item(0).value);
    if(isNaN(num)){
        return 0;
    }else{
        return 1;
    }
}
var result = document.getElementById("result");
var oBtns = document.getElementsByName("addComma");
for(var n=0;n<oBtns.length;n++){
    (function(i){
        oBtns[i].onclick = function () {
            var num = document.getElementsByName("number").item(0).value;
            if(isNaN(num)){
                result.innerHTML = 0;
            }else{
                switch(i+1){
                    case 1:
                        str = num.split('').reverse().join('').replace(/(\d{3})(?!$)/g,"$1,").split('').reverse().join('');
                        break;
                    case 2:
                        str = num.replace(/^(\d{1,3})((\d{3})+)$/,function (a,b,c) {
                            return b+","+c.replace(/(\d{3})(?!$)/g,"$1,");
                        });
                        break;
                    case 3:
                        str = num.replace(/\d(?!$)/g,function (a,b,c) {
                            var i = c.length-1-b;
                            if(i%3==0){
                                return a+",";
                            }else{
                                return a;
                            }
                        });
                        break;
                    default:
                        str = "cannot do it.";
                }
                result.innerHTML = str;
            }

        }
    })(n);
}

var reg1 = new RegExp("(\\d{1,2})((\\d{3})+)(?!$)");
var str = "12345678";
//    console.log(str.replace(reg1,function (a,b,c) {
//        return b+","+c.replace(/(\d{3})/g,"$1,");
//    }));
console.log(str.replace(/\d(?!$)/g,function (a,b,c) {
    var i = c.length-1-b;
    if(i%3==0){
        return a+",";
    }else{
        return a;
    }
}));