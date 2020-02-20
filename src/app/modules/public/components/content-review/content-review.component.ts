import { ConfigService } from './../../services';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { element } from 'protractor';

@Component({
  selector: 'app-content-review',
  templateUrl: './content-review.component.html',
  styleUrls: ['./content-review.component.scss']
})
export class ContentReviewComponent implements OnInit {

  curationMetaData = [];
  contentId;
  checks = {failed: {count: 0 , type: []}, passed: {count: 0, type: []}, pending: {count: 0, type: [] }};
  showResult = true;
  showLanguage = true;
  title;
  constructor(public config: ConfigService, public activatedRoute: ActivatedRoute, public location: Location) { }

  ngOnInit() {

    this.contentId = _.get(this.activatedRoute, 'snapshot.params.contentId');
    this.config.searchContents(this.contentId).pipe().subscribe(data => {
      const contents = _.get(data, 'result.content');
      this.getMetaData(contents);
    });

  }

  getMetaData(contents) {
    const data = this.config.getCurationData(contents);
    this.title = _.get(data[0], 'name');
    this.modifyCurationData(_.get(data[0], 'metaData'));
  }
  checkCurationStatus(curationStatus) {
    const metaData = _.find(curationStatus, {type: 'quality'});
    _.forEach(metaData.result, curation => {
      if (curation.status === 'Passed') {
          this.checks.passed.count++;
          this.checks.passed.type.push(curation.type);
        } else if (curation.status === 'Pending') {
          this.checks.pending.count++;
          this.checks.pending.type.push(curation.type);
        } else if (curation.status === 'Failed') {
          this.checks.failed.count++;
          this.checks.failed.type.push(curation.type);
        }
    });

  }

  modifyCurationData(metaData) {

    const quality = [];
    const qualityData = [];
    _.filter(metaData, (meta, key) => {
      if (meta.type === 'quality') {
        qualityData.push({[key]: meta});
      }
    });


    _.forEach(metaData, (value, key) => {
      if (_.startsWith(key, 'cml')) {
        const str  = key.slice(4);
        const qData = _.find(qualityData, `ckp_${str}`);
        if (qData) {
          const objData = Object.values(qData)[0];
          const data1 = value.type === 'quality' ?
          ((value.status === 'Passed' || value.status === 'Failed') ?
          quality.push(value) : quality.push(objData)) : this.curationMetaData.push(value);
        } else {
          this.curationMetaData.push(value);
        }
      } else {
        const data = (value.type === 'quality') ? (_.isEmpty(_.find(quality, { name: value.name })) ? quality.push(value) : value)
          : this.curationMetaData.push(value);
      }
    });
    let status = _.find(quality, {status: 'Failed'});
    if (status !== 'Failed') {
      _.map(quality, sta => {
        if (sta.status !== 'Passed') {
          status = sta.status;
        } else {
          status = sta.status;
        }
      });
    }

    const qualityCuration = {name: 'Content quality', type: 'quality', status, result: quality };
    this.curationMetaData.unshift(qualityCuration);
    this.checkCurationStatus(this.curationMetaData);
  }

  close() {
    this.location.back();
  }


}
