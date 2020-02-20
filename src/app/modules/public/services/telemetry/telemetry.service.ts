import { Injectable } from '@angular/core';
import * as Md5 from 'md5';
import { HttpClient } from '@angular/common/http';
import { UUID } from 'angular2-uuid';
@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  public stallId;
  public ideaId;
  public did;
  public profileId;
  http: HttpClient;
  baseUrl = 'https://devcon.sunbirded.org/';
  constructor(http: HttpClient) {
    this.http = http;
  }
  public initialize(config) {
    this.did = config.did;
    this.stallId = config.stallId;
    this.ideaId = config.ideaId;
  }
  public visit(data) {
    const visitTelemetry = {
      eid : 'DC_VISIT',
      ets: (new Date()).getTime(),
      did: this.did,
      profileId: data.profileId,
      stallId: this.stallId,
      ideaId: this.ideaId,
      mid: '',
      edata: {}
    };
    visitTelemetry.mid = visitTelemetry.eid + ':' + Md5(JSON.stringify(visitTelemetry));
    const request = {
      url: `${this.baseUrl}content/data/v1/telemetry`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        id: 'api.sunbird.telemetry',
        ver: '3.0',
        params: {
          msgid: UUID.UUID()
        },
        ets: (new Date()).getTime(),
        events: [visitTelemetry]
      }
    };
    this.http.post(request.url, request.body, { headers: request.headers } ).pipe().subscribe((res) => {
      console.log('response ', res);
    });
  }
  public engagement(data) {
    const engagementTelemetry = {
      eid : 'DC_ENGAGEMENT',
      ets: (new Date()).getTime(),
      did: this.did,
      profileId: this.profileId,
      stallId: this.stallId,
      ideaId: this.ideaId,
      contentId: data.contentId,
      contentType: data.contentType,
      contentName: data.contentName,
      mid: '',
      edata: {
        duration: 100
      }
    };
    engagementTelemetry.mid = engagementTelemetry.eid + ':' + Md5(JSON.stringify(engagementTelemetry));
    const request = {
      url: `${this.baseUrl}content/data/v1/telemetry`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        id: 'api.sunbird.telemetry',
        ver: '3.0',
        params: {
          msgid: UUID.UUID()
        },
        ets: (new Date()).getTime(),
        events: [engagementTelemetry]
      }
    };
    this.http.post(request.url, request.body, { headers: request.headers } ).pipe().subscribe((res) => {
      console.log('response ', res);
    });
  }
}
