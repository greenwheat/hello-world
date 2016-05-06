/**
 * Created by zhengli on 2016-05-06.
 */
var tween = (function () {
    var myEffect = {
        /**
         * 获取匀速运动时每步的到达位置
         * @param t
         * @param b
         * @param c
         * @param d
         * @returns {*}
         */
        linear: function (t, b, c, d) {
            if (!isNaN(t) &&!isNaN(b) &&!isNaN(c) &&!isNaN(d)) {
                return t * c / d + b;
            } else {
                alert('linear arguments error');
                return 0;
            }
        },
        hurry: function (t,b,c,d) {
            return Math.pow(t,2) * c / Math.pow(d,2) + b;
        },
        ease: function (t,b,c,d) {
            return Math.sqrt(t) * c / Math.sqrt(d) + b;
        }
    };

    /**
     * 获取鼠标单击的坐标
     * @param e
     * @returns {{x: (Number|*), y: (Number|*)}}
     */
    function getMousePos(e) {
        e = event || window.event;
        var scrollX = DOM.win('scrollLeft');
        var scrollY = DOM.win('scrollTop');
        var x = e.pageX || e.clientX + scrollX;
        var y = e.pageY || e.clientY + scrollY;
        console.log('x: ' + x + 'y: ' + y);
        return {'x': x, 'y': y};
    }

    function move(curEle, target, duration,option) {
        window.clearInterval(curEle.timer);
        var begins = {}, changes = {};
        for (var attr in target) {
            if (target.hasOwnProperty(attr)) {
                begins[attr] = DOM.getCSS(curEle, attr);
                changes[attr] = target[attr] - begins[attr];
                console.log('begins[' + attr + ']:' + begins[attr]);
                console.log('changes[' + attr + ']:' + changes[attr]);
            }
        }
        var time = 0;
        option = option || 'linear';
        curEle.timer = setInterval(function () {
            time += 10;
            if (time >= duration) {
                DOM.setGroupCSS(curEle, target);
                window.clearInterval(curEle.timer);
                return this;
            }
            for (var attr in target) {
                if (target.hasOwnProperty(attr)) {
                    var curState= myEffect[option](time, begins[attr], changes[attr], duration);
                    DOM.setCSS(curEle,attr,curState);
                }
            }
        }, 10);
    }

    window.myAnimation = move;
    return {
        getMousePos: getMousePos,
        move: move
    };
})();