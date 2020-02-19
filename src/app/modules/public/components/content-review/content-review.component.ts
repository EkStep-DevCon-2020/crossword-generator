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

  curationMetaData;
  contentId;
  checksFailed = 0;
  checksPassed = 0;
  checksPending = 0;
  showResult = true;
  title ;

  constructor(public config: ConfigService, public activatedRoute: ActivatedRoute, public location: Location) { }

  ngOnInit() {

    this.contentId = _.get(this.activatedRoute, 'snapshot.params.contentId');
    this.config.searchContents().pipe().subscribe(data => {
      const contents = _.get(data, 'result.content');
      this.getMetaData(contents);
    });

  }
  getMetaData(contents) {
    const data = this.config.getCurationData(contents);
    let content = _.find(data, { identifier: this.contentId });
    this.title = _.get(content, 'name');
    content = content.metaData;
    this.checkCurationStatus(content);
    this.modifyData(content);
  }
  modifyData(contents) {
    const modifiedData = {};
    _.forEach(contents, (content, key) => {
      if (_.isString(content)) {
        content = JSON.parse(content);
        modifiedData[key] = content;
      } else {
        modifiedData[key] = content;
      }
    });
    this.curationMetaData = modifiedData;
  }
  checkCurationStatus(curationStatus) {
    _.forEach(curationStatus, curation => {
      console.log('cuucu', curation);
      if (curation.status === 'Passed') {
        this.checksPassed++;
      } else if (curation.status === 'Pending') {
        this.checksPending++;
      } else if (curation.status === 'Failed') {
        this.checksFailed++;
      }
    });
  }

  close() {
    this.location.back();
  }
}
