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

  var executeSearch = async function(advSearch, currentPage, pageLimit, sortField, direction, filters){
    // debugger
    let fetch = new fetchData();
    var data = await fetch.getEntriesAdvancedSearch(advSearch, currentPage, pageLimit, sortField, direction, filters);
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

    var filters = props.location.query.filters ? props.location.query.filters.split(",") : []
    var query = props.location.query && props.location.query.query ? props.location.query.query : ""

    var advSearch = prevAdvSearch
        advSearch.query = query
        //advSearch.enabled = props.location.query && props.location.query.adv ? props.location.query.adv == "true" : false


    // Date to date-components bit.
    for( var k in advSearch ){
      if ( k.indexOf("Date") > 1 ){
          if( typeof(advSearch[k]) == "string" ){
              var date = {}
              var dateElements = advSearch[k].split("-")
              date.year = dateElements[0]
              date.month = dateElements[1]
              date.day = dateElements[2]
              advSearch[k] = date
          }
      }
    }

    console.log(JSON.stringify(advSearch))

    return advSearch
  }

  var formatUrlAndGoto = function (advSearch, props){
    var newUrlQuery = props.location.query

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

    var properURL = props.location.pathname + (parameters.length > 0 ? "?"+parameters.join("&") : "")

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
