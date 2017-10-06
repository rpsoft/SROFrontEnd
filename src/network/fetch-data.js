import HttpClient from './http-client';
import { URL_BASE } from '../links'


const urlBase = URL_BASE + 'api/'

export default class fetchData {
  constructor() {
    this.httpClient = new HttpClient()
  }

  async getGeneric(path) {
    let result
    try {
      result = await this.httpClient.send('', { path })
    } catch(error) {
      console.error('fetching template list error > ' + error)
    }

    return result
  }

  async getAllEntries() {
    return await this.getGeneric( urlBase + 'allEntries' )
  }

  async getStaticPage(page) {
    return await this.getGeneric( urlBase + 'staticPage?page='+page )
  }

  async getAllEntriesPaged(page,limit,sortField,direction) {
    return await this.getGeneric( urlBase + 'allEntriesPaged?page='+page
                                          +"&limit="+limit
                                          + ( sortField ? "&sortField="+sortField : "" )
                                          + ( direction ? "&direction="+direction : "" ) )
  }

  // async getEntriesForQuery(query,page,limit) {
  //   return await this.getGeneric( urlBase + "data?query="+query+"&page="+page+"&limit="+limit  )
  // }

  objectToGetVariables(args){
    if ( !args){
      return ""
    }
    var keys = Object.keys(args);
    var preparedQuery = ""
    for (var a in keys ){
      if ( keys[a] == "enabled" ){
        continue;
      }
      if ( keys[a] == "filters" ){
        continue;
      }

      if ( keys[a] == "minDate" && args[keys[a]] ){
        if ( args[keys[a]].year && args[keys[a]].month && args[keys[a]].day)
        preparedQuery = preparedQuery+ "&"+keys[a]+"="+args[keys[a]].year+"-"+args[keys[a]].month+"-"+args[keys[a]].day
        continue;
      }

      if ( keys[a] == "maxDate" && args[keys[a]] ){
        if ( args[keys[a]].year && args[keys[a]].month && args[keys[a]].day)
        preparedQuery = preparedQuery+ "&"+keys[a]+"="+args[keys[a]].year+"-"+args[keys[a]].month+"-"+args[keys[a]].day
        continue;
      }


      if ( args[keys[a]] && args[keys[a]] != undefined)
      preparedQuery = preparedQuery+ "&"+keys[a]+"="+args[keys[a]]
    }
    preparedQuery = preparedQuery.replace("&","")
    return preparedQuery
  }

  // Need to change this to post function, with JSON data inside. Get rid of the long address... just advSearch as identifying bit, .... or not...

  async getEntriesAdvancedSearch(args,page,limit,sortField,direction,filters) {

    var preparedQuery = this.objectToGetVariables(args)
    console.log(preparedQuery)
      preparedQuery = urlBase + "advSearch?"+preparedQuery
                                            +"&page="+page
                                            +"&limit="+limit
                                            + ( sortField ? "&sortField="+sortField : "" )
                                            + ( direction ? "&direction="+direction : "" )
                                            + ((filters && filters.length > 0 ) ? "&filters="+JSON.stringify(filters) : "")
    // console.log(preparedQuery)

    return await this.getGeneric( preparedQuery  )
  }

  async getEntriesForQueryWithSorting(query,page,limit,sortField,direction) {
    return await this.getGeneric( urlBase + "data?query="+query+"&page="+page+"&limit="+limit+"&sortField="+sortField+"&direction="+direction  )
  }

  async getEntry(entryID) {
    return await this.getGeneric( urlBase + 'entry?entryID=' + entryID )
  }

}
