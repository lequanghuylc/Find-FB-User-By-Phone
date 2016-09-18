var fbSearchAutoRex = /https:\/\/m.facebook.com\/search\/people\/\?q=(.*)&snext1=(.*)&fromext=true/g;
var fbProfileAutoRex = /https:\/\/www.facebook.com\/(.*)&snext1=(.*)&fromext=true/g;
var fbSearchSingleRex = /https:\/\/m.facebook.com\/search\/people\/\?q=(.*)&fromext=true&single=true/g;
var fbProfileSingleRex = /https:\/\/www.facebook.com\/(.*)&fromext=true&single=true/g;


//////////////////////////////////////////////////////    AUTO
// only execute on facebook search page
if(fbSearchAutoRex.test(window.location.href)){
	//generate the next link by adding suffix
	
	var suffixSearch = "&";
	if(window.location.href.indexOf("&snext1=false") > -1){
		suffixSearch += "snext1=false&fromext=true";
	} else {
		var regex = /snext((.(?!snext))+?)&/g;
		var snextArr = window.location.href.match(regex);
		var nextLinkArr = snextArr.map(function(val, index){
			var foo = val.match(/=(.*)&/)[0].substr(1);
			return foo.substr(0, foo.length - 1);
		});
		if(nextLinkArr.length === 1){
			suffixSearch += "snext1=false" + "&";
		} else {
			nextLinkArr.slice(1, nextLinkArr.length).forEach(function(val, index){
				suffixSearch += "snext" + (index + 1) + "=" + val + "&";
			});
		}
		
		suffixSearch += "fromext=true";
	}
	
	// remove distraction
	document.querySelector("#header").style.display = "none";
	//document.querySelector("._1e0o").style.display = "none";
	document.querySelector("#viewport").style.marginTop = "-30px";
	//window.close();
	document.querySelector("._54k8._56bs._2gi-._56bt").style.display = "none";
	//$("._54k8._56bs._2gi-._56bt").css("display","none");
	document.querySelector("#main-search-input").setAttribute("disabled", "true");
	
	// change profile link to www
	var fooLinkElement = document.querySelector("[data-sigil=m-graph-search-result-page-click-target]");
	
	if(fooLinkElement === null ){
		// things to do when search result is not found
				
		if(window.location.href.indexOf("&snext1=false") === -1){
			var theNextPhone = nextLinkArr[0];
			window.location = "https://m.facebook.com/search/people/?q=" + theNextPhone + suffixSearch;
		} else {
			window.close();
		}
	} else {
		// things to do when search result is found
		var thisPhoneRegex = /q=((.(?!q=))+?)&/;
		var thisphone = window.location.href.match(thisPhoneRegex)[0].slice(2,-1);
		var oldSuffixLocation = window.location.href.indexOf("&snext1=");
		var oldSuffixSearch = window.location.href.substr(oldSuffixLocation);
		var fooHref = fooLinkElement.getAttribute("href");
		var profileTypeLink = /profile.php\?id=/g;
		if(profileTypeLink.test(fooHref)){
			var wwwLink = "https://wwww.facebook.com" + fooHref.substring(0, fooHref.indexOf("&")) + "&thisphone=" +thisphone+ oldSuffixSearch;
		} else {
			var wwwLink = "https://wwww.facebook.com" + fooHref.substring(0, fooHref.indexOf("?")) + "?thisphone=" +thisphone+ oldSuffixSearch;
		}
		console.log(wwwLink);
		var linkArray = document.querySelectorAll("a");
		linkArray.forEach(function(item){
			item.setAttribute("href", wwwLink);
		});
		window.location = wwwLink;
	}
	
}

// only execute on facebook profile page
if(fbProfileAutoRex.test(window.location.href)){
	
	var linkArray = document.querySelectorAll("a");
	linkArray.forEach(function(item){
		item.setAttribute("target", "_blank");
	});	
	var profileLink = window.location.href.substring(0,window.location.href.indexOf("fromext=true")-1);
	
	//find user ID
	var str = document.body.innerHTML;
	var begin = str.indexOf("profile_id=") !== -1 ? str.indexOf("profile_id=") : str.indexOf("profile_id:");
	var numberArr = ["0","1","2","3","4","5","6","7","8","9"];
	var ii = 0;
	while(numberArr.indexOf(str[begin+11+ii]) >-1 ){
		ii++;
	}
	var profileID = str.substr(begin+11,ii);
	console.log(profileID);
	
	//save searched data by sending a post request.
	var thisPhoneRegex = /thisphone=((.(?!thisphone=))+?)&/;
	var thisphone = window.location.href.match(thisPhoneRegex)[0].slice(10,-1);
	/*
	$.post("https://pricecrawler-quanghuyf.c9users.io/post", {
		ID: profileID,
		name: document.title,
		phone: thisphone
	},function(data){
		
	});
	*/
	var postdata = "entry.389548626="+thisphone+"&entry.1304505100="+encodeURI(document.title)+"&entry.987716142="+profileID;
	// link result
	// https://docs.google.com/spreadsheets/d/1_-dSKfO6JbcIGNOM97873UIN9aenzM0rdA3sVVor0WE/edit
	$.ajax({
		data: postdata,
		type: "POST",
		url: "https://docs.google.com/forms/d/e/1FAIpQLSdYnbEol2PnN9_HBMranwqh9DepOmVk3gTli-Wz8XjsakjNLg/formResponse",
		contentType: "application/x-www-form-urlencoded;charset=utf-8"
	});
	if(typeof document.querySelector("._1zw4") !== "undefined"){
		var foo = document.querySelector("._1zw4").innerHTML;
	} else {
		var foo = "Something wrong happend when getting user data. Try to contact Huy.";
	}	
	document.body.innerHTML = "<h3 style='text-align:center;margin-top:20px;'>"+document.title+"</h3>"+"<h4 style='text-align:center;'>ID:"+profileID+"</h4>"+"<h4 style='text-align:center;'>Link:"+"<a href='"+profileLink+"' target='_blank'>" + profileLink + "</a></h4>"+foo;
	
	//generate the next link by adding suffix
	var suffixSearch = "&";
	if(window.location.href.indexOf("&snext1=false") > -1){
		suffixSearch += "snext1=false&fromext=true";
	} else {
		var regex = /snext((.(?!snext))+?)&/g;
		var snextArr = window.location.href.match(regex);
		var nextLinkArr = snextArr.map(function(val, index){
			var foo = val.match(/=(.*)&/)[0].substr(1);
			return foo.substr(0, foo.length - 1);
		});
		if(nextLinkArr.length === 1){
			suffixSearch += "snext1=false" + "&";
		} else {
			nextLinkArr.slice(1, nextLinkArr.length).forEach(function(val, index){
				suffixSearch += "snext" + (index + 1) + "=" + val + "&";
			});
		}		
		suffixSearch += "fromext=true";
		
	}
	
	//continue searching another phone number
	if(window.location.href.indexOf("&snext1=false") === -1){
		var theNextPhone = nextLinkArr[0];
		window.location = "https://m.facebook.com/search/people/?q=" + theNextPhone + suffixSearch;
	} else {
		window.close();
	}
}








//////////////////////////////////////////////////////    SINGLE
// only execute on facebook search page single
if(fbSearchSingleRex.test(window.location.href)){
		
	// remove distraction
	document.querySelector("#header").style.display = "none";
	//document.querySelector("._1e0o").style.display = "none";
	document.querySelector("#viewport").style.marginTop = "-30px";
	//window.close();
	document.querySelector("._54k8._56bs._2gi-._56bt").style.display = "none";
	//$("._54k8._56bs._2gi-._56bt").css("display","none");
	document.querySelector("#main-search-input").setAttribute("disabled", "true");
	
	// change profile link to www
	var fooLinkElement = document.querySelector("[data-sigil=m-graph-search-result-page-click-target]");
	
	if(fooLinkElement === null ){
		// things to do when search result is not found
	} else {
		// things to do when search result is found
		var thisPhoneRegex = /q=((.(?!q=))+?)&/;
		var thisphone = window.location.href.match(thisPhoneRegex)[0].slice(2,-1);
		var suffixSearch = "&fromext=true&single=true";
		var fooHref = fooLinkElement.getAttribute("href");
		var profileTypeLink = /profile.php\?id=/g;
		if(profileTypeLink.test(fooHref)){
			var wwwLink = "https://wwww.facebook.com" + fooHref.substring(0, fooHref.indexOf("&")) + "&thisphone=" +thisphone+ suffixSearch;
		} else {
			var wwwLink = "https://wwww.facebook.com" + fooHref.substring(0, fooHref.indexOf("?")) + "?thisphone=" +thisphone+ suffixSearch;
		}
		console.log(wwwLink);
		var linkArray = document.querySelectorAll("a");
		linkArray.forEach(function(item){
			item.setAttribute("href", wwwLink);
		});
		window.location = wwwLink;
	}
	
}

// only execute on facebook profile page single
if(fbProfileSingleRex.test(window.location.href)){
	
	var linkArray = document.querySelectorAll("a");
	linkArray.forEach(function(item){
		item.setAttribute("target", "_blank");
	});	
	var profileLink = window.location.href.substring(0,window.location.href.indexOf("fromext=true")-1);
	
	//find user ID
	var str = document.body.innerHTML;
	var begin = str.indexOf("profile_id=") !== -1 ? str.indexOf("profile_id=") : str.indexOf("profile_id:");
	var numberArr = ["0","1","2","3","4","5","6","7","8","9"];
	var ii = 0;
	while(numberArr.indexOf(str[begin+11+ii]) >-1 ){
		ii++;
	}
	var profileID = str.substr(begin+11,ii);
	console.log(profileID);
	
	//save searched data by sending a post request.
	var thisPhoneRegex = /thisphone=((.(?!thisphone=))+?)&/;
	var thisphone = window.location.href.match(thisPhoneRegex)[0].slice(10,-1);
	var postdata = "entry.389548626="+thisphone+"&entry.1304505100="+encodeURI(document.title)+"&entry.987716142="+profileID;
	// link result
	// https://docs.google.com/spreadsheets/d/1_-dSKfO6JbcIGNOM97873UIN9aenzM0rdA3sVVor0WE/edit
	$.ajax({
		data: postdata,
		type: "POST",
		url: "https://docs.google.com/forms/d/e/1FAIpQLSdYnbEol2PnN9_HBMranwqh9DepOmVk3gTli-Wz8XjsakjNLg/formResponse",
		contentType: "application/x-www-form-urlencoded;charset=utf-8"
	});
	if(typeof document.querySelector("._1zw4") !== "undefined"){
		var foo = document.querySelector("._1zw4").innerHTML;
	} else {
		var foo = "Something wrong happend when getting user data. Try to contact Huy.";
	}	
	document.body.innerHTML = "<h3 style='text-align:center;margin-top:20px;'>"+document.title+"</h3>"+"<h4 style='text-align:center;'>ID:"+profileID+"</h4>"+"<h4 style='text-align:center;'>Link:"+"<a href='"+profileLink+"' target='_blank'>" + profileLink + "</a></h4>"+foo;
	
}