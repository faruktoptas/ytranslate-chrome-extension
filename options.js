let btnSave = document.getElementById("save");
let apiKeyInput = document.getElementById('api_key');


// Default from/to languages
var fromLang = "en"
var toLang = "tr"

btnSave.addEventListener('click', function(){
  let fromOption = document.getElementById("from")
  let toOption =document.getElementById("to")
  
  let values = {apiKey: apiKeyInput.value}
  
  if (fromOption != null){
    values["from"] = fromOption.value
    values["to"] = toOption.value
  }
  chrome.storage.sync.set(values, function(e){
    if (fromOption == null) fetchLanguages(apiKeyInput.value) // Fetch after setting a valid apiKey
  })
})


chrome.storage.sync.get(["apiKey","from", "to"], function(e){
  apiKeyInput.value = e.apiKey || "";
  console.log(e.from)
  fromLang = e.from || fromLang;
  toLang = e.to || toLang;
  fetchLanguages(e.apiKey);
})

function fetchLanguages(apiKey){
  let uiLang  = navigator.language.substring(0,2)
  let apiUrl = "https://translate.yandex.net/api/v1.5/tr.json/getLangs?ui="+uiLang+"&key="+apiKey
  var xhr = new XMLHttpRequest();
  xhr.open("POST", apiUrl , true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      createOptions(xhr.responseText)
    }
  }
  xhr.send();
}


function createOptions(resp, from, to){
  var result = JSON.parse(resp);
  if (result.langs){
    let from = document.getElementById('fromLanguage');
    from.innerHTML = createSelection("from",result.langs, fromLang);

    let to = document.getElementById('toLanguage');
    to.innerHTML = createSelection("to", result.langs, toLang);
  }
}

function createSelection(id, langs, selected) {
  let html = '<select id="'+id+'">';
  for (var lang in langs){
    html += '<option value="'+lang+'"' + ((selected == lang) ? "selected" :"") +">"+ langs[lang] + '</option>'
  }
  html += "</select>";
  return html;
}