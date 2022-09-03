/**
 * 百度搜索提示接口
 * @type {string}
 */
const baiduTipsUrl = "https://www.baidu.com/sugrec?prod=pc";

/**
 * Bing搜索提示接口
 * @type {string}
 */
const bingTipsUrl = "https://api.bing.com/qsonhs.aspx?type=cb";

/**
 * 保存的搜索历史的数量，超过这个数量的将被自动删除
 * @type {number}
 */
const SAVED_SEARCH_HISTORY_NUMBER = 50;

/**
 * 显示的搜索历史的数量
 * @type {number}
 */
const SHOW_SEARCH_HISTORY_NUMBER = 10;

/**
 * 搜索中显示搜索历史的数量
 * @type {number}
 */
const SHOW_SEARCHING_HISTORY_NUMBER = 2;

/**
 * 这个是测试的Bing接口，我还没有玩明白它，先不用它
 * @type {string}
 */
// const bingTipsUrl = "https://www.bing.com/AS/Suggestions?type=cb&cb=showBingData&cvid=f368abd3c3ed41ada21f700befdb9392&qry=";

$(function () {
    var $searchInput = $(".search-input");
    var $searchTipsUl = $(".searchTips-ul");
    var $searchInputDiv = $(".search-input-div");
    var $searchButton = $(".search-button");
    //进入页面就聚焦输入框
    $searchInput.focus();

    //输入框每输入一个值时就显示搜索提示
    $searchInput.keyup(showSearchContent);

    //输入框搞回车就搜索
    $searchInput.keypress(e => {
        //判断键盘是否点击了回车
        if (e.keyCode === 13) {
            //模拟点击搜索按钮
            $searchButton.click();
        }
    });

    //点击输入框就显示搜索提示
    $searchInput.click(showSearchContent)

    $searchInput.blur(function () {
        setTimeout(function () {
            $searchTipsUl.hide();
            $searchInput.css("border-bottom", "1px solid #ccc");
            $searchInputDiv.removeClass("search-input-div2");
        }, 300);
    });


    $searchButton.click(searchAndSaveHistory);

})

function searchAndSaveHistory() {
    var $searchInput = $(".search-input");
    var textValue = $searchInput.val().trim().toLowerCase();
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
        if (searchHistoryArray.length > SAVED_SEARCH_HISTORY_NUMBER) {
            searchHistoryArray.pop();
        }
        localStorage.setItem('searchHistorysOfLi', JSON.stringify(searchHistoryArray))
        window.open($(this).attr("url") + value);
    }
}

function showSearchContent() {
    var $searchInput = $(".search-input");
    var $searchTipsUl = $(".searchTips-ul");
    var $searchInputDiv = $(".search-input-div");
    var $searchTipsUlLi = $(".searchTips-ul li");
    var value = $searchInput.val().trim().toLowerCase();
    if (value) {
        $searchTipsUl.css("padding", "10px 0");
        $searchTipsUl.show();
        $searchInput.css("border-bottom", "none")
        $searchInputDiv.addClass("search-input-div2")
        var name = $searchTipsUl.attr("name");
        switch (name) {
            case "baidu":
                $.ajax({
                    url: baiduTipsUrl,
                    data: {wd: value},
                    dataType: 'jsonp',
                    success: data => showBaiduData(data)
                });
                break;

            case "bing":
                $.ajax({
                    url: bingTipsUrl,
                    data: {q: value},
                    dataType: 'jsonp',
                    success: data => showBingData(data)
                });
                break;

            case "github":
                $searchTipsUl.hide();
                $searchInput.css("border-bottom", "1px solid rgba(82, 168, 236, .8)");
                $searchInputDiv.removeClass("search-input-div2");
                $searchTipsUlLi.remove();
                break;
        }
    } else {
        showSearchHistory(true);
    }
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
    var $searchInput = $(".search-input");
    var $searchTipsUl = $(".searchTips-ul");
    var $searchInputDiv = $(".search-input-div");
    var $searchTipsUlLi = $(".searchTips-ul li");
    var textValue = $searchInput.val().trim().toLowerCase();
    var searchHistoryArray = JSON.parse(localStorage.getItem('searchHistorysOfLi'));
    if (isAll) {
        $searchTipsUlLi.remove();
        if (searchHistoryArray) {
            $searchTipsUl.show();
            $searchInput.css("border-bottom", "none")
            $searchInputDiv.addClass("search-input-div2")
            for (let i = 0; i < searchHistoryArray.length; i++) {
                if (i >= SHOW_SEARCH_HISTORY_NUMBER) {
                    break;
                }
                if (searchHistoryArray[i].substr(0, textValue.length) === textValue) {
                    $searchTipsUl.append(`<li onclick="searchItem(this)">
                                            <p class="historyItem" value="` + searchHistoryArray[i] + `">
                                                <span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` +
                        htmlUtil.htmlEncode(searchHistoryArray[i].substr(textValue.length)) + `
                                            </p>
                                          </li>`);
                }
            }
            $searchTipsUl.append(`<li class="cleanHistory-li">
                                    <p>
                                        <a href="javascript:cleanHistory()" class="cleanHistory">清空历史</a>
                                    </p>
                                  </li>`);
            $searchTipsUl.css("padding", "10px 0 0");
        } else {
            $searchTipsUl.hide();
            $searchInput.css("border-bottom", "1px solid rgba(82, 168, 236, .8)");
            $searchInputDiv.removeClass("search-input-div2");
            $searchTipsUlLi.remove();
        }
    } else {
        $searchTipsUlLi.remove();
        if (searchHistoryArray) {
            var searchArr = searchHistoryArray.filter(value => {
                return value.substr(0, textValue.length) === textValue;
            });
            var searchArray = [];
            for (let i = 0; i < searchArr.length; i++) {
                if (i >= SHOW_SEARCHING_HISTORY_NUMBER) {
                    break;
                }
                if (searchArr[i].substr(0, textValue.length) === textValue) {
                    $searchTipsUl.append(`<li onclick="searchItem(this)">
                                            <p class="historyItem" value="` + searchArr[i] + `">
                                                <span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` +
                        htmlUtil.htmlEncode(searchArr[i].substr(textValue.length)) + `
                                            </p>
                                          </li>`);
                }
                searchArray[i] = searchArr[i];
            }
            return searchArray;
        }
    }
}

function showBaiduData(data) {
    var $searchInput = $(".search-input");
    var $searchTipsUl = $(".searchTips-ul");
    var searchArray = showSearchHistory(false);
    if (!searchArray) {
        searchArray = [];
    }
    if (data.g) {
        data.g.forEach(element => {
            if (!searchArray.includes(element.q)) {
                var textValue = $searchInput.val().trim().toLowerCase();
                if (element.q.substr(0, textValue.length) === textValue) {
                    $searchTipsUl.append(`<li onclick="searchItem(this)">
                                            <p value="` + element.q + `">
                                                <span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` +
                        htmlUtil.htmlEncode(element.q.substr(textValue.length)) + `
                                            </p>
                                          </li>`);
                } else {
                    $searchTipsUl.append(`<li onclick="searchItem(this)">
                                            <p value="` + element.q + `">` + element.q + `</p>
                                          </li>`);
                }
            }
        });
    } else {
        onlyShowSearchHistory(searchArray);
    }
}

function showBingData(data) {
    var $searchInput = $(".search-input");
    var $searchTipsUl = $(".searchTips-ul");
    var searchArray = showSearchHistory(false);
    if (!searchArray) {
        searchArray = [];
    }
    if (data.AS.Results) {
        data.AS.Results.forEach(element => {
            element.Suggests.forEach(e => {
                if (!searchArray.includes(e.Txt)) {
                    var textValue = $searchInput.val().trim().toLowerCase();
                    if (e.Txt.substr(0, textValue.length) === textValue) {
                        $searchTipsUl.append(`<li onclick="searchItem(this)">
                                                <p value="` + e.Txt + `">
                                                    <span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` +
                            htmlUtil.htmlEncode(e.Txt.substr(textValue.length)) + `
                                                </p>
                                              </li>`);
                    } else {
                        $searchTipsUl.append(`<li onclick="searchItem(this)">
                                                <p value="` + e.Txt + `">` + e.Txt + `</p>
                                              </li>`);
                    }
                }
            });
        });
    } else {
        onlyShowSearchHistory(searchArray);
    }
}

function onlyShowSearchHistory(searchArray) {
    var $searchInput = $(".search-input");
    var $searchTipsUl = $(".searchTips-ul");
    var $searchInputDiv = $(".search-input-div");
    var $searchTipsUlLi = $(".searchTips-ul li");
    $searchTipsUlLi.remove();
    if (searchArray.length !== 0) {
        $searchTipsUl.show();
        $searchInput.css("border-bottom", "none")
        $searchInputDiv.addClass("search-input-div2")
        searchArray.forEach(element => {
            var textValue = $searchInput.val().trim().toLowerCase();
            if (element.substr(0, textValue.length) === textValue) {
                $searchTipsUl.append(`<li onclick="searchItem(this)">
                                        <p class="historyItem" value="` + element + `">
                                            <span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` +
                    htmlUtil.htmlEncode(element.substr(textValue.length)) + `
                                        </p>
                                      </li>`);
            } else {
                $searchTipsUl.append(`<li onclick="searchItem(this)">
                                        <p value="` + element + `">` + element + `</p>
                                      </li>`);
            }
        })
    } else {
        $searchTipsUl.hide();
        $searchInput.css("border-bottom", "1px solid rgba(82, 168, 236, .8)");
        $searchInputDiv.removeClass("search-input-div2");
    }
}

function searchItem(obj) {
    var $searchInput = $(".search-input");
    var $searchButton = $(".search-button");
    $searchInput.val($(obj).find("p").attr("value"));
    $searchButton.click();
}

function changeSearchEngin(obj) {
    var $searchTipsUl = $(".searchTips-ul");
    var $searchEnginText = $("#search-engin-text");
    var $searchButton = $(".search-button");
    var $obj = $(obj)
    var name = $obj.attr("name");
    var searchUrl = $obj.attr("searchUrl");
    switch (name) {
        case "baidu":
            $searchEnginText.html("百度");
            $searchTipsUl.attr("name", name);
            $searchButton.attr("url", searchUrl);
            break;

        case "bing":
            $searchEnginText.html("Bing");
            $searchTipsUl.attr("name", name);
            $searchButton.attr("url", searchUrl);
            break;

        case "github":
            $searchEnginText.html("GitHub");
            $searchTipsUl.attr("name", name);
            $searchButton.attr("url", searchUrl);
            break;
    }
}