var data;
// Connect to background script
var port = chrome.runtime.connect('jbjkajmlbmjeeekekfcfhepgplanmggm');
// Listen for response
port.onMessage.addListener(function (message, sender) {

    // Print and store message data
    data = Object.assign({}, message);
    console.log(data);
    return true;
});
var startScript = setInterval(function () {
    if (data != "undefined") {
        if (data.startScript) {

            function serverDown() {
                var currentLink = window.location.href;
                var downId = document.getElementById("title_infobox") || 0;
                var downLink = "https://s22-ro.gladiatus.gameforge.com/game/index.php?mod=start";
                var downLink2 = "https://s22-ro.gladiatus.gameforge.com/game/index.php?mod=start&submod=needLogin&sh=" + secureHash;
                if (currentLink == downLink) {
                    console.log("The server is DOWN at the moment.");
                    setInterval(function () {
                        location.reload();
                    }, 10000);
                } else {
                    console.log("The server is currently UP :" + '"' + currentLink + '"');
                }
                if (currentLink == downLink2) {
                    console.log("The server Might be down at the moment.");
                    setInterval(function () {
                        location.reload();
                    }, 10000);
                }
                if (downId != 0) {
                    console.log("The server is DOWN at the moment.");
                    setInterval(function () {
                        location.reload();
                    }, 10000);
                }
            }

            serverDown();
            (function ($) {
                'use strict';
                var selectedItem = data.selectedItem;
                var backpackId = data.backpackId;

                function moveItem(dataToParam) {
                    var requestUrl = "ajax.php?mod=inventory&submod=move";
                    var finalUrl = requestUrl + "&" + jQuery.param(dataToParam);
                    var resp = null;
                    var e = "";
                    e = e + "&a=" + new Date().getTime();
                    e = e + "&sh=" + secureHash;
                    jQuery.ajax({
                        url: finalUrl,
                        type: 'POST',
                        data: e,
                        async: false,
                        success: function (stuff) {
                            resp = JSON.parse(stuff);
                        }
                    });
                    return resp;
                }

                function checkForItems(item) {
                    var move = false;

                    var inv = getBlocksInv(item['inv'], pagePackages);
                    for (var y = 1; y < item['inv']['maxY']; y++) {
                        for (var x = 1; x < item['inv']['maxX']; x++) {
                            if (inv[y][x] === true && y + item['y'][1] <= item['inv']['maxY'] && x + item['x'][1] <= item['inv']['maxX']) {
                                checkItem: for (var itemY = y; itemY < y + item['y'][1]; itemY++) {
                                    for (var itemX = x; itemX < x + item['x'][1]; itemX++) {
                                        if (inv[itemY][itemX] === true) {
                                            move = true;
                                        } else {
                                            move = false;
                                            break checkItem;
                                        }
                                    }
                                }
                                if (move == true) {
                                    var result = [];
                                    result['x'] = x;
                                    result['y'] = y;
                                    return result;
                                }
                            }
                            else if (y + item['y'][1] >= item['inv']['maxY'] && x + item['x'][1] >= item['inv']['maxX']) {
                                return false;
                            }
                        }
                    }
                    if (item['y'][1] == 1 && item['x'][1] == 1) {
                        data.shopsData[1] = data.shopsData[1] + 1;
                        port.postMessage(data);
                        location.reload();
                    }
                    return false;
                }

                function setArrayBlock(item, invArray) {
                    for (var x = item.getAttribute("data-position-x").toInt(); x < item.getAttribute("data-position-x").toInt() + item.getAttribute("data-measurement-x").toInt(); x++) {
                        for (var y = item.getAttribute("data-position-y").toInt(); y < item.getAttribute("data-position-y").toInt() + item.getAttribute("data-measurement-y").toInt(); y++) {
                            invArray[y][x] = false;
                        }
                    }
                    return invArray;
                }

                function getBlocksInv(inv) {


                    var items = $("div[data-container-number='" + inv['to'] + "']");
                    var invMatrix = [];
                    var maxY = 6;
                    var maxX = 9;
                    if (inv['to'] < 500) {
                        maxY = 9;
                        maxX = 7;
                        items.splice(0, 1);
                    } else {
                        var button = $("a[data-bag-number='" + inv['to'] + "']");
                        button[0].click();
                    }

                    for (var y = 1; y < maxY; y++) {
                        invMatrix[y] = [];
                        for (var x = 1; x < maxX; x++) {
                            invMatrix[y][x] = true;
                        }
                    }
                    for (var i = 0; i < items.length; i++) {
                        invMatrix = setArrayBlock(items[i], invMatrix);
                    }
                    return invMatrix;
                }

                function moveObject(sendable, item, pagePackages) {
                    setInterval(function () {
                        if (!moveItem(sendable).error) {
                            getBlocksInv(item['inv'], pagePackages);
                            location.reload();
                        }
                    }, 100);
                }

                function start(i, pakageItem, action) {

                    if (i < pakageItem.length) {

                        setTimeout(function () {
                            var item = [];
                            item[0] = pakageItem[i].getAttribute("data-container-number").toInt();
                            var child = pakageItem[i].children[0];
                            item[1] = child.getAttribute("data-amount").toInt();
                            item['inv'] = [];
                            item['y'] = [];
                            item['x'] = [];
                            item['inv']['to'] = 513;
                            item['inv']['maxY'] = 6;
                            item['inv']['maxX'] = 9;
                            item['y'][0] = child.getAttribute("data-position-y").toInt();
                            item['x'][0] = child.getAttribute("data-position-x").toInt();
                            item['y'][1] = child.getAttribute("data-measurement-y").toInt();
                            item['x'][1] = child.getAttribute("data-measurement-x").toInt();
                            if (i + 1 == pakageItem.length) {
                                data[action] = true;
                                port.postMessage(data);
                                if(action == "sellMarket"){
                                    sellItemsOnMarket(myLoc,backpackId,action)
                                }else{
                                    return sellItems(myLoc, data.shopsData, action);

                                }
                            }
                            i++;
                            var forCheck = checkForItems(item);
                            console.log(forCheck);
                            var isGold = Boolean(child.getAttribute("data-basis").match("14-1"));
                            if (selectedItem === 14) {
                                isGold = false;
                            }
                            if (forCheck.constructor === Array && !isGold) {
                                var sendable = {
                                    from: item[0],
                                    fromX: item['x'][0],
                                    fromY: item['y'][0],
                                    to: item['inv']['to'],
                                    toX: forCheck['x'],
                                    toY: forCheck['y'],
                                    amount: item[1]
                                };
                                return moveObject(sendable, item, pagePackages);
                            }
                            start(i, pakageItem, action);

                        }, 50);
                    }
                }

                function getIdOfItems(loc, object, action) {
                    var page = fullLoc + '?mod=packages&f=' + object + '&fq=0&qry=&page=1&sh=' + secureHash;
                    if (loc == page) {
                        var checkPackageExist = setInterval(function () {
                            if (!$("div.inventory_box.unavailable").length) {
                                var pakageItem = $("div[data-no-combine='true']");
                                console.log("here");
                                // pakageItem.sort(function(a, b){return b.children[0].getAttribute("data-measurement-y").toInt() - a.children[0].getAttribute("data-measurement-y").toInt()});
                                start(0, pakageItem, action);
                                clearInterval(checkPackageExist);
                            }
                        }, 300);
                    } else {
                        window.location.replace(page);
                    }
                }

                function startSell(i, items, shops, action) {
                    if (0 == items.length) {
                        data[action] = false;
                        port.postMessage(data);
                        return getIdOfItems(myLoc, selectedItem, action);
                    }

                    if (i <= items.length) {

                        setTimeout(function () {
                            if (i == items.length) {
                                console.log(shops);
                                if (shops[0] <= 6 && shops[1] <= 2) {
                                    if (shops[0] == 6 && shops[1] == 2) {
                                        shops[0] = 1;
                                        shops[1] = 0;
                                        data.shopsData = shops;
                                        port.postMessage(data);
                                    } else if (shops[1] < 2) {
                                        shops[1] = shops[1] + 1;
                                        data.shopsData = shops;
                                        port.postMessage(data);
                                    } else {
                                        shops[0] = shops[0] + 1;
                                        shops[1] = 0;
                                        data.shopsData = shops;
                                        port.postMessage(data);
                                    }
                                    data.shopsData = shops;
                                    port.postMessage(data);
                                } else {
                                    shops[0] = 1;
                                    shops[1] = 0;
                                    data.shopsData = shops;
                                    port.postMessage(data);
                                }
                                return sellItems(myLoc, shops, action);
                            }

                            var itemData = items[i];

                            var item = [];
                            item[0] = itemData.getAttribute("data-container-number").toInt();
                            item[1] = itemData.getAttribute("data-amount").toInt();
                            item['inv'] = [];
                            item['y'] = [];
                            item['x'] = [];
                            item['inv']['to'] = $("div#shop").attr("data-container-number").toInt();
                            item['inv']['maxX'] = 7;
                            item['inv']['maxY'] = 9;
                            item['y'][0] = itemData.getAttribute("data-position-y").toInt();
                            item['x'][0] = itemData.getAttribute("data-position-x").toInt();
                            item['y'][1] = itemData.getAttribute("data-measurement-y").toInt();
                            item['x'][1] = itemData.getAttribute("data-measurement-x").toInt();

                            var forCheck = checkForItems(item);

                            console.log(forCheck);
                            if (forCheck.constructor === Array) {
                                var sendable = {
                                    from: item[0],
                                    fromX: item['x'][0],
                                    fromY: item['y'][0],
                                    to: item['inv']['to'],
                                    toX: forCheck['x'],
                                    toY: forCheck['y'],
                                    amount: item[1]
                                };
                                return moveObject(sendable, item, pagePackages);
                            }

                            i++;
                            startSell(i, items, shops,action);

                        }, 50);
                    }
                }

                function sellItems(loc, shop,action) {
                    var page = fullLoc + '?mod=inventory&sub=' + shop[0] + '&subsub=' + shop[1] + '&sh=' + secureHash;
                    if (page == loc) {
                        var checkExist = setInterval(function () {
                            if (!$("div.inventory_box.unavailable").length) {
                                var items = $("div[data-container-number='513']");
                                var itemsToSell = [];
                                for (var i = 0, len = items.length; i < len; i++) {

                                    if (!Boolean(items[i].getAttribute("data-basis").match(/7-[0-9]*$/))) {
                                        itemsToSell[itemsToSell.length] = items[i];
                                    }
                                }
                                itemsToSell.sort(function (a, b) {
                                    return b.getAttribute("data-measurement-y").toInt() - a.getAttribute("data-measurement-y").toInt()
                                });
                                var shops = data.shopsData;
                                startSell(0, itemsToSell, shops,action);
                                clearInterval(checkExist);
                            }
                        }, 300);
                    } else {
                        window.location.replace(page);
                    }
                }

                //current page data
                var myLoc = location.toString();
                var fullLoc = location.origin.toString() + location.pathname.toString();
                // ------------------
                //current gold ammount
                var myGold = jQuery("#sstat_gold_val").text().trim().replace('.', '').toInt();
                //page packages
                var pagePackages = Boolean(myLoc.match(/mod=packages/));

                //home
                var pageHome = Boolean(myLoc.match(/mod=overview/));

                if (data.sellOnOff == 'on') {

                    if (!data.sell) {
                        getIdOfItems(myLoc, data.selectedItem, "sell");
                    } else {
                        sellItems(myLoc, data.shopsData, "sell");
                    }
                }

                function startSellMarket(items, action) {

                    if ($('table#market_item_table tbody tr').length) {
                        //var $=jQuery; var myGold=1000000;
                        var rowsMarket = $('table#market_item_table tbody tr');
                        rowsMarket.splice(0, 1);
                        var tabelData = [];
                        for (var j = 0; j < rowsMarket.length; j++) {

                            if (rowsMarket[j].children[5].children[0].value == "Anuleaza" && rowsMarket[j].children[2].innerHTML.split('.').join("").toInt() == 1) {
                                tabelData.push(rowsMarket[j]);
                            }

                        }

                        for (var i = 0; i < rowsMarket.length; i++) {
                            if (rowsMarket[i].children[5].children[0].value == "Anuleaza" && rowsMarket[i].children[2].innerHTML.split('.').join("").toInt() == 1) {
                                rowsMarket[i].children[5].children[0].click();
                            }
                        }
                        if (!tabelData.length) {
                            console.log(tabelData.length);
                            $('input[name="sellid"]').val(items[0].getAttribute("data-item-id"));
                            $('input[name="preis"]').val(1);
                            $('input[name="anbieten"]').click();
                        }
                    }
                    if (0 == items.length) {
                        data[action] = false;
                        port.postMessage(data);
                        return getIdOfItems(myLoc, selectedItem, action);
                    }

                }

                function sellItemsOnMarket(loc, backpackId,action) {
                    var page = fullLoc + '?mod=guildMarket&sh=' + secureHash;
                    if (page == loc) {
                        var checkExist = setInterval(function () {
                            if (!$("div.inventory_box.unavailable").length) {
                                var items = $("div[data-container-number='" + backpackId + "']");

                                startSellMarket(items,action);
                                clearInterval(checkExist);
                            }
                        }, 300);
                    } else {
                        window.location.replace(page);
                    }
                }

                if (data.newPackOnOff == 'on') {

                    if (!data.sellMarket) {
                        getIdOfItems(myLoc, selectedItem, "sellMarket");
                    } else {
                        sellItemsOnMarket(myLoc, backpackId, "sellMarket");
                    }
                }

            })(jQuery);
            clearInterval(startScript);
        }
    }
}, 300);


