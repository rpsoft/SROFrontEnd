
var xmlData = '<div xmlns="http://www.tei-c.org/ns/1.0" type="entry" xml:id="SRO3839"> <head rend="left"> <persName role="stationer enterer">Master <surname>Dawson</surname> warden</persName> <note type="editorial"> <date when="1596-04-05">5<hi rend="superscript">to</hi> <hi rend="italics">aprilis</hi> 1596.</date> Striken out by aucthoritie of a Court holden this Day <title> <hi rend="italics">The art of navigacon</hi> </title> is <persName role="stationer">master <surname> <hi rend="bold">watkin</hi> </surname> </persName>s copie The rest that no partie hath right to, to be printed by <persName role="stationer">master <surname>Dawson</surname> </persName> to th<supplied resp="#arber">e</supplied>use of the company that will Lay on <supplied resp="#arber">paper</supplied>. &amp;c and to pay vjd in the li to th<supplied resp="#arber">e</supplied>use of the poore./</note> </head> <p rend="struck-through">Entred vnto him to print for <persName role="stationer"> <forename>hughe</forename> <surname>Astley</surname> </persName> these bookes folowinge</p> <p rend="centred"> <title>viz</title> </p> <p> <hi rend="bold">j</hi>. <title>The art of navigacon by <persName role="non-stationer"> <forename>martin</forename> <surname>Curtis</surname> <note resp="#arber">Arber: <hi rend="italics">i.e</hi>. <hi rend="smallcaps">Cortes</hi> </note> </persName> </title> <seg type="fee" rend="roman-numerals aligned-right"><!--processing: vjd--> <num type="totalPence" value="6"><!--orig: vjd--> <num type="pence" value="6">vj<hi rend="superscript">d</hi> </num> </num> </seg> </p> <p> <hi rend="bold">2</hi> <title>The safegard of Saylers</title> <seg type="fee" rend="roman-numerals aligned-right"><!--processing: vjd--> <num type="totalPence" value="6"><!--orig: vjd--> <num type="pence" value="6">vj<hi rend="superscript">d</hi> </num> </num> </seg> </p> <p> <hi rend="bold">3</hi> <title>The new Attractiue</title> <seg type="fee" rend="roman-numerals aligned-right"><!--processing: vjd--> <num type="totalPence" value="6"><!--orig: vjd--> <num type="pence" value="6">vj<hi rend="superscript">d</hi> </num> </num> </seg> </p> <p> <hi rend="bold">4</hi> <title>The patheway to saluation</title> <seg type="fee" rend="roman-numerals aligned-right"><!--processing: vjd--> <num type="totalPence" value="6"><!--orig: vjd--> <num type="pence" value="6">vj<hi rend="superscript">d</hi> </num> </num> </seg> </p> <p> <hi rend="bold">5</hi> <title>The godly exhortation to England</title> <seg type="fee" rend="roman-numerals aligned-right"><!--processing: vjd--> <num type="totalPence" value="6"><!--orig: vjd--> <num type="pence" value="6">vj<hi rend="superscript">d</hi> </num> </num> </seg> </p> <p rend="aligned-right">quer. 3. novembris 1600 42 <title>Regin<supplied resp="#arber">a</supplied>e</title> to <persName role="stationer"> <forename>Hughe</forename> <surname>Astley</surname> </persName> <note resp="#arber">Arber: See <title>fol</title>. 66.</note> </p> <p> <hi rend="italics">Item</hi> yt is ordered that if <persName role="stationer enterer">master <surname>Dawson</surname> </persName> Decease Then the said <del>C</del> <persName role="stationer"> <forename> <hi rend="bold">hughe</hi> </forename> <supplied resp="#EW"> <surname>Astely&gt;</surname> </supplied> </persName> shall haue his Choyse of any printer free of this Company to printe the said Copies for him</p> <ab type="metadata"> <idno type="Liber">C</idno> <idno type="SRONumber">3839</idno> <date type="SortDate" when="1596-03-01"/> <date type="Register" when="1596-03-01">1 March 1596</date> <num type="totalEntryPence" value="30"/> <idno type="RegisterRef">Register C, f.8v</idno> <idno type="ArberRef">III. 60</idno> <idno type="RegisterID">TSC-1-E-06-02_1595-1631_0067_f8v</idno> <num type="works" value="5"/> <note type="status" subtype="cancelled"/> <note type="status" subtype="annotated"/> <note type="status" subtype="other"/> <persName role="warden"> <forename>I.</forename> <surname>Binge</surname> </persName> <persName role="warden"> <forename>T.</forename> <surname>Dawson</surname> </persName> <persName role="master"> <forename>F.</forename> <surname>Coldock</surname> </persName> </ab> </div>'

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
  return docArray.join("");
}
//
//console.log(xml2HTMLTranslator(xmlData)+" LALALA")
