const btnGroups = document.querySelector(".button-group");
const showList = document.querySelector(".showList");
const roundedEnd = document.querySelector(".rounded-end");
const showResult = document.querySelector(".show-result");
const search = document.querySelector(".search");
const textCenter = document.querySelector(".text-center");
const jsSelect = document.querySelector("#js-select");
const jsMoblieSelect = document.querySelector("#js-moblie-select");
const upDownSort = document.querySelector(".js-sort-advanced");

const selectArr = ["上價", "中價", "下價", "平均價", "交易量"];
let data = [];
let resultData = [];

axios.get('https://hexschool.github.io/js-filter-data/data.json')
    .then(function (response) {
        // 取得資料時先移除null欄位項目
        data = response.data.filter(item => item["作物名稱"] !== null);
    }).catch(function (error) {
        console.log(error);
    });

search.addEventListener("click", function (e) {
    let getType = document.querySelector(".selected");
    let newData = [];
    // 重置resultData內容
    resultData = [];

    if (getType === null || roundedEnd.value.trim() === "") {
        roundedEnd.value.trim() === "" ? alert("請輸入要比價的農產品") : alert("請選擇要查詢的農產品類別");
        return;
    }
    showResult.innerHTML = `查看「${roundedEnd.value}」的比價結果`;

    data.forEach(function (item) {
        if (item["種類代碼"] === getType.getAttribute("data-type")) {
            newData.push(item);
        }
    })

    newData.forEach(function (item) {
        // 比對作物名稱, 有找到就丟到resultData內
        if (item["作物名稱"].indexOf(roundedEnd.value) !== -1) {
            resultData.push(item);
        }
    })
    renderList(resultData);
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
// 幫選取的農產品按鈕種類上色
btnGroups.addEventListener("click", function (e) {
    if (e.target.nodeName !== "BUTTON") return;
    checkSelected(e)
})

// 資料查詢渲染
let renderList = function (dataList) {
    str = "";
    if (dataList.length === 0) {
        str = `<tr>
        <td colspan="7" class="text-center p-3">查詢不到當日的交易資訊QQ</td>
        </tr>`;
    } else {
        dataList.forEach(function (item) {
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
    }
    selectArr.forEach(function (item) {
        if (jsSelect.value.indexOf(item) !== -1) {
            resultData.sort(function (a, b) {
                return a[item] - b[item]
            })
        }
    })
    renderList(resultData);
})

// 手機頁面修改排序事件
jsMoblieSelect.addEventListener("change", function (e) {
    if (resultData.length === 0) {
        return;
    }
    selectArr.forEach(function (item) {
        if (jsMoblieSelect.value.indexOf(item) !== -1) {
            resultData.sort(function (a, b) {
                return a[item] - b[item]
            })
        }
    })
    renderList(resultData);
})

// 調整由大到小或由小到大排序
upDownSort.addEventListener("click", function (e) {
    let getUpDown = e.target.getAttribute("data-price");
    if (e.target.nodeName !== "I" || resultData.length === 0) {
        return;
    } 
    if (e.target.getAttribute("data-sort") === "up") {
        resultData.sort(function (a, b) {
            return a[getUpDown] - b[getUpDown]
        })
    } else {
        resultData.sort(function (a, b) {
            return b[getUpDown] - a[getUpDown]
        })
    }
    renderList(resultData);
})

// 網頁載入完成時直接顯示全部內容
window.onload = function () {
    renderList(data);
}