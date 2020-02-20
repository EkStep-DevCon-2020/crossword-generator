import { HttpOptions } from './httpOptions';
import { of as observableOf, throwError as observableThrowError, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  baseUrl = 'https://devcon.sunbirded.org/api/';
  http: HttpClient;
  httpOptions = {};
  constructor(http: HttpClient) {
    this.http = http;
  }

  private getHeader(headers?: any) {
    // tslint:disable-next-line:variable-name
    const default_headers = {
      // tslint:disable-next-line:max-line-length
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyZWU4YTgxNDNiZWE0NDU4YjQxMjcyNTU5ZDBhNTczMiJ9.7m4mIUaiPwh_o9cvJuyZuGrOdkfh0Nm0E_25Cl21kxE'
    };
    return { ...default_headers, ...headers };
  }

  post(requestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ?  this.getHeader(requestParam.header) : this.getHeader(),
      params: requestParam.param
    };
    return this.http.post(this.baseUrl + requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: any) => {
        // if (data.responseCode !== 'OK') {
        //   return observableThrowError(data);
        // }
        return observableOf(data);
      }));
  }

  get(requestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ?  this.getHeader(requestParam.header) : this.getHeader(),
      params: requestParam.param
    };
    return this.http.get(this.baseUrl + requestParam.url, httpOptions).pipe(
      mergeMap((data: any) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
  }

  put(requestParam): Observable<any> {
    return this.http.put(requestParam.url, requestParam.file, requestParam.config).pipe(
      mergeMap((data: any) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
  }

  searchContents(identifier?): Observable<any> {
    const requestParam = {
      url: 'composite/v1/search',
      data: {
        request : {
          filters: {
            objectType: 'Content',
            status: ['Review', 'Draft', 'Live'],
          },
          exists: ['cml_tags', 'cml_profanity', 'cml_audio',
          'ckp_profanity', 'ckp_audio', 'ckp_image', 'ckp_keywords', 'ckp_lng_analysis', 'ckp_translation'],
          fields: ['identifier', 'name', 'description', 'status',
          'contentType', 'createdBy', 'appIcon', 'cml_tags', 'cml_profanity',
          'cml_audio', 'ckp_size', 'ckp_profanity', 'ckp_audio', 'ckp_image', 'ckp_keywords', 'ckp_lng_analysis', 'ckp_translation'],
          sort_by: {createdOn: 'desc'},
          limit: 100
        }
      }
    };
    if (identifier) {   requestParam.data.request.filters['identifier'] = identifier; }
    return this.post(requestParam);
  }

  getCurationData(contents) {
      const metaData = [];
      _.forEach(contents, content => {
        const data = _.pick(content, 'cml_tags', 'cml_profanity', 'cml_audio',
        'ckp_size', 'ckp_profanity', 'ckp_audio', 'ckp_image', 'ckp_keywords', 'ckp_lng_analysis', 'ckp_translation');
        metaData.push({identifier: content.identifier, metaData: data, name: content.name});
      });
      return metaData;
    }
}
