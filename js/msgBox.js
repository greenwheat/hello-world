/*
 * 页面中央消息框
 *
 * */
function MessageBox(title,content){
    this._t = title;
    this._c = content;
    this.popUp = function () {
        var m = document.getElementById("boxBg");
        //var box = document.getElementById("messageBox");
        var t = document.getElementById("t");
        var c = document.getElementById("c");
        var s = document.getElementById("s");
        t.innerHTML = this._t;
        c.innerHTML = this._c;
        m.style.display = "";
        s.onclick = function () {
            if(m.style.display==""){
                m.style.display="none";
            }
        };
    }
}
