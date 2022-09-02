var alterUtil = {
    /**
     * 弹出消息框
     * @param msg 消息内容
     * @param type 消息框类型（参考bootstrap的alert）
     */
    alert: function (msg, type) {
        if (typeof (type) == "undefined") { // 未传入type则默认为success类型的消息框
            type = "success";
        }
        // 创建bootstrap的alert元素
        var divElement = $("<div></div>").addClass('alert').addClass('alert-' + type).addClass('alert-dismissible').addClass('col-md-2').addClass('col-md-offset-5');
        divElement.css({ // 消息框的定位样式
            "position": "absolute",
            "top": "0px",
            "width": "200px",
            "left": "50%",
            "margin-left": "-100px",
            "z-index": 1000,
            "display": "none",
            "box-shadow": "0 3px 6px -4px #0000001f," +
                " 0 6px 16px #00000014," +
                " 0 9px 28px 8px #0000000d",
            "border": "none",
            "text-align": "center",
            "font-weight": "bold",
            "height": "40px"
        });
        divElement.text(msg); // 设置消息框的内容
        // 消息框添加可以关闭按钮
        var closeBtn = $('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        $(divElement).append(closeBtn);
        // 消息框放入到页面中
        $('body').append(divElement);
        var IntervalMS = 15; // 每次下浮的间隔毫秒
        var floatSpace = 15; // 下浮的空间(px)
        var nowTop = divElement.offset().top; // 获取元素当前的top值
        var stopTop = nowTop + floatSpace;    // 下浮停止时的top值
        divElement.fadeIn(IntervalMS * floatSpace) // 设置元素淡入

        var downFloat = setInterval(function () { // 开始下浮
            if (nowTop <= stopTop) { // 判断当前消息框top是否还在可下降的范围内
                divElement.css({"top": nowTop++}); // 消息框的top下降1px
            } else {
                clearInterval(downFloat); // 关闭下浮
            }
        }, IntervalMS);
        return divElement;
    },

    /**
     * 短暂显示后上浮消失的消息框
     * @param msg 消息内容
     * @param type 消息框类型
     */
    message: function (msg, type) {
        var divElement = this.alert(msg, type); // 生成Alert消息框

        setTimeout(function () {
            var IntervalMS = 20; // 每次上浮的间隔毫秒
            var floatSpace = 15; // 上浮的空间(px)
            var nowTop = divElement.offset().top; // 获取元素当前的top值
            var stopTop = nowTop - floatSpace;    // 上浮停止时的top值
            divElement.fadeOut(IntervalMS * floatSpace); // 设置元素淡出

            var upFloat = setInterval(function () { // 开始上浮
                if (nowTop >= stopTop) { // 判断当前消息框top是否还在可上升的范围内
                    divElement.css({"top": nowTop--}); // 消息框的top上升1px
                } else {
                    clearInterval(upFloat); // 关闭上浮
                    divElement.remove();    // 移除元素
                }
            }, IntervalMS);

        }, 2500);
    }
}