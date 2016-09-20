function autoSearchOnSite(info, tab) {
	var selectArr = info.selectionText.split(" ");
	var SelectedText = selectArr[0].replace("+84", "0");
	var suffixArr = selectArr.slice(1,selectArr.length); //remove the first element of selectArr
	var suffixSearch = "&";
	if(selectArr.length === 1){
		suffixSearch += "snext1=false&fromext=true";
	} else {
		suffixArr.forEach(function(val, index){
			suffixSearch += "snext" + (index + 1) + "=" + val + "&";
		});
		suffixSearch += "fromext=true";
	}
	
	window.open("https://m.facebook.com/search/people/?q=" + SelectedText +suffixSearch,"Facebook-popup-window"+Math.random(),'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1,height=1');
	/*
	chrome.tabs.create({
		'url': "https://m.facebook.com/search/people/?q=" + SelectedText
	}, function(tab) {});
	*/
}

function singleSearchOnSite(info, tab) {
	var SelectedText = info.selectionText.replace("+84", "0");
	var suffixSearch = "&fromext=true&single=true";	
	window.open("https://m.facebook.com/search/people/?q=" + SelectedText +suffixSearch,"window"+Math.random(),'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=320,height=500');
	
}
	var context = "selection";
	var parent = chrome.contextMenus.create({"title": "DataSection Mobile Search", "contexts":[context]});
	
	var id = chrome.contextMenus.create({"title": "Tìm nhiều sđt và tìm tự động", "parentId": parent, "contexts":[context],"onclick": autoSearchOnSite});
  
	var id2 = chrome.contextMenus.create({"title": "Tìm một sđt", "parentId": parent, "contexts":[context],"onclick": singleSearchOnSite});
	
	
var cookie = "";
chrome.cookies.getAll({"url": "https://www.facebook.com"}, function(data){
	cookie = data;		
});

chrome.commands.onCommand.addListener(function (command) {
		if (command === "find") {
			chrome.cookies.getAll({"url": "https://www.facebook.com"}, function(data){
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				  chrome.tabs.sendMessage(tabs[0].id, data, function(response) {
					
				  });
				});
			});			
		}
	});
	
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		sendResponse({result: cookie});	
});