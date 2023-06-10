const btnGroups = document.querySelector(".button-group");
const showList = document.querySelector(".showList");
const roundedEnd = document.querySelector(".rounded-end");
const showResult = document.querySelector(".show-result");
const search = document.querySelector(".search");
const textCenter = document.querySelector(".text-center");
const jsSelect = document.querySelector("#js-select");
const jsMoblieSelect = document.querySelector("#js-moblie-select");
const upAndDown = document.querySelector(".js-sort-advanced");

const selectArr = ["上價", "中價", "下價", "平均價", "交易量"];
let data = [];
let resultData = [];

axios.get('https://hexschool.github.io/js-filter-data/data.json')
    .then(function (response) {
        data = response.data;
    }).catch(function (error) {
        console.log(error);
    });


search.addEventListener("click", function (e) {
    let getType = document.querySelector(".selected");
    let newData = [];
    // 重置resultData內容
    resultData = [];

    if (getType === null) {
        alert("請選擇要查詢的農產品類別");
        return;
    }
    if (roundedEnd.value.trim() === "") {
        alert("請輸入要比價的農產品");
        return;
    } else {
        showResult.innerHTML = `查看「${roundedEnd.value}」的比價結果`;
    }

    data.forEach(function (item) {
        // 排除資料內有null的物件避免出錯
        if (item["作物名稱"] != null) {
            if (item["種類代碼"] === getType.getAttribute("data-type"))
                newData.push(item);
        }
    })
    newData.forEach(function (item) {
        if (item["作物名稱"].indexOf(roundedEnd.value) !== -1) {
            resultData.push(item);
        }
    })
    if (resultData.length == 0) {
        renderList(resultData);
    } else {
        renderList(resultData);
    }
})

// 切換農產品類別選取狀態
let checkSelected = function (event) {
    if (document.querySelector(".selected") === null) {
        event.target.classList.add("selected");
    } else {
        document.querySelector(".selected").classList.remove("selected");
        event.target.classList.add("selected");
    }
}
btnGroups.addEventListener("click", function (e) {
    if (e.target.nodeName !== "BUTTON") {
        return;
    } else if (e.target.getAttribute("data-type") === "N04") {
        checkSelected(e);
    } else if (e.target.getAttribute("data-type") === "N05") {
        checkSelected(e);
    } else if (e.target.getAttribute("data-type") === "N06") {
        checkSelected(e);
    }
})

// 一般查詢渲染
let renderList = function (list) {
    str = "";
    if (list.length === 0) {
        str = `<tr>
                    <td colspan="7" class="text-center p-3">查詢不到當日的交易資訊QQ</td>
                </tr>`;
    } else {
        list.forEach(function (item) {
            str += `<tr>
                        <td width="15%" class="text-left p-3">${item["作物名稱"]}</td>
                        <td width="15%" class="text-left p-3">${item["市場名稱"]}</td>
                        <td width="14%" class="text-left p-3">${item["上價"]}</td>
                        <td width="14%" class="text-left p-3">${item["中價"]}</td>
                        <td width="14%" class="text-left p-3">${item["下價"]}</td>
                        <td width="14%" class="text-left p-3">${item["平均價"]}</td>
                        <td width="14%" class="text-left p-3">${item["交易量"]}</td>
                    </tr>`
        })
    }
    // 資料載入中的效果
    showList.innerHTML = "資料載入中...";
    setTimeout(function () {
        showList.innerHTML = str;
    }, 500);
}

// 排序後結果渲染
let renderSortList = function (list) {
    str = "";
    if (list.length === 0) {
        str = `<tr>
                    <td colspan="7" class="text-center p-3">查詢不到當日的交易資訊QQ</td>
                </tr>`;
    } else {
        list.forEach(function (item) {
            str += `<tr>
                        <td width="15%" class="text-left p-3">${item["作物名稱"]}</td>
                        <td width="15%" class="text-left p-3">${item["市場名稱"]}</td>
                        <td width="14%" class="text-left p-3">${item["上價"]}</td>
                        <td width="14%" class="text-left p-3">${item["中價"]}</td>
                        <td width="14%" class="text-left p-3">${item["下價"]}</td>
                        <td width="14%" class="text-left p-3">${item["平均價"]}</td>
                        <td width="14%" class="text-left p-3">${item["交易量"]}</td>
                    </tr>`
        })
    }
    showList.innerHTML = str;
}

// 網頁修改排序事件
jsSelect.addEventListener("change", function (e) {
    if (resultData.length === 0) {
        return;
    } else {
        selectArr.forEach(function (item) {
            if (jsSelect.value.indexOf(item) !== -1) {
                resultData.sort(function (a, b) {
                    return a[item] - b[item]
                })
            }
        })
        // 同步js-moblie-select的選項
        selectArr.forEach(function(item, index){
            if(jsSelect.value.indexOf(item) !== -1){
                jsMoblieSelect.selectedIndex = index + 1;
            }
        })
        renderSortList(resultData);
    }
})

// 手機頁面修改排序事件
jsMoblieSelect.addEventListener("change", function (e) {
    if (resultData.length === 0) {
        return;
    } else {
        selectArr.forEach(function (item) {
            if (jsMoblieSelect.value.indexOf(item) !== -1) {
                resultData.sort(function (a, b) {
                    return a[item] - b[item]
                })
            }
        })
        // 同步js-select的選項
        selectArr.forEach(function(item, index){
            if(jsMoblieSelect.value.indexOf(item) !== -1){
                jsSelect.selectedIndex = index + 1;
            }
        })
        renderSortList(resultData);
    }
})

// 調整由大到小或由小到大排序
upAndDown.addEventListener("click", function(e){
    let getUpDown = e.target.getAttribute("data-price");
    if(e.target.nodeName !== "I"){
        return;
    }else{
        if(e.target.getAttribute("data-sort") === "up"){
            resultData.sort(function(a, b){
                return a[getUpDown] - b[getUpDown]
            })
        }else{
            resultData.sort(function(a, b){
                return b[getUpDown] - a[getUpDown]
            })
        }
        if(resultData.length === 0){
            return;
        }
        renderSortList(resultData);
    }
})