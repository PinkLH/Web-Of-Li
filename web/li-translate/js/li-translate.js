/**
 * 我就是我，不一样的烟火！
 * @author 黎宏
 */

/**
 * APP ID
 * @type {string}
 */
const APPID = "20220516001217751";

/**
 * 密钥
 * @type {string}
 */
const KEY = "_Nzdk52lhoveAzS_uAZb";

/**
 * 百度翻译接口地址
 * @type {string}
 */
const baiduTranslateURL = "https://fanyi-api.baidu.com/api/trans/vip/translate";

/**
 * 百度语言识别接口地址，暂时没有用到
 * @type {string}
 */
// const baiduLanguageURL = "https://fanyi-api.baidu.com/api/trans/vip/language";

$(function () {
    var $notTranslated = $("#notTranslated");
    var $translated = $("#translated");

    showLang();

    $notTranslated.focus();

    autoTextarea($notTranslated[0], 24);

    $notTranslated.bind('input', function () {
        if ($notTranslated.val().trim() === "") {
            $translated.val("");
            $translated.css("height", 300);
        }

    });

    $("#translateButton").click(translate)

    $('.photoItems').poshytip({
        className: 'tip-twitter',
        showTimeout: 500,
        offsetY: -48,
        offsetX: 10
    });
    $('.dropdown-toggle').poshytip({
        className: 'tip-twitter',
        showTimeout: 500,
        offsetY: -48,
        offsetX: 10
    });
    $(".transfer").poshytip({
        className: 'tip-twitter',
        showTimeout: 500,
        offsetY: -48,
        offsetX: 10
    });
    $(".langUl>li>a").poshytip({
        className: 'tip-twitter',
        showTimeout: 500,
        slide: false,
        offsetY: -25,
        offsetX: 15
    });
})

/**
 * 翻译
 */
function translate() {
    var $notTranslated = $("#notTranslated");
    var $translated = $("#translated");
    autoTextarea($translated[0], 24);
    var q = $notTranslated.val().trim();
    if (q) {
        var salt = randomFrom(1, 100000);
        var sign = md5(APPID + q + salt + KEY);
        var from = $(".fromT").attr("langCode")
        var to = $(".toT").attr("langCode")
        var dataVal = {
            q: q,
            salt: salt,
            from: from,
            to: to,
            appid: APPID,
            sign: sign
        }
        $.ajax({
            url: baiduTranslateURL,
            data: dataVal,
            dataType: "jsonp",
            success: function (data) {
                console.log(data);
                var value = "";
                for (let i = 0; i < data.trans_result.length; i++) {
                    if (i === data.trans_result.length - 1){
                        value = value + data.trans_result[i].dst;
                    }else{
                        value = value + data.trans_result[i].dst + "\n";
                    }
                }
                $translated.val(value);
                autoTextarea($translated[0], 24);
            }
        });
        // $.ajax({
        //     url: baiduLanguageURL,
        //     data: dataVal,
        //     dataType: "jsonp",
        //     success: function (data) {
        //         console.log(data)
        //         if (data.error_code && data.error_code === "54009") {
        //             $.ajax({
        //                 url: baiduTranslateURL,
        //                 data: dataVal,
        //                 dataType: "jsonp",
        //                 success: function (data) {
        //                     console.log(data);
        //                     var value = "";
        //                     for (let i = 0; i < data.trans_result.length; i++) {
        //                         if (i === data.trans_result.length - 1){
        //                             value = value + data.trans_result[i].dst;
        //                         }else{
        //                             value = value + data.trans_result[i].dst + "\n";
        //                         }
        //                     }
        //                     $translated.val(value);
        //                     autoTextarea($translated[0], 24);
        //                 }
        //             });
        //         } else {
        //             dataVal.from = data.data.src;
        //             if (data.data.src === "zh") {
        //                 dataVal.to = "en";
        //             }
        //             $.ajax({
        //                 url: baiduTranslateURL,
        //                 data: dataVal,
        //                 dataType: "jsonp",
        //                 success: function (data) {
        //                     console.log(data);
        //                     var value = "";
        //                     for (let i = 0; i < data.trans_result.length; i++) {
        //                         if (i === data.trans_result.length - 1){
        //                             value = value + data.trans_result[i].dst;
        //                         }else{
        //                             value = value + data.trans_result[i].dst + "\n";
        //                         }
        //                     }
        //                     $translated.val(value);
        //                     autoTextarea($translated[0], 24);
        //                 }
        //             });
        //         }
        //     }
        // });
    } else {
        alterUtil.message("你还没输入东西呢！", "danger");
    }
}

/**
 * 展示语言
 */
function showLang(){
    langData.forEach(element => {
        $(".langUl").append(`
            <li>
                <a href="javascript:void(0);" onclick="changeLang(this)" 
                langCode="`+element.code+`" langName="`+element.name+`" title="`+element.name+`">`+element.name+`</a>
            </li>
        `);
    })
}

/**
 * 交换翻译语言
 */
function transferLang() {
    var $fromT = $(".fromT");
    var $toT = $(".toT");
    var $dropdownToggle = $('.dropdown-toggle');

    var tempTitle = $fromT.attr("title");
    var tempLangCode = $fromT.attr("langCode");
    var tempLangName = $fromT.attr("langName");
    var tempHTML = $fromT.html();

    $fromT.attr("title", $toT.attr("title"));
    $fromT.attr("langCode", $toT.attr("langCode"));
    $fromT.attr("langName", $toT.attr("langName"));
    $fromT.html($toT.html());

    $toT.attr("title", tempTitle);
    $toT.attr("langCode", tempLangCode);
    $toT.attr("langName", tempLangName);
    $toT.html(tempHTML);

    $dropdownToggle.poshytip('destroy');
    $dropdownToggle.poshytip({
        className: 'tip-twitter',
        showTimeout: 500,
        offsetY: -48,
        offsetX: 10
    });
}

/**
 * 改变语言
 * @param obj 改变语言的DOM对象
 */
function changeLang(obj){
    var $transfer = $(".transfer");
    var $dropdownToggle = $('.dropdown-toggle');
    var $obj = $(obj);
    var $btn = $obj.parents(".langUl").prev();

    $btn.attr("title", $obj.attr("langName"));
    $btn.attr("langCode", $obj.attr("langCode"));
    $btn.attr("langName", $obj.attr("langName"));
    $btn.find(".langText").html($obj.attr("langName"));

    if ($(".fromT").attr("langCode") === "auto") {
        $transfer.css("color", "#c1c1c1");
        $transfer.attr("onclick", "void(0)");
        $transfer.attr("title","无法交换");
    } else {
        $transfer.css("color", "black");
        $transfer.attr("onclick", "transferLang()");
        $transfer.attr("title","交换语言");
    }

    $transfer.poshytip('destroy');
    $transfer.poshytip({
        className: 'tip-twitter',
        showTimeout: 500,
        offsetY: -48,
        offsetX: 10
    });

    $dropdownToggle.poshytip('destroy');
    $dropdownToggle.poshytip({
        className: 'tip-twitter',
        showTimeout: 500,
        offsetY: -48,
        offsetX: 10
    });

}

/**
 * 得到两个数之间的整数随机数，不包括最大值
 * @param minValue 最小值
 * @param maxValue 最大值
 * @returns {number} 返回的随机数
 */
function randomFrom(minValue, maxValue) {
    return Math.floor(Math.random() * (maxValue - minValue) + minValue);
}

/**
 * 文本框根据输入内容自适应高度
 * @param elem 输入框元素
 * @param extra 设置光标与输入框保持的距离(默认0)
 * @param maxHeight 设置最大高度(可选)
 */
function autoTextarea(elem, extra, maxHeight) {
    extra = extra || 0;
    var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
        isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
        addEvent = function (type, callback) {
            elem.addEventListener ?
                elem.addEventListener(type, callback, false) :
                elem.attachEvent('on' + type, callback);
        },
        getStyle = elem.currentStyle ? function (name) {
            var val = elem.currentStyle[name];

            if (name === 'height' && val.search(/px/i) !== 1) {
                var rect = elem.getBoundingClientRect();
                return rect.bottom - rect.top -
                    parseFloat(getStyle('paddingTop')) -
                    parseFloat(getStyle('paddingBottom')) + 'px';
            }
            return val;
        } : function (name) {
            return getComputedStyle(elem, null)[name];
        },
        minHeight = parseFloat(getStyle('height'));

    elem.style.resize = 'none';

    var change = function () {
        var scrollTop, height,
            padding = 0,
            style = elem.style;

        if (elem._length === elem.value.length) return;
        elem._length = elem.value.length;
        if (!isFirefox && !isOpera) {
            padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
        }
        scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        elem.style.height = minHeight + 'px';
        if (elem.scrollHeight > minHeight) {
            if (maxHeight && elem.scrollHeight > maxHeight) {
                height = maxHeight - padding;
                style.overflowY = 'auto';
            } else {
                height = elem.scrollHeight - padding;
                style.overflowY = 'hidden';
            }
            style.height = height + extra + 'px';
            scrollTop += parseInt(style.height) - elem.currHeight;
            document.body.scrollTop = scrollTop;
            document.documentElement.scrollTop = scrollTop;
            elem.currHeight = parseInt(style.height);
        }
    }

    addEvent('propertychange', change);
    addEvent('input', change);
    addEvent('focus', change);
    change();

}