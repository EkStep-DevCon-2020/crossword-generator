import { ConfigService } from './../../services';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-content-review',
  templateUrl: './content-review.component.html',
  styleUrls: ['./content-review.component.scss']
})
export class ContentReviewComponent implements OnInit {

  curationMetaData = [];
  contentId;
  checksFailed = 0;
  checksPassed = 0;
  checksPending = 0;
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

    console.log('datattaat', data);
    // this.curationMetaData = _.find(data, { identifier: this.contentId });
    this.title = _.get(data[0], 'name');
    // this.curationMetaData = this.curationMetaData.metaData;
    this.modifyCurationData(_.get(data[0], 'metaData'));
  }
  checkCurationStatus(curationStatus) {
    _.forEach(curationStatus, curation => {
      if (curation.status === 'Passed') {
        this.checksPassed++;
      } else if (curation.status === 'Pending') {
        this.checksPending++;
      } else if (curation.status === 'Failed') {
        this.checksFailed++;
      }
    });
  }

  modifyCurationData(metaData) {
    console.log('vbfmdbhfgjkhug', metaData);
    const quality = [];
    // const this.curationMetaData = [];
    // let lnAnalysis = [];
    
    const qualityData = _.filter(metaData, (meta) => {
      return meta.type === 'quality';
    })
    const status = _.find(qualityData, { name: 'Profanity' }).status !== 'Passed' ?
      _.find(qualityData, { name: 'Profanity' }).status :
      _.find(qualityData, { name: 'Size' }).status;
    const qualityCuration = {name: 'Content quality', type: 'quality', status, result: qualityData };
    this.curationMetaData.push(qualityCuration);
    _.forEach(metaData, (value, key) => {
      if (_.startsWith(key, 'cml')) {
        const data = (value.status === 'Passed' || value.status === 'Failed') ?
          (value.type === 'quality' ? quality.push(value) : this.curationMetaData.push(value)) : value;
      } else {

        // if (key === 'ckp_lng_analysis') {
        //   lnAnalysis = _.map(value.result, (res, key1) => {
        //     return {[key1]: res};
        //   });
        //   value.result = lnAnalysis;
        //   console.log('lvdlvkld', value.result);
        // }
        const data = (value.type === 'quality') ? (_.isEmpty(_.find(quality, { name: value.name })) ? quality.push(value) : value)
          : this.curationMetaData.push(value);

      }
      console.log(this.curationMetaData)
    });

    console.log('qfvgdfgvfduyg', quality);
    // const status = _.find(quality, { name: 'Profanity' }).status !== 'Passed' ?
    //   _.find(quality, { name: 'Profanity' }).status :
    //   _.find(quality, { name: 'Size' }).status;
    // const qualityCuration = {name: 'Content quality', type: 'quality', status, result: quality };
    // this.curationMetaData.push(qualityCuration);
    console.log('alllal', this.curationMetaData);
    this.checkCurationStatus(this.curationMetaData);
  }

  close() {
    this.location.back();
  }

}
