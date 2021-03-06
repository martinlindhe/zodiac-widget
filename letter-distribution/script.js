var z340 =
    "HER>pl^VPk|1LTG2d" +
    "Np+B(#O%DWY.<*Kf)" +
    "By:cM+UZGW()L#zHJ" +
    "Spp7^l8*V3pO++RK2" +
    "_9M+ztjd|5FP+&4k/" +
    "p8R^FlO-*dCkF>2D(" +
    "#5+Kq%;2UcXGV.zL|" +
    "(G2Jfj#O+_NYz+@L9" +
    "d<M+b+ZR2FBcyA64K" +
    "-zlUV+^J+Op7<FBy-" +
    "U+R/5tE|DYBpbTMKO" +
    "2<clRJ|*5T4M.+&BF" +
    "z69Sy#+N|5FBc(;8R" +
    "lGFN^f524b.cV4t++" +
    "yBX1*:49CE>VUZ5-+" +
    "|c.3zBK(Op^.fMqG2" +
    "RcT+L16C<+FlWB|)L" +
    "++)WCzWcPOSHT/()p" +
    "|FkdW<7tB_YOB*-Cc" +
    ">MDHNpkSzZO8A|K;+";

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}


// sortFn is optional array sort callback function, 
// defaults to numeric sort if not passed
function sortSparseArray(arr, sortFn) {
    var tempArr = [], indexes = [];
    for (var i = 0; i < arr.length; i++) {
        // find all array elements that are not undefined
        if (arr[i] !== undefined) {
            tempArr.push(arr[i]);    // save value
            indexes.push(i);         // save index
        }
    }
    // sort values (numeric sort by default)
    if (!sortFn) {
        sortFn = function(a,b) {
            return a - b;
        }
    }
    tempArr.sort(sortFn);
    // put sorted values back into the indexes in the original array that were used
    for (var i = 0; i < indexes.length; i++) {
        arr[indexes[i]] = tempArr[i];
    }
    return arr;
}

// highlight hovered symbol
function hi(_class, name) {
    var els = document.getElementsByClassName(_class);
    for (var i = 0; i < els.length; i++) {
        els[i].classList.add(name);
    }
}

// un-highlight hovered symbol
function un(_class) {
    var els = document.getElementsByClassName(_class);
    for (var i = 0; i < els.length; i++) {
        els[i].classList.remove("hover");
    }
}

function redraw() {
    var tbl = document.getElementById("tblId");
    tbl.innerHTML = "";
    var width = document.getElementById("gridW").value;

    var topR = document.getElementById("topRows");
    var topRows = topR.value;
    var bottomR = document.getElementById("bottomRows");
    var bottomRows = bottomR.value;

    totRows = Math.ceil(z340.length / width);
    document.getElementById("gridH").value = totRows;

    topR.max = totRows;
    bottomR.max = totRows;
    lastRows = totRows - bottomRows;
    document.getElementById("midRows").value = totRows - topRows - bottomRows;

    tr = document.createElement("tr");
    tbl.appendChild(tr);
    tr.appendChild(document.createElement("td"));
    for (i = 0; i < width; i++) {
        td = document.createElement("td");
        td.className = "rowNum";
        td.innerHTML = i + 1;
        tr.appendChild(td);
    }

    cnt = 0;
    row = 0;
    for (i = 0; i < z340.length; i++) {

        if (cnt == 0) {
            if (row == topRows || row == lastRows) {
                // top rows marker
                tr = document.createElement("tr");
                tbl.appendChild(tr);
                td = document.createElement("td");
                td.colSpan = width + 1;
                tr.appendChild(td);
                hr = document.createElement('hr');
                td.appendChild(hr);
            }
     
            tr = document.createElement("tr");
            tbl.appendChild(tr);

            td = document.createElement("td");
            td.className = "rowNum";
            td.innerHTML = row + 1;
            tr.appendChild(td);
        }

        td = document.createElement("td");
        tr.appendChild(td);

        letter = z340.substring(i, i+1);
        td.setAttribute("class", "style_" + letter);

        td.onmouseover = new Function("hi('style_" + letter + "','hover')");
        td.onmouseout = new Function("un('style_" + letter + "','hover')");

        span = document.createElement('span');
        span.className = "sym";
        span.innerHTML = letter;
        td.appendChild(span);

        cnt++;
        if (cnt >= width) {
            cnt = 0;
            row++;
        }
    }

    markBySection();
}

function reset() {
    // reset width
    document.getElementById("gridW").value = 17;
    redraw();
}

// find and color all the letters not in middle in GREEN, and those only in middle in YELLOW
function markBySection() {
    var width = document.getElementById("gridW").value;
    var topRows = document.getElementById("topRows").value;
    var bottomRows = document.getElementById("bottomRows").value;
    var totRows = Math.ceil(z340.length / width);
    var topLetters = topRows * width;
    var midRows = totRows - topRows - bottomRows;
    var midLetters = midRows * width;

    var allMiddle = []; // all letters seen in the middle area
    var allTopBottom = []; // all letters seen in top or bottom area
    for (i = 0; i < z340.length; i++) {
        letter = z340.substring(i, i+1);
        ascii = letter.charCodeAt();
        if (i >= topLetters && i < (topLetters + midLetters)) {
            allMiddle[ascii] = true;
        }
        if (i < topLetters || i >= (topLetters + midLetters)) {
            allTopBottom[ascii] = true;
        }
    }

    var onlyTopBottom = []; // letters seen only in top or bottom area
    var onlyMiddle = []; // letters seen only in middle area
    for (i = 0; i < z340.length; i++) {
        letter = z340.substring(i, i+1);
        ascii = letter.charCodeAt();
        if (i < topLetters && allMiddle[ascii] !== true) {
            onlyTopBottom[ascii] = true;
        } else if (i >= (topLetters + midLetters) && allMiddle[ascii] !== true) {
            onlyTopBottom[ascii] = true;
        }

        if (i >= topLetters && i < (topLetters + midLetters) && allTopBottom[ascii] !== true) {
            onlyMiddle[ascii] = true;
        }
    }



    var showNotInMiddle = document.getElementById("markTopBottomOnly").checked;
    infoNotInMiddle.style.display = showNotInMiddle ? 'block' : 'none';

    if (showNotInMiddle) {
        var legend = document.getElementById("symbolsNotInMiddle");
        legend.innerHTML = "";

        keys = Object.keys(onlyTopBottom);
        for (i = 0; i < onlyTopBottom.length; i++) {
            ascii = keys[i];
            letter = String.fromCharCode(ascii);
            hi("style_" + letter, "green");

            var span = document.createElement('span');
            span.innerHTML = letter;
            span.className = "sym style_" + letter;
            span.onmouseover = new Function("hi('style_" + letter + "','hover')");
            span.onmouseout = new Function("un('style_" + letter + "','hover')");
            legend.appendChild(span);
        }
        document.getElementById("symbolsNotInMiddleCount").innerHTML = keys.length;
    }

    var showOnlyInMiddle = document.getElementById("markMiddleOnly").checked;
    infoOnlyMiddle.style.display = showOnlyInMiddle ? 'block' : 'none';

    if (showOnlyInMiddle) {
        var legend = document.getElementById("symbolsOnlyInMiddle");
        legend.innerHTML = "";

        keys = Object.keys(onlyMiddle);
        for (i = 0; i < onlyMiddle.length; i++) {
            ascii = keys[i];
            letter = String.fromCharCode(ascii);
            hi("style_" + letter, "yellow");

            var span = document.createElement('span');
            span.innerHTML = letter;
            span.className = "sym style_" + letter;
            span.onmouseover = new Function("hi('style_" + letter + "','hover')");
            span.onmouseout = new Function("un('style_" + letter + "','hover')");
            legend.appendChild(span);
        }
        document.getElementById("symbolsOnlyInMiddleCount").innerHTML = keys.length;
    }

    // info about the symbols in the middle area (assuming a separate cipher key was used here)
    var usedInMiddle = []; // used letters in middle area
    var midStart = width * topRows;
    var midLen = width * midRows;
    document.getElementById("symbolsInMiddleTotalCount").innerHTML = midLen;

    for (i = midStart; i < midStart + midLen; i++) {
        letter = z340.substring(i, i+1);
        ascii = letter.charCodeAt();
        if (usedInMiddle[ascii] === undefined) {
            usedInMiddle[ascii] = 1;
        } else {
            usedInMiddle[ascii]++;
        }
    }

    var listTag = document.getElementById("infoMiddleSymbolsList");
    listTag.innerHTML = "";

    var tbl = document.createElement('table');
    listTag.appendChild(tbl);
    var tr = document.createElement('tr');
    tbl.appendChild(tr);
    var td = document.createElement('td');
    tr.appendChild(td);

    // sort symbols by occurance, descending
    keys = Object.keys(usedInMiddle);
    keys.sort(function(a, b){
        return usedInMiddle[a] < usedInMiddle[b];
    });

    var unique = 0;
    var pos = 0;
    for (i = 0; i < usedInMiddle.length; i++) {
        ascii = keys[i];
        letter = String.fromCharCode(ascii);
        var cnt = usedInMiddle[ascii];
        if (cnt) {
            var pct = (cnt / midLen) * 100;
            var span = document.createElement('span');
            span.innerHTML = letter;
            span.className = "sym style_" + letter;
            span.onmouseover = new Function("hi('style_" + letter + "','hover')");
            span.onmouseout = new Function("un('style_" + letter + "','hover')");
            td.appendChild(span);

            var span = document.createElement('span');
            span.innerHTML = ' <span class="num">' + cnt + " (" + round(pct, 1) + "%)</span>";
            td.appendChild(span);
            td.appendChild(document.createElement('br'));
            unique++;
            pos++;
        }
        if (pos == Math.ceil(keys.length / 5)) {
            td = document.createElement('td');
            tr.appendChild(td);
            pos = 0;
        }
    }

    document.getElementById("symbolsInMiddleUniqueCount").innerHTML = unique;



    //"outside middle area"
    var usedInOutside = []; // used letters outside of middle area
    var cnt = 0;
    for (i = 0; i < z340.length; i++) {
        if (i < midStart || i >= midStart + midLen) {
            letter = z340.substring(i, i+1);
            ascii = letter.charCodeAt();
            if (usedInOutside[ascii] === undefined) {
                usedInOutside[ascii] = 1;
            } else {
                usedInOutside[ascii]++;
            }
            cnt++;
        }
    }
    document.getElementById("symbolsOutsideTotalCount").innerHTML = cnt;

    var listTag = document.getElementById("infoOutsideSymbolsList");
    listTag.innerHTML = "";

    var tbl = document.createElement('table');
    listTag.appendChild(tbl);
    var tr = document.createElement('tr');
    tbl.appendChild(tr);
    var td = document.createElement('td');
    tr.appendChild(td);

    // sort symbols by occurance, descending
    keys = Object.keys(usedInOutside);
    keys.sort(function(a, b){
        return usedInOutside[a] < usedInOutside[b];
    });

    var unique = 0;
    var pos = 0;
    for (i = 0; i < usedInOutside.length; i++) {
        ascii = keys[i];
        letter = String.fromCharCode(ascii);
        var cnt = usedInOutside[ascii];
        if (cnt) {
            var pct = (cnt / midLen) * 100;
            var span = document.createElement('span');
            span.innerHTML = letter;
            span.className = "sym style_" + letter;
            span.onmouseover = new Function("hi('style_" + letter + "','hover')");
            span.onmouseout = new Function("un('style_" + letter + "','hover')");
            td.appendChild(span);

            var span = document.createElement('span');
            span.innerHTML = ' <span class="num">' + cnt + " (" + round(pct, 1) + "%)</span>";
            td.appendChild(span);
            td.appendChild(document.createElement('br'));
            unique++;
            pos++;
        }
        if (pos == Math.ceil(keys.length / 5)) {
            td = document.createElement('td');
            tr.appendChild(td);
            pos = 0;
        }
    }

    document.getElementById("symbolsOutsideUniqueCount").innerHTML = unique;
}

function init() {
    document.getElementById("gridW").onchange = new Function("redraw()");
    document.getElementById("topRows").onchange = new Function("redraw()");
    document.getElementById("bottomRows").onchange = new Function("redraw()");
    document.getElementById("markTopBottomOnly").onchange = new Function("redraw()");
    document.getElementById("markMiddleOnly").onchange = new Function("redraw()");
}

// init scene
init();
redraw();
