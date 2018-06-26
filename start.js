var s = document.createElement('script');
s.src = chrome.extension.getURL('content.js');
s.id = "myScript";
if(!document.getElementById("myScript")){
    (document.body || document.documentElement).appendChild(s);
}
// s.onload = function() {
//   this.remove();
// };

