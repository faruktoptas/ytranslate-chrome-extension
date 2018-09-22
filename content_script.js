var altPressed = false;
var apiKey = ""
var lang = "";
var apiUrl = "";


main = function () {
	function createUI(text){
		var yTranslatePopupDiv = document.getElementById('yTranslatePopupDiv');
		if (yTranslatePopupDiv === null) {
			yTranslatePopupDiv = document.createElement('div');
		}
		yTranslatePopupDiv.id = 'yTranslatePopupDiv';
		yTranslatePopupDiv.style.fontSize = "1.8em";
		yTranslatePopupDiv.style.color="#ffffff";
		yTranslatePopupDiv.style.textalign="left";
		yTranslatePopupDiv.style.right="20%";
		yTranslatePopupDiv.style.width="60%";
		yTranslatePopupDiv.style.margin="auto";
		yTranslatePopupDiv.style.top="20%";
		yTranslatePopupDiv.style.border="1px solid #DCA";
		yTranslatePopupDiv.style.background="#000000";
		yTranslatePopupDiv.style.opacity="0.7";
		yTranslatePopupDiv.style.borderRadius = "6px";
		yTranslatePopupDiv.style.boxShadow = "5px 5px 8px #CCC";
		yTranslatePopupDiv.style.position="fixed";
		yTranslatePopupDiv.style.zIndex = "99999";
		yTranslatePopupDiv.style.padding="20px";
		yTranslatePopupDiv.style.display = "inline";

		document.getElementsByTagName('body') [0].appendChild(yTranslatePopupDiv);
		yTranslatePopupDiv.innerHTML = text;

	}

	function parseJs(resp) {
		var result = JSON.parse(resp);
		if (result.code == 200) {
			var text = result.text;
			createUI(text);
		}
	}

	function sendRequest(selected){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", apiUrl + selected, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				parseJs(xhr.responseText);
			}
		}
		xhr.send();
	}

	function fire(selected){
		chrome.storage.sync.get(["apiKey","from","to"], function(e){
			apiKey = e.apiKey;
			lang = (e.from || "en") + "-" + (e.to || "tr")
			apiUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key='+ apiKey + '&lang='+ lang + '&text=';

			sendRequest(selected)
		});
	}

	document.addEventListener('mouseup', function (event) {
		selected = window.getSelection().toString();
		if (selected.length > 0 && event.altKey) {
			fire(selected);
		}
	});
	document.addEventListener("mousedown", function(event){
		var yTranslatePopupDiv = document.getElementById("yTranslatePopupDiv");
		if (yTranslatePopupDiv !== null){
			yTranslatePopupDiv.style.display = "none";
		}
	});


};
main();