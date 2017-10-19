
var xmlData = '<div xmlns="http://www.tei-c.org/ns/1.0" type="entry" xml:id="SRO233"> <head rend="left"> <persName role="stationer enterer"> <forename>J</forename> <surname>alde</surname> </persName> /</head> <p>Recevyd of <persName role="stationer enterer"> <forename>John</forename> <surname>Alde</surname> </persName> for his lycense for pryntinge of serten ballettes the fyrste intituled of <title>a hunter</title> / the secounde of <title>Remembraunce of <persName>god</persName>es mercy</title> / the thyrde <title>agaynste Detrection</title> the <num type="matchedNumber" value="4" rend="roman numerals">iiij</num> <hi rend="superscript">or</hi> of <title>the twyntlynge of an e<supplied resp="#arber">y</supplied>e</title> / and the vth <title>lett vs looke shortely for the latter Daye</title> and laste of all of <title> <del>vnthrysstes</del> vnthrestes <note resp="#arber">Arber: i.e. of unthrifts</note> </title> <seg type="fee" subtype="sum" rend="roman-numerals aligned-right"><!--processing: ijs--> <num type="totalPence" value="24"><!--orig: ijs--> <num type="shillingsAsPence" value="24">ij<hi rend="superscript">s</hi> </num> </num> </seg> </p> <note resp="#arber">Arber: A ballad by <persName role="non-stationer"> <surname>Haywood</surname> </persName>, <title>Against Slander and Detraction</title>, was printed by <persName role="stationer"> <forename>John</forename> <surname>Alde</surname> </persName>, without date: and is reprinted by Mr <persName role="non-stationer"> <surname>Huth</surname> </persName> in <title>Ancient Ballads and Broadsides</title>, <hi rend="italics">p</hi>. 12, <date when="1867"> <hi rend="italics">Ed</hi>. 1867</date>. <persName> <forename>W</forename>&gt;<surname>F</surname> </persName>. wrote <title>A new Ballad against Unthrifts</title>, printed by <persName role="stationer"> <surname> <hi rend="bold">Alde</hi> </surname> </persName>, also without date; and likewise reprinted by <persName role="non-stationer">Mr <surname>Huth</surname> </persName> at <hi rend="italics">p</hi>. 226 of the same work.</note> <ab type="metadata"> <idno type="Liber">A</idno> <idno type="SRONumber">233</idno> <date type="SortDate" when="1561-07-22"/> <date type="Register" notBefore="1561-07-22" notAfter="1562-07-24">22 July 1561 - 24 July 1562</date> <num type="totalEntryPence" value="24"/> <idno type="RegisterRef">Register A, f.74v</idno> <idno type="ArberRef">I. 180</idno> <idno type="RegisterID">TSC-1-D-02-01_1554-1596_0177_f74v</idno> <num type="works" value="6"/> <note type="status" subtype="entered"/> <persName role="warden"> <forename>R.</forename> <surname>Tottle</surname> </persName> <persName role="warden"> <forename>W.</forename> <surname>Seres</surname> </persName> <persName role="master"> <forename>J.</forename> <surname>Cawood</surname> </persName> </ab> </div>'

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

//  debugger
  xmlData = xmlData.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/<</g, "<").replace(/>>/g, ">")

  for ( var i = 0; i < xmlData.length; i++ ){

    if ( xmlData[i].trim() === '<'){

      if ( buffer.trim().length > 0 ){
        docArray.push(buffer);
      }
      startDel = i
      buffer = "";
    } else if( xmlData[i].trim() === '>'){
      endDel = i+1;

      innerTagTokens = xmlData.substring(startDel,endDel).match(/\S+/g) || []
      replaced = innerTagTokens[0].replace(/(<\/?)([A-z]*)(>?)/, replacer);

      innerTagTokens[0] = replaced

      var inItGoes = innerTagTokens.join(" ")
      docArray.push(inItGoes);

      // if ( inItGoes.indexOf("SRO233") > -1 ){
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
// console.log(xml2HTMLTranslator(xmlData)+" LALALA")
