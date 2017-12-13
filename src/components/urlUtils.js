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

      if ( args[keys[a]] && args[keys[a]] != undefined && args[keys[a]].length > 0) {
        preparedQuery = preparedQuery+ "&"+keys[a]+"="+args[keys[a]]
      } else if ( (keys[a] == "maxDate" || keys[a] == "minDate") && args[keys[a]].year ) {
        preparedQuery = preparedQuery+ "&"+keys[a]+"="+args[keys[a]].year+"-"+args[keys[a]].month+"-"+args[keys[a]].day
      }

    }
    preparedQuery = preparedQuery.replace("&","")
    return preparedQuery
  }


  var prepareURLVariables = function(adVar)  {
    var getUrlPart = objectToGetVariables(adVar);
    // var adv = this.props.location.query.adv
     //debugger
    return getUrlPart ? "?"+getUrlPart : ""
  }

  var formatUrl = function(linkRoot,page,entriesPerPage,sorting,params) {
  //  console.log(entriesPerPage)
    var url = "/"+linkRoot
              +"/"+page
              +"/"+(entriesPerPage ? entriesPerPage : 10)
              + (sorting ? "/"+(sorting.sortField ? sorting.sortField : "date")
              +"/"+(sorting.direction ? sorting.direction : "ascending") : "")
              +prepareURLVariables(params)
  //  debugger
    return url;
  };

  // Functions to expose
  return {
    formatUrl: formatUrl,
    // getQuery: getQuery
  }

})();

export default urlUtils;
