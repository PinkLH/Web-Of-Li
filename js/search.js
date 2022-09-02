/**
 * 百度搜索提示接口，回调函数showBaiduData()
 * @type {string}
 */
const baiduTipsUrl = "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?cb=showBaiduData&wd=";

/**
 * Bing搜索提示接口，回调函数showBingData()
 * @type {string}
 */
const bingTipsUrl = "https://api.bing.com/qsonhs.aspx?type=cb&cb=showBingData&q=";

/**
 * 这个是测试的Bing接口，我还没有玩明白它，先不用它
 * @type {string}
 */
// const bingTipsUrl = "https://www.bing.com/AS/Suggestions?type=cb&cb=showBingData&cvid=f368abd3c3ed41ada21f700befdb9392&qry=";

$(function () {
    //进入页面就聚焦输入框
    $(".search-input").focus();

    //输入框每输入一个值时就显示搜索提示
    $(".search-input").bind('input', function () {
        //显示搜索提示
        showSearchContent();
    })

    //输入框搞回车就搜索
    $(".search-input").keypress(function (e) {
        //判断键盘是否点击了回车
        if (e.keyCode === 13) {
            //模拟点击搜索按钮
            $(".search-button").click();
        }
    })

    //点击输入框就显示搜索提示
    $(".search-input").click(function () {
        //显示搜索提示
        showSearchContent();
    })

    $(".search-input").blur(function () {
        setTimeout(function () {
            $(".searchTips-ul").hide();
            $(".search-input").css("border-bottom", "1px solid #ccc");
            $(".search-input-div").removeClass("search-input-div2");
        }, 300);
    })


    $(".search-button").click(function () {
        var textValue = $(".search-input").val().trim();
        var searchHistoryArray = JSON.parse(localStorage.getItem('searchHistorysOfLi'));
        if (!searchHistoryArray) {
            searchHistoryArray = [];
        }
        var value = encodeURIComponent(textValue);
        if (!value) {
            alterUtil.message("请输入搜索信息！", "danger");//success, info, warning, danger
        } else {
            if (!searchHistoryArray.includes(textValue)) {
                searchHistoryArray.unshift(textValue);
            } else {
                searchHistoryArray.splice(searchHistoryArray.indexOf(textValue), 1);
                searchHistoryArray.unshift(textValue);
            }
            if (searchHistoryArray.length > 50) {
                searchHistoryArray.pop();
            }
            localStorage.setItem('searchHistorysOfLi', JSON.stringify(searchHistoryArray))
            window.open($(this).attr("url") + value);
        }
    })

})

function showSearchContent() {
    delScript();
    let jsonP = document.createElement("script");
    jsonP.id = "jsonP";
    var textValue = $(".search-input").val().trim();
    var value = encodeURIComponent(textValue);
    if (value) {
        $(".searchTips-ul").css("padding", "10px 0");
        $(".searchTips-ul").show();
        $(".search-input").css("border-bottom", "none")
        $(".search-input-div").addClass("search-input-div2")
        var name = $(".searchTips-ul").attr("name");
        switch (name) {
            case "baidu":
                jsonP.src = baiduTipsUrl + value;
                document.body.appendChild(jsonP);
                break;

            case "bing":
                jsonP.src = bingTipsUrl + value;
                document.body.appendChild(jsonP);
                break;

            case "github":
                $(".searchTips-ul").hide();
                $(".search-input").css("border-bottom", "1px solid rgba(82, 168, 236, .8)");
                $(".search-input-div").removeClass("search-input-div2");
                $(".searchTips-ul li").remove();
                break;

            default:
                break;
        }
    } else {
        showSearchHistory(true);
    }
}


function delScript() {
    let oScript = document.getElementById("jsonP");
    if (!oScript) return;
    document.body.removeChild(oScript);
}

function cleanHistory() {
    swal({
        title: "真的要清空吗?",
        text: "清空了就再也看不见了哟!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            localStorage.removeItem('searchHistorysOfLi');
            alterUtil.message("清空成功！", "success");
        } else {
            swal("哈哈，你的记录得以幸存!");
        }
    });
}

function showSearchHistory(isAll) {
    var searchHistoryArray = JSON.parse(localStorage.getItem('searchHistorysOfLi'));
    if (isAll) {
        $(".searchTips-ul li").remove();
        if (searchHistoryArray) {
            $(".searchTips-ul").show();
            $(".search-input").css("border-bottom", "none")
            $(".search-input-div").addClass("search-input-div2")
            for (let i = 0; i < searchHistoryArray.length; i++) {
                if (i >= 10) {
                    break;
                }
                var textValue = $(".search-input").val().trim();
                if (searchHistoryArray[i].substr(0, textValue.length) === textValue) {
                    $(".searchTips-ul").append(`<li onclick="searchItem(this)"><p class="historyItem" value="` + searchHistoryArray[i] + `"><span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` + htmlUtil.htmlEncode(searchHistoryArray[i].substr(textValue.length)) + `</p></li>`);
                }
            }
            $(".searchTips-ul").append(`<li class="cleanHistory-li"><p><a href="javascript:cleanHistory()" class="cleanHistory">清空历史</a></p></li>`);
            $(".searchTips-ul").css("padding", "10px 0 0");
        } else {
            $(".searchTips-ul").hide();
            $(".search-input").css("border-bottom", "1px solid rgba(82, 168, 236, .8)");
            $(".search-input-div").removeClass("search-input-div2");
            $(".searchTips-ul li").remove();
        }
    } else {
        $(".searchTips-ul li").remove();
        if (searchHistoryArray) {
            var searchArr = searchHistoryArray.filter(value => {
                var textValue = $(".search-input").val().trim();
                return value.substr(0, textValue.length) === textValue;
            });
            var searchArray = [];
            for (let i = 0; i < searchArr.length; i++) {
                if (i >= 2) {
                    break;
                }
                var textValue = $(".search-input").val().trim();
                if (searchArr[i].substr(0, textValue.length) === textValue) {
                    $(".searchTips-ul").append(`<li onclick="searchItem(this)"><p class="historyItem" value="` + searchArr[i] + `"><span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` + htmlUtil.htmlEncode(searchArr[i].substr(textValue.length)) + `</p></li>`);
                }
                searchArray[i] = searchArr[i];
            }
            return searchArray;
        }
    }
}

function showBaiduData(data) {
    var searchArray = showSearchHistory(false);
    if (!searchArray) {
        searchArray = [];
    }
    if (data.s.length !== 0) {
        data.s.forEach(element => {
            if (!searchArray.includes(element)) {
                var textValue = $(".search-input").val().trim();
                if (element.substr(0, textValue.length) === textValue) {
                    $(".searchTips-ul").append(`<li onclick="searchItem(this)"><p value="` + element + `"><span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` + htmlUtil.htmlEncode(element.substr(textValue.length)) + `</p></li>`);
                }else {
                    $(".searchTips-ul").append(`<li onclick="searchItem(this)"><p value="` + element + `">` + element + `</p></li>`);
                }
            }
        });
    } else {
        $(".searchTips-ul li").remove();
        if (searchArray.length !== 0) {
            $(".searchTips-ul").show();
            $(".search-input").css("border-bottom", "none")
            $(".search-input-div").addClass("search-input-div2")
            searchArray.forEach(element => {
                var textValue = $(".search-input").val().trim();
                if (element.substr(0, textValue.length) === textValue) {
                    $(".searchTips-ul").append(`<li onclick="searchItem(this)"><p class="historyItem" value="` + element + `"><span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` + htmlUtil.htmlEncode(element.substr(textValue.length)) + `</p></li>`);
                }else {
                    $(".searchTips-ul").append(`<li onclick="searchItem(this)"><p value="` + element + `">` + element + `</p></li>`);
                }
            })
        } else {
            $(".searchTips-ul").hide();
            $(".search-input").css("border-bottom", "1px solid rgba(82, 168, 236, .8)");
            $(".search-input-div").removeClass("search-input-div2");
        }
    }
}

function showBingData(data) {
    var searchArray = showSearchHistory(false);
    if (!searchArray) {
        searchArray = [];
    }
    if (data.AS.Results) {
        data.AS.Results.forEach(element => {
            element.Suggests.forEach(e => {
                if (!searchArray.includes(e.Txt)) {
                    var textValue = $(".search-input").val().trim();
                    if (element.substr(0, textValue.length) === textValue) {
                        $(".searchTips-ul").append(`<li onclick="searchItem(this)"><p value="` + element + `"><span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` + htmlUtil.htmlEncode(element.substr(textValue.length)) + `</p></li>`);
                    }else {
                        $(".searchTips-ul").append(`<li onclick="searchItem(this)"><p value="` + element + `">` + element + `</p></li>`);
                    }
                }
            });
        });
    } else {
        $(".searchTips-ul li").remove();
        if (searchArray.length !== 0) {
            $(".searchTips-ul").show();
            $(".search-input").css("border-bottom", "none")
            $(".search-input-div").addClass("search-input-div2")
            searchArray.forEach(element => {
                var textValue = $(".search-input").val().trim();
                if (element.substr(0, textValue.length) === textValue) {
                    $(".searchTips-ul").append(`<li onclick="searchItem(this)"><p class="historyItem" value="` + element + `"><span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` + htmlUtil.htmlEncode(element.substr(textValue.length)) + `</p></li>`);
                }else {
                    $(".searchTips-ul").append(`<li onclick="searchItem(this)"><p value="` + element + `">` + element + `</p></li>`);
                }
            })
        } else {
            $(".searchTips-ul").hide();
            $(".search-input").css("border-bottom", "1px solid rgba(82, 168, 236, .8)");
            $(".search-input-div").removeClass("search-input-div2");
        }
    }
}

function searchItem(obj) {
    console.log($(obj).find("p").attr("value"))
    $(".search-input").val($(obj).find("p").attr("value"));
    $(".search-button").click();
}

function changeSearchEngin(obj) {
    var name = $(obj).attr("name");
    var searchUrl = $(obj).attr("searchUrl");
    switch (name) {
        case "baidu":
            $("#search-engin-text").html("百度");
            $(".searchTips-ul").attr("name", name);
            $(".search-button").attr("url", searchUrl);
            break;

        case "bing":
            $("#search-engin-text").html("Bing");
            $(".searchTips-ul").attr("name", name);
            $(".search-button").attr("url", searchUrl);
            break;

        case "github":
            $("#search-engin-text").html("GitHub");
            $(".searchTips-ul").attr("name", name);
            $(".search-button").attr("url", searchUrl);
            break;
        default:

            break;
    }
}