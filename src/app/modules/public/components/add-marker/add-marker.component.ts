import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-add-marker',
  templateUrl: './add-marker.component.html',
  styleUrls: ['./add-marker.component.scss']
})
export class AddMarkerComponent implements OnInit {

  markerList: Array<any> = [];
  mcqLayout: boolean;
  questionList: Array<any> = [{id: '1', que: 'How are you?', options: ['Good', 'Nice', 'Not Bad', 'Awesome'], ans: 0},
                              {id: '12', que: 'Who Are You?', options: ['Why?', 'Why You?', 'I Am ...', 'You?'], ans: 2}];
  queSelected: string;
  @Input() videoPlayerInstance: any;
  @Input() playerConfig: any;
  constructor() { }

  ngOnInit() {
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.videoPlayerInstance =
  //   }, 1000);
  // }

  getQueData() {
    this.addMarker({questionData: _.find(this.questionList, (obj) => obj.id === this.queSelected)});
  }

  addMarker(data) {
      // this.videoPlayerInstance.currentTime()
    const markerData = {time: 9.0, ...data};
    this.markerList.push(markerData);
    this.mcqLayout = false;
    this.videoPlayerInstance.markers.add(this.markerList);
    // this.updateContentMeta().subscribe((res) => {
    //   this.videoPlayerInstance.markers.add(this.markerList);
    //   console.log('sucessss');
    //   }, (err) => {
    //    console.log('errorr', err);
    //   });
  }

  updateContentMeta() {
    // const option = {
    //   url: this.configService.urlConFig.URLS.CONTENT.UPDATE + '/' + this.playerConfig.metadata.identifier,
    //   data: {
    //     'request': {
    //       'content': {
    //         versionKey: this.playerConfig.metadata.versionKey,
    //         markerList: this.markerList
    //       }
    //     }
    //   }
    // };
    // return this.actionService.patch(option);
  }

  deleteMarker(index) {
    const backUpMarkerList = this.markerList;
    this.markerList = _.filter(this.markerList, (obj, i) => i !== index);
    this.videoPlayerInstance.markers.add(this.markerList);
    // this.updateContentMeta().subscribe((res) => {
    //   this.videoPlayerInstance.markers.add(this.markerList);
    //   this.toasterService.success('Selected Marker is Removed');
    //   console.log('Removed sucessss');
    //   }, (err) => {
    //    this.markerList = backUpMarkerList;
    //    this.toasterService.error('Failed...Please Try Again');
    //    console.log('errorr', err);
    //   });
  }

  onSelectBehaviour(e) {
    e.stopPropagation();
  }
}
