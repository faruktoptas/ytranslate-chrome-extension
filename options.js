let btnSave = document.getElementById("save");
let apiKeyIntput = document.getElementById('api_key');


// Default from/to languages
var fromLang = "en"
var toLang = "tr"

btnSave.addEventListener('click', function(){
  let fromOption = document.getElementById("from")
  let toOption =document.getElementById("to")
  
  console.log(fromOption.value)
  console.log(toOption.value)
  chrome.storage.sync.set({
    apiKey: apiKeyIntput.value, 
    from:fromOption.value,
    to:toOption.value
  }, function() {

  })
})


chrome.storage.sync.get(["apiKey","from", "to"], function(e){
  apiKeyIntput.value = e.apiKey;
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