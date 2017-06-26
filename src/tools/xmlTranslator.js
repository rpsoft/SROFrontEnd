
var xmlData = '<doc> <div type="entry" xml:id="SRO459"> <head rend="left"> <persName role="stationer">master <surname>Wally</surname> </persName> </head> <p>Recevyd of <persName role="stationer">master <surname>Wally</surname> </persName> for his lycense for pryntinge of <title>an almanacke and a pronostication</title> of master <persName role="non-stationer"> <surname>Buckmaster</surname> </persName> <seg type="fee" rend="roman-numerals aligned-right"> <!-- processing: viijd --> <num type="totalPence" value="8"> <!-- orig: viijd --> <num type="pence" value="8">viij <hi rend="superscript">d</hi> </num> </num> </seg> </p> <ab type="metadata"> <date notBefore="1565-07-22" notAfter="1566-07-22">22 July 1565–22 July 1566.</date> <idno type="RegisterRef">Register A, f.134r</idno> <idno type="ArberRef">I. 299</idno> <idno type="RegisterID">?</idno> <num type="works" value="0"/> <note type="status" subtype="unknown"/> </ab> </div> </doc> <sum> <p> <span class="previous"/> <span class="hi">master</span> <span class="following"> WallyRecevyd of master Wall...</span> </p> <p> <span class="previous">... WallyRecevyd of </span> <span class="hi">master</span> <span class="following"> Wally fo...</span> </p> <p> <span class="previous">...tication of </span> <span class="hi">master</span> <span class="following"> Buckmasterviijd22 July 1565–22 July ...</span> </p> </sum>'

var tagNames = ["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","big","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","data","datalist","dd","details","dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h6","header","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meta","meter","nav","noframes","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strike","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]

function replacer(match, p1, p2, p3, offset, string) {
  // p1 is nondigits, p2 digits, and p3 non-alphanumerics

  if ( !p2 ){
    return match
  }

  if ( tagNames.includes(p2.trim())){
    return match
  }

  return p1+'span class="'+p2+'"'+p3;
}


export default function xml2HTMLTranslator(xmlData){

  var startDel = -1;
  var endDel = -1;
  var buffer = "";

  var docArray = [];

  var innerTagTokens,replaced;

  xmlData = xmlData.replace(/&lt;/g, "<").replace(/&gt;/g, ">")

  for ( var i = 0; i < xmlData.length; i++ ){

    if ( xmlData[i] === '<'){
      //console.log(buffer);
      docArray.push(buffer);

      startDel = i
      buffer = "";
    } else if( xmlData[i] === '>'){
      endDel = i+1;

      innerTagTokens = xmlData.substring(startDel,endDel).match(/\S+/g) || []
      replaced = innerTagTokens[0].replace(/(<\/?)([A-z]*)(>?)/, replacer);

      innerTagTokens[0] = replaced
      docArray.push(innerTagTokens.join(" "));

      startDel = -1;
      endDel = -1;

    } else if (startDel < 0 && endDel < 0){
      buffer += xmlData[i];
    }


  }
  return docArray.join(" ");
}

//console.log(xml2HTMLTranslator(xmlData)+" LALALA")
