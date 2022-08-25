const baiduTipsUrl = "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?cb=showBaiduData&wd=";
const bingTipsUrl = "https://api.bing.com/qsonhs.aspx?type=cb&cb=showBingData&q=";
// const bingTipsUrl = "https://www.bing.com/AS/Suggestions?type=cb&cb=showBingData&cvid=f368abd3c3ed41ada21f700befdb9392&qry=";
$(function () {
    $(".search-input").focus();
    $(".search-input").bind('input', function () {
        showSearchContent();
    })

    $(".search-input").keypress(function (e) {
        if (e.keyCode == "13") {
            $(".search-button").click();
        }
    })

    $(".search-input").click(function () {
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
        var searchHistoryArray = JSON.parse(localStorage.getItem('searchHistorys'));
        if (!searchHistoryArray) {
            searchHistoryArray = [];
        }
        var value = encodeURIComponent(textValue);
        if (!value) {
            alert("请输入搜索信息！");
        } else {
            if (!searchHistoryArray.includes(textValue)) {
                searchHistoryArray.unshift(textValue);
            }
            if (searchHistoryArray.length > 50) {
                searchHistoryArray.pop();
            }
            localStorage.setItem('searchHistorys', JSON.stringify(searchHistoryArray))
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
    if (confirm("真的要清空吗?")) {
        localStorage.removeItem('searchHistorys');
        alert("清空成功！");
    }
}

function showSearchHistory(isAll) {
    var searchHistoryArray = JSON.parse(localStorage.getItem('searchHistorys'));
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
                $(".searchTips-ul").append(`<li onclick="searchItem(this)"><p class="historyItem">` + searchHistoryArray[i] + `</p></li>`);
            }
            $(".searchTips-ul").append(`<li class="cleanHistory-li"><p><a href="javascript:cleanHistory()" class="cleanHistory">清空历史</a></p></li>`);
        } else {
            $(".searchTips-ul").hide();
            $(".search-input").css("border-bottom", "1px solid rgba(82, 168, 236, .8)");
            $(".search-input-div").removeClass("search-input-div2");
            $(".searchTips-ul li").remove();
        }
    } else {
        $(".searchTips-ul li").remove();
        if(searchHistoryArray){
            var searchArr = searchHistoryArray.filter(value => {
                var textValue = $(".search-input").val().trim();
                return value.indexOf(textValue) != -1;
            });
            var searchArray = [];
            for (let i = 0; i < searchArr.length; i++) {
                if (i >= 2) {
                    break;
                }
                $(".searchTips-ul").append(`<li onclick="searchItem(this)"><p class="historyItem">` + searchArr[i] + `</p></li>`);
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
    if (data.s.length != 0) {
        data.s.forEach(element => {
            if (!searchArray.includes(element)) {
                $(".searchTips-ul").append(`<li onclick="searchItem(this)"><p>` + element + `</p></li>`);
            }
        });
    } else {
        $(".searchTips-ul").hide();
        $(".search-input").css("border-bottom", "1px solid rgba(82, 168, 236, .8)");
        $(".search-input-div").removeClass("search-input-div2");
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
                    $(".searchTips-ul").append(`<li onclick="searchItem(this)"><p>` + e.Txt + `</p></li>`);
                }
            });
        });
    } else {
        $(".searchTips-ul").hide();
        $(".search-input").css("border-bottom", "1px solid rgba(82, 168, 236, .8)");
        $(".search-input-div").removeClass("search-input-div2");
    }
}

function searchItem(obj) {
    $(".search-input").val($(obj).find("p").html());
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