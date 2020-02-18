import { ConfigService } from './../../services';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  curationData = ['cml_tags', 'cml_keywords', 'cml_quality', 'ckp_translation', 'ckp_size'];
  metaData = [];
  contents = [];

  showContentQuality = false;
  constructor(public config: ConfigService, public router: Router) { }

  ngOnInit() {
    this.config.searchContents().subscribe(data => {
      this.contents = _.get(data, 'result.content');
    });
  }

  viewContentQualityStatus(content) {
    this.router.navigate(['/content/review/', content.identifier]);
  }
}
