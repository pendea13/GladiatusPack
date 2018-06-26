function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

// check data exist
var defaultValue = {
    "startScript":false,
    "selectedItem": 0,
    "sellOnOff":'off',
    "newPackOnOff":'off',
    "backpackId":513,
    "sell": false,
    "sellMarket":false,
    "shopsData": {0:1, 1:0}
};
chrome.storage.local.get({data: defaultValue}, function (data) {
    // data.links will be either the stored value, or defaultValue if nothing is set
    console.log(data);
    chrome.storage.local.set({data: data.data}, function () {
        // The value is now stored, so you don't have to do this again
    });
    chrome.storage.onChanged.addListener(function (changes, areaName) {

        // Send data through port
        chrome.runtime.onConnectExternal.addListener(function (portInjected) {
            console.log('injected from popup ' + areaName);
            data.data=changes.data.newValue;
            portInjected.postMessage(changes.data.newValue);
        });
    });
    chrome.runtime.onConnectExternal.addListener(function (portInjected) {
        portInjected.postMessage(data.data);
        portInjected.onMessage.addListener(function (msg) {
            console.log(data.data, "data");
            console.log(msg, "msg");

            if (data.data.shopsData != msg.shopsData || data.data.sell != msg.sell) {

                chrome.storage.local.set({data: msg}, function () {
                    // The value is now stored, so you don't have to do this again
                });
            }

            return true;

        });
    });

});


