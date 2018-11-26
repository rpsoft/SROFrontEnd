
// var xmlData = '';

var tagNames = ["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","data","datalist","dd","details","dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h6","header","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noframes","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strike","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]

function replacer(match, p1, p2, p3, offset, string) {
  // p1 is nondigits, p2 digits, and p3 non-alphanumerics
//  debugger
  if ( !p2 ){
    return match
  }

  if ( tagNames.includes(p2.trim())){
    return match
  }

  if( p1.indexOf("</") < 0 ){
      return p1+'span class="'+p2+'"'+p3;
  } else {
      return p1+'span'+p3;
  }
}


export default function xml2HTMLTranslator(xmlData){

  // console.log(xmlData)
  var startDel = -1;
  var endDel = -1;
  var buffer = "";

  var docArray = [];

  var innerTagTokens,replaced;

//  debugger
  xmlData = xmlData.replace(/<</g, "<").replace(/>>/g, ">")
//.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  for ( var i = 0; i < xmlData.length; i++ ){

    if ( xmlData[i].trim() === '<'){

      if ( buffer.trim().length > 0 ){
        docArray.push(buffer);
      }
      startDel = i
      buffer = "";
    } else if( xmlData[i].trim() === '>'){
      endDel = i+1;

      //console.log(xmlData[i].trim())
      innerTagTokens = xmlData.substring(startDel,endDel).match(/\S+/g) || []
      replaced = innerTagTokens[0].replace(/(<\/?)([A-z]*)(>?)/, replacer);

      innerTagTokens[0] = replaced

      var inItGoes = innerTagTokens.join(" ")
      docArray.push(inItGoes);

      // if ( inItGoes.indexOf("ntred vnto him to") > -1 ){
      //   debugger
      // }

      startDel = -1;
      endDel = -1;

    } else if (startDel < 0 && endDel < 0){
      buffer += xmlData[i];
    }


  }
  //debugger
  return docArray.join(" ");
}
//
//console.log(xml2HTMLTranslator(xmlData)+" LALALA")
