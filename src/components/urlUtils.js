var urlUtils = (function() {
  var query = "";

  var objectToGetVariables = function(args){
    if ( !args){
      return ""
    }
    var keys = Object.keys(args);
    var preparedQuery = ""
    for (var a in keys ){
      if ( keys[a] == "enabled" ){
        continue;
      }
      // if ( keys[a] == "filters" ){
      //   continue;
      // }

      if ( args[keys[a]] && args[keys[a]] != undefined && args[keys[a]].length > 0)
      preparedQuery = preparedQuery+ "&"+keys[a]+"="+args[keys[a]]
    }
    preparedQuery = preparedQuery.replace("&","")
    return preparedQuery
  }


  var prepareURLVariables = function(adVar)  {
    var getUrlPart = objectToGetVariables(adVar);
    return getUrlPart ? "?"+getUrlPart : ""
  }

  var formatUrl = function(linkRoot,page,entriesPerPage,sorting,params) {

    var url = "/"+linkRoot
              +"/"+page
              +"/"+(entriesPerPage ? entriesPerPage : 10)
              + (sorting ? "/"+(sorting.sortField ? sorting.sortField : "date")+"/"+(sorting.direction ? sorting.direction : "ascending") : "")+prepareURLVariables(params)
    return url;
  };

  // Functions to expose
  return {
    formatUrl: formatUrl,
    // getQuery: getQuery
  }

})();

export default urlUtils;
