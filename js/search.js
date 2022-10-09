/**
 * 我就是我，不一样的烟火！
 * @author 黎宏
 */

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

// /**
//  * 牛津学习词典搜索提示接口，有跨域问题暂时还没解决，先不用它
//  * @type {string}
//  */
// const oxfordTipsUrl = "https://www.oxfordlearnersdictionaries.com/us/autocomplete/american_english/";

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
    //一些选择器
    var $searchInput = $(".search-input");
    var $searchTipsUl = $(".searchTips-ul");
    var $searchInputDiv = $(".search-input-div");
    var $searchButton = $(".search-button");
    var $searchInputRemoveIco = $(".search-input-remove-ico");

    //显示选项卡
    showTabs();

    //进入页面就聚焦输入框
    $searchInput.focus();

    //输入框每输入一个值时就显示搜索提示
    $searchInput.bind('input', showSearchContent);

    //点击清除按钮就清除输入框的值并显示搜索历史（没有就不显示）
    $searchInputRemoveIco.click(function () {
        $searchInput.val("");
        $searchInput.focus();
        $searchInputRemoveIco.hide();
        showSearchHistory(false);
    });

    //输入框搞回车就搜索
    $searchInput.keypress(e => {
        if (e.keyCode === 13) {
            $searchInput.blur();
            $searchButton.click();
        }
    });

    //点击输入框就显示搜索提示
    $searchInput.click(showSearchContent)

    //监听页面的点击事件，当点击的不是输入框和清除按钮时就隐藏搜索提示框
    $(document).click(e => {
        //e.target返回的是当前点击的DOM对象，$searchInput[0]是将JQuery对象转为DOM对象
        if ($searchInput[0] !== e.target && $searchInputRemoveIco[0] !== e.target) {
            $searchTipsUl.hide();
            $searchInput.css("border-bottom", "1px solid #ccc");
            $searchInputDiv.removeClass("search-input-div2");
        }
    });

    //点击搜索按钮就搜索并保存搜索历史
    $searchButton.click(searchAndSaveHistory);

    //渲染搜索按钮的title
    $searchButton.poshytip({
        className: 'tip-twitter',
        offsetY: -48,
        offsetX: 10
    });
})

/**
 * 显示选项卡
 */
function showTabs() {
    var $tabs = $("#tabs");
    $tabs.html('');
    tabsData.forEach(element => {
        $tabs.append(`  <div class="` + element.class + `">
                        <a target="` + element.target + `" href="` + element.href + `">
                            <div class="m-item">
                                <div class="m_imgdiv"><img src="images/` + element.img + `" alt=""></div>
                                <div class="m_textdiv">
                                    <h3>` + htmlUtil.htmlEncode(element.title) + `</h3>
                                </div>
                            </div>
                        </a>
                    </div>`);
    });
}

/**
 * 搜索并保存搜索历史
 */
function searchAndSaveHistory() {
    var $searchInput = $(".search-input");
    var textValue = $searchInput.val().trim().toLowerCase();
    var searchHistoryArray = JSON.parse(localStorage.getItem('searchHistorysOfLi'));
    if (!searchHistoryArray) {
        searchHistoryArray = [];
    }
    var value = encodeURIComponent(textValue);
    if (!value) {
        alterUtil.message("你还没输入东西呢！", "danger");//success, info, warning, danger
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

/**
 * 显示搜索提示框
 */
function showSearchContent() {
    var $searchInput = $(".search-input");
    var $searchTipsUl = $(".searchTips-ul");
    var $searchInputRemoveIco = $(".search-input-remove-ico");
    var value = $searchInput.val().trim().toLowerCase();
    if ($searchInput.val()) {
        $searchInputRemoveIco.show();
    } else {
        $searchInputRemoveIco.hide();
    }
    if (value) {
        var name = $searchTipsUl.attr("name");
        switch (name) {
            case "baidu":
                $.ajax({
                    url: baiduTipsUrl,
                    jsonp: 'cb',
                    data: {wd: value},
                    dataType: 'jsonp',
                    success: data => showBaiduData(data)
                });
                break;

            case "bing":
                $.ajax({
                    url: bingTipsUrl,
                    jsonp: 'cb',
                    data: {q: value},
                    dataType: 'jsonp',
                    success: data => showBingData(data)
                });
                break;

            case "github":
                onlyShowSearchHistory(showSearchHistory(true, true));
                break;

            case "oxford":
                onlyShowSearchHistory(showSearchHistory(true, true));
                break;

            //有跨域问题，暂时还没解决，先不用
            // case "oxford":
            //     $.ajax({
            //         url: oxfordTipsUrl,
            //         // jsonp: "cb",
            //         data: {q: value},
            //         dataType: 'jsonp',
            //         success: data => showOxfordData(data)
            //     });
            //     break;
        }
    } else {
        showSearchHistory(false);
    }
}

/**
 * 清空搜索历史
 */
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

/**
 * 删除某个搜索历史
 * @param event 浏览器事件对象
 * @param obj 删除按钮所在的对象
 */
function removeHistoryItem(event, obj) {
    var $searchInput = $(".search-input");
    var $searchTipsUl = $(".searchTips-ul");
    var $searchInputDiv = $(".search-input-div");
    var $searchTipsUlLi = $(".searchTips-ul li");
    var searchHistoryArray = JSON.parse(localStorage.getItem('searchHistorysOfLi'));
    var value = decodeURIComponent($(obj).parent().attr("value"));
    if (searchHistoryArray && searchHistoryArray.includes(value)) {
        $(obj).parent().parent().remove();
        searchHistoryArray.splice(searchHistoryArray.indexOf(value), 1);
    }
    if ($searchTipsUl.find(".cleanHistory-li").siblings().length === 0 && $searchTipsUl.find(".cleanHistory-li")[0]) {
        $searchTipsUl.hide();
        $searchInput.css("border-bottom", "1px solid rgba(82, 168, 236, .8)");
        $searchInputDiv.removeClass("search-input-div2");
        $searchTipsUlLi.remove();
        $searchInput.focus();
    }
    localStorage.setItem('searchHistorysOfLi', JSON.stringify(searchHistoryArray))
    event.stopPropagation();
}

/**
 * 显示搜索历史
 * @param isSearching 是否正在搜索中
 * @param isUndefined 接口返回的数据是否为空
 * @returns {*[]} 搜索中匹配到的最近的几条搜索历史
 */
function showSearchHistory(isSearching, isUndefined) {
    var $searchInput = $(".search-input");
    var $searchTipsUl = $(".searchTips-ul");
    var $searchInputDiv = $(".search-input-div");
    var $searchTipsUlLi = $(".searchTips-ul li");
    var textValue = $searchInput.val().trim().toLowerCase();
    var searchHistoryArray = JSON.parse(localStorage.getItem('searchHistorysOfLi'));
    if (!isSearching) {
        $searchTipsUlLi.remove();
        if (searchHistoryArray && searchHistoryArray.length !== 0) {
            $searchTipsUl.show();
            $searchInput.css("border-bottom", "none")
            $searchInputDiv.addClass("search-input-div2")
            for (let i = 0; i < searchHistoryArray.length; i++) {
                if (i >= SHOW_SEARCH_HISTORY_NUMBER) {
                    break;
                }
                if (searchHistoryArray[i].substr(0, textValue.length) === textValue) {
                    $searchTipsUl.append(`<li onclick="searchItem(this)">
                                            <p class="historyItem" value="` + encodeURIComponent(searchHistoryArray[i]) + `">
                                                <span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` +
                        htmlUtil.htmlEncode(searchHistoryArray[i].substr(textValue.length)) + `
                                                <a onclick="removeHistoryItem(event, this)"><span class="glyphicon glyphicon-remove-sign searchTips-removeSpan"></span></a>
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
        $searchTipsUl.css("padding", "10px 0");
        $searchTipsUlLi.remove();
        if (searchHistoryArray) {
            var searchArr = searchHistoryArray.filter(value => {
                return value.substr(0, textValue.length) === textValue;
            });
            var searchArray = [];
            for (let i = 0; i < searchArr.length; i++) {
                if (i >= SHOW_SEARCHING_HISTORY_NUMBER && !isUndefined) {
                    break;
                } else if (i < SHOW_SEARCH_HISTORY_NUMBER) {
                    if (searchArr[i].substr(0, textValue.length) === textValue) {
                        $searchTipsUl.append(`<li onclick="searchItem(this)">
                                                <p class="historyItem" value="` + encodeURIComponent(searchArr[i]) + `">
                                                    <span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` +
                            htmlUtil.htmlEncode(searchArr[i].substr(textValue.length)) + `
                                                    <a onclick="removeHistoryItem(event, this)"><span class="glyphicon glyphicon-remove-sign searchTips-removeSpan"></span></a>
                                                </p>
                                              </li>`);
                    }
                    searchArray[i] = searchArr[i];
                }
            }
            return searchArray;
        }
    }
}

/**
 * 显示百度接口返回的搜索提示
 * @param data 返回的搜索提示数据
 */
function showBaiduData(data) {
    var $searchInput = $(".search-input");
    var $searchTipsUl = $(".searchTips-ul");
    var $searchInputDiv = $(".search-input-div");
    var searchArray = showSearchHistory(true, data.g === undefined);

    if (!searchArray) {
        searchArray = [];
    }
    if (data.g && $searchInput.val().trim()) {
        data.g.forEach(element => {
            var item = element.q;
            if (!searchArray.includes(item)) {
                var textValue = $searchInput.val().trim().toLowerCase();
                if (item.substr(0, textValue.length) === textValue) {
                    $searchTipsUl.append(`<li onclick="searchItem(this)">
                                            <p value="` + encodeURIComponent(item) + `">
                                                <span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` +
                        htmlUtil.htmlEncode(item.substr(textValue.length)) + `
                                            </p>
                                          </li>`);
                } else {
                    $searchTipsUl.append(`<li onclick="searchItem(this)">
                                            <p value="` + htmlUtil.htmlEncode(item) + `">` + htmlUtil.htmlEncode(item) + `</p>
                                          </li>`);
                }
            }
        });
        $searchTipsUl.css("padding", "10px 0");
        $searchInput.css("border-bottom", "none");
        $searchInputDiv.addClass("search-input-div2");
        $searchTipsUl.show();
    } else {
        onlyShowSearchHistory(searchArray);
    }
}

/**
 * 显示Bing接口返回的搜索提示
 * @param data 返回的搜索提示数据
 */
function showBingData(data) {
    var $searchInput = $(".search-input");
    var $searchTipsUl = $(".searchTips-ul");
    var $searchInputDiv = $(".search-input-div");
    var searchArray = showSearchHistory(true, data.AS.Results === undefined);
    if (!searchArray) {
        searchArray = [];
    }
    if (data.AS.Results && $searchInput.val().trim()) {
        data.AS.Results.forEach(element => {
            element.Suggests.forEach(e => {
                var item = e.Txt;
                if (!searchArray.includes(item)) {
                    var textValue = $searchInput.val().trim().toLowerCase();
                    if (item.substr(0, textValue.length) === textValue) {
                        $searchTipsUl.append(`<li onclick="searchItem(this)">
                                                <p value="` + encodeURIComponent(item) + `">
                                                    <span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` +
                            htmlUtil.htmlEncode(item.substr(textValue.length)) + `
                                                </p>
                                              </li>`);
                    } else {
                        $searchTipsUl.append(`<li onclick="searchItem(this)">
                                                <p value="` + htmlUtil.htmlEncode(item) + `">` + htmlUtil.htmlEncode(item) + `</p>
                                              </li>`);
                    }
                }
            });
        });
        $searchTipsUl.css("padding", "10px 0");
        $searchInput.css("border-bottom", "none");
        $searchInputDiv.addClass("search-input-div2");
        $searchTipsUl.show();
    } else {
        onlyShowSearchHistory(searchArray);
    }
}

// /**
//  * 显示牛津学习词典接口返回的搜索提示，有跨域问题，先不用
//  * @param data 返回的搜索提示数据
//  */
// function showOxfordData(data){
//     console.log(data);
// }

/**
 * 只显示搜索历史
 * @param searchArray 搜索中的匹配到的最近几条历史
 */
function onlyShowSearchHistory(searchArray) {
    var $searchInput = $(".search-input");
    var $searchTipsUl = $(".searchTips-ul");
    var $searchInputDiv = $(".search-input-div");
    var $searchTipsUlLi = $(".searchTips-ul li");
    $searchTipsUlLi.remove();
    if (searchArray && searchArray.length !== 0) {
        if ($searchInput.val().trim()) {
            $searchTipsUl.show();
            $searchInput.css("border-bottom", "none")
            $searchInputDiv.addClass("search-input-div2")
            searchArray.forEach(element => {
                var textValue = $searchInput.val().trim().toLowerCase();
                if (element.substr(0, textValue.length) === textValue) {
                    $searchTipsUl.append(`<li onclick="searchItem(this)">
                                            <p class="historyItem" value="` + encodeURIComponent(element) + `">
                                                <span class="searchTips-span">` + htmlUtil.htmlEncode(textValue) + `</span>` +
                        htmlUtil.htmlEncode(element.substr(textValue.length)) + `
                                                <a onclick="removeHistoryItem(event, this)"><span class="glyphicon glyphicon-remove-sign searchTips-removeSpan"></span></a>
                                            </p>
                                          </li>`);
                } else {
                    $searchTipsUl.append(`<li onclick="searchItem(this)">
                                            <p value="` + htmlUtil.htmlEncode(element) + `">` + htmlUtil.htmlEncode(element) + `</p>
                                          </li>`);
                }
            })
        } else {
            showSearchHistory(false);
        }
    } else {
        $searchInput.css("border-bottom", "1px solid rgba(82, 168, 236, .8)");
        $searchInputDiv.removeClass("search-input-div2");
        $searchTipsUl.hide();
    }
}

/**
 * 搜索对应搜索提示的内容
 * @param obj 点击的当前的DOM对象
 */
function searchItem(obj) {
    var $searchInput = $(".search-input");
    var $searchButton = $(".search-button");
    var $searchInputRemoveIco = $(".search-input-remove-ico");
    $searchInput.val(decodeURIComponent($(obj).find("p").attr("value")));
    $searchInputRemoveIco.show();
    $searchButton.click();
}

/**
 * 更换搜索引擎时，搜索参数更换为对应引擎的
 * @param obj 更换引擎的DOM对象
 */
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

        case "oxford":
            $searchEnginText.html("Oxford");
            $searchTipsUl.attr("name", name);
            $searchButton.attr("url", searchUrl);
            break;
    }
}