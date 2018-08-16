import fetchData from '../network/fetch-data';
import XmlReader from 'xml-reader'
import xmlQuery from 'xml-query'

var searchTools = (function() {

  var formatDate = function (date,key){
    var output = ""
    if ( (key == "minDate" || key == "maxDate")  && date ){
      var monthLimit = key == "minDate" ? "1" : "12"
      var dayLimit = key == "minDate" ? "1" : "31"

      if ( date.year ){
        date.month = parseInt(date.month ? date.month : monthLimit)
        date.day = parseInt(date.day ? date.day : dayLimit)

        date.month = date.month < 10 ? "0"+date.month : date.month+""
        date.day = date.day < 10 ? "0"+date.day : date.day+""

        output = date.year+"-"+date.month+"-"+date.day
      }
    }
    return output
  }

  var executeSearch = async function(advSearch, currentPage, pageLimit, sortField, direction, filt){
    // debugger
    let fetch = new fetchData();

    var filters = filt

    if ( typeof(filters) === "string" ){
      filters = filters ? filters.split(",") : []
    }

  //  debugger
    var data = await fetch.getEntriesAdvancedSearch("search",advSearch, currentPage, pageLimit, sortField, direction, filters);
    var ast = XmlReader.parseSync(data);
    var pagesAvailable = xmlQuery(ast).find('paging').find('last').text();

    return {
            allContent : data,
            pagesAvailable : parseInt(pagesAvailable),
            currentPage : parseInt(currentPage),
           }
  }

// Get search options from props.
  var getSOptsFromProps = function (props, prevAdvSearch = {}) {
  //  debugger

    var advSearch = prevAdvSearch

    for( var k in props.location.query ){
      if ( k.indexOf("Date") > 1 ){
          if( typeof(props.location.query[k]) == "string" ){
              var date = {}
              var dateElements = props.location.query[k].split("-")
              date.year = dateElements[0]
              date.month = dateElements[1]
              date.day = dateElements[2]
              advSearch[k] = date
          }
      } else {
        advSearch[k] = props.location.query[k]
      }
    }


    //Overrides for filters and query
    var filters = props.location.query.filters ? props.location.query.filters.split(",") : []
    var query = props.location.query && props.location.query.query ? props.location.query.query : ""
        advSearch.query = query
        advSearch.filters = filters

        //advSearch.enabled = props.location.query && props.location.query.adv ? props.location.query.adv == "true" : false


    // Date to date-components bit.
    // for( var k in advSearch ){
    //   if ( k.indexOf("Date") > 1 ){
    //       if( typeof(advSearch[k]) == "string" ){
    //           var date = {}
    //           var dateElements = advSearch[k].split("-")
    //           date.year = dateElements[0]
    //           date.month = dateElements[1]
    //           date.day = dateElements[2]
    //           advSearch[k] = date
    //       }
    //   }
    // }



    console.log(JSON.stringify(advSearch))
    //debugger
    return advSearch
  }

  var formatUrlAndGoto = function (advSearch, props, dest, fromSearchBox){
    var newUrlQuery = {}
    // var newUrlQuery = fromSearchBox ? advSearch props.location.query
    // debugger
    for (var k in advSearch){
      if ( advSearch[k] ){
        switch (k) {
          case "enabled":
            continue
            break
          case "filters":
           if ( advSearch[k].length > 0 ){
              newUrlQuery[k] = advSearch[k].toString()
           }
           break
          case "minDate":
          case "maxDate":
            newUrlQuery[k] = formatDate(advSearch[k],k)
            break
          default:
            newUrlQuery[k] = advSearch[k]
        }
      }
    }

    for (var k in newUrlQuery){
      if (newUrlQuery[k].length <= 0){
        delete newUrlQuery[k]
      }
    }

    var parameters = []
    for (var k in newUrlQuery ){
      parameters.push(k+"="+newUrlQuery[k])
    }

    // dest = Object.keys(props.params).length > 0 ? props.location.pathname : "/"+dest

    var properURL = dest + (parameters.length > 0 ? "?"+parameters.join("&") : "")
    console.log("searchToolsURL="+properURL)

    return properURL

  }

  return {
    getSOptsFromProps: getSOptsFromProps,
    formatUrlAndGoto: formatUrlAndGoto,
    executeSearch: executeSearch
    // getQuery: getQuery
  }

})();

export default searchTools;
