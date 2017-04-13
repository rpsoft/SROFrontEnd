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
      //console.log(result);
      // result = JSON.parse(result)
    } catch(error) {
      console.error('fetching template list error > ' + error)
    }

    return result
  }

  async getAllEntries() {
    return await this.getGeneric( urlBase + 'allEntries' )
  }

  async getAllEntriesPaged(page,limit) {
    return await this.getGeneric( urlBase + 'allEntriesPaged?page='+page+"&limit="+limit )
  }

  async getEntriesForQuery(query) {
    return await this.getGeneric( urlBase + 'data'+"?query="+query )
  }

  async getRecordsByType(type) {
    return await this.getGeneric( urlBase + 'getRecordsByType/' + type )
  }

  async templateListGet() {
    return await this.getGeneric( urlBase + 'templates/list' )
  }
  //
  // async createRecord(data) {
  //   let newRecordId
  //   let body = JSON.stringify(data)
  //   try {
  //     newRecordId = await this.httpClient.send(
  //       body,
  //       {
  //         method: 'PUT',
  //         path: urlBase + 'record/create',
  //         headers: {'content-type': 'application/json'},
  //       })
  //     newRecordId = JSON.parse(newRecordId)
  //   } catch(error) {
  //     console.error('fetching template list error > ' + error)
  //   }
  //
  //   return newRecordId
  // }

  // async getRecordData(recordId) {
  //   return await this.getGeneric( urlBase + 'getRecord/' + recordId )
  // }

  // async setRecordData(recordId, data) {
  //   let result
  //   let body = JSON.stringify(data)
  //   try {
  //     result = await this.httpClient.send(
  //       body,
  //       {
  //         method: 'POST',
  //         path: urlBase + 'setRecord/' + recordId,
  //         headers: {'content-type': 'application/json'},
  //       })
  //     result = JSON.parse(result)
  //   } catch(error) {
  //     console.error('fetching template list error > ' + error)
  //   }
  //
  //   return result
  // }
  //
  // async deleteRecord(recordId) {
  //   let result
  //   try {
  //     result = await this.httpClient.send(
  //       'Delete Record',
  //       {
  //         method: 'POST',
  //         path: urlBase + 'deleteRecord/' + recordId,
  //       })
  //     result = JSON.parse(result)
  //   } catch(error) {
  //     console.error('fetching template list error > ' + error)
  //   }
  //
  //   return result
  // }

}
