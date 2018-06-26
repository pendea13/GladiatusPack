(function () {
    var select = document.getElementById("selectedItem");
    for (i = 0; i <= 21; i++) {
        var item = document.createElement('option');
        item.value = i;
        item.textContent = i;
        select.appendChild(item);
    }
})();
chrome.storage.local.get(['data'], function (result) {
    var data;
    chrome.storage.onChanged.addListener(function (changes, areaName) {
        console.log("New item in storage", changes.data.newValue);
    })
    data = result.data;
    console.log('data');
    console.log(data);
    document.getElementById("newPackOnOff").value = data.newPackOnOff;
    document.getElementById("newPackOnOff").textContent = data.newPackOnOff;
    document.getElementById("sellOnOff").value = data.sellOnOff;
    document.getElementById("sellOnOff").textContent = data.sellOnOff;
    document.getElementById("startScript").value = data.startScript;
    document.getElementById("startScript").textContent = data.startScript;
    document.getElementById("selectedItem").selectedIndex = data.selectedItem;
    var backpackIds = document.querySelectorAll("#backpackId > option");
    backpackIds.forEach(function (backpackId) {
        if (backpackId.value == data.backpackId) {
            document.getElementById("backpackId").selectedIndex = backpackId.index;
        }
    });
    document.getElementById("selectedItem").addEventListener("click", toggle);
    document.getElementById("backpackId").addEventListener("click", toggle);
    document.getElementById("startScript").addEventListener("click", toggle);
    document.getElementById("sellOnOff").addEventListener("click", toggle);
    document.getElementById("newPackOnOff").addEventListener("click", toggle);
    document.getElementById("clear").addEventListener("click", dataClear);


    function toggle() {

        if (this.selectedIndex) {
            data[this.id] = parseInt(this.options[this.selectedIndex].value);
            chrome.storage.local.set({data: data}, function () {
                console.log("Just saved", data)
            });
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                // chrome.tabs.reload(tabs[0].id);
                console.log(tabs);
            });
        }
        else if (this.value == "true") {
            this.value = "false";
            this.textContent = "false";
            console.log(this.selectedIndex);
            data[this.id] = false;
            console.log(data);
            chrome.storage.local.set({data: data}, function () {
                console.log("Just saved")
            });
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.reload(tabs[0].id);
            });
        }

        else if (this.value == "false") {
            this.value = "true";
            this.textContent = "true";
            data[this.id] = true;
            chrome.storage.local.set({data: data}, function () {
                console.log("Just saved", data)
            });
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.reload(tabs[0].id);
            });
        }
        else if (this.value == "on") {
            this.value = "off";
            this.textContent = "off";
            data[this.id] = 'off';
            chrome.storage.local.set({data: data}, function () {
                console.log("Just saved", data)
            });
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.reload(tabs[0].id);
            });
        }
        else if (this.value == "off") {
            var elements = document.querySelectorAll('.onOff');
            elements.forEach(function (element) {
                element.value = 'off';
                element.textContent = 'off';
            });
            this.value = "on";
            this.textContent = "on";
            data.sellOnOff = 'off';
            data.newPackOnOff = 'off';
            data[this.id] = 'on';
            chrome.storage.local.set({data: data}, function () {
                console.log("Just saved", data)
            });
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.reload(tabs[0].id);
            });
        }
    }

    function dataClear() {
        chrome.storage.local.remove(["data"], function () {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            } else {
                console.log('package removed');
            }
        })
    }
});


