import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as _ from 'lodash-es';
import { ConfigService } from '../../services';

@Component({
  selector: 'app-add-marker',
  templateUrl: './add-marker.component.html',
  styleUrls: ['./add-marker.component.scss']
})
export class AddMarkerComponent implements OnInit, AfterViewInit {

  markerList: Array<any> = [];
  mcqLayout: boolean;
  questionList: Array<any> = [{id: '1', que: 'How are you?', options: ['Good', 'Nice', 'Not Bad', 'Awesome'], ans: 0},
                              {id: '12', que: 'Who Are You?', options: ['Why?', 'Why You?', 'I Am ...', 'You?'], ans: 2}];
  queSelected: string;
  @Input() videoPlayerInstance: any;
  @Input() playerConfig: any;
  constructor(public configService: ConfigService) { }

  ngOnInit() {
    const option = {
      url: '/content/v1/read/' + this.playerConfig.identifier,
    };
    this.configService.get(option).subscribe((res) => {
      if (res.result.content.markerList) {
      this.markerList = JSON.parse(res.result.content.markerList);
      }
      console.log(this.markerList);
    });

  }

  ngAfterViewInit() {
    setTimeout(() => {
      // tslint:disable-next-line:no-unused-expression
      Boolean(this.markerList.length) ? this.videoPlayerInstance.markers.add(this.markerList) : null ;
    }, 1000);
  }

  getQueData() {
    this.addMarker({questionData: _.find(this.questionList, (obj) => obj.id === this.queSelected)});
  }

  addMarker(data) {
    const markerData = {time: Math.floor(this.videoPlayerInstance.currentTime()), ...data};
    this.markerList.push(markerData);
    this.mcqLayout = false;
    this.updateContentMeta().subscribe((res) => {
      this.videoPlayerInstance.markers.add(this.markerList);
      console.log('sucessss');
      }, (err) => {
       console.log('errorr', err);
      });
  }

  updateContentMeta() {
    const option = {
      url: 'https://devcon.sunbirded.org/api/private/content/v3/update/' + this.playerConfig.identifier,
      data: {
        request: {
          content: {
            versionKey: this.playerConfig.versionKey,
            markerList: this.markerList
          }
        }
      }
    };
    return this.configService.patch(option);
  }

  deleteMarker(index) {
    const backUpMarkerList = this.markerList;
    this.markerList = _.filter(this.markerList, (obj, i) => i !== index);
    // this.videoPlayerInstance.markers.add(this.markerList);
    this.updateContentMeta().subscribe((res) => {
      this.videoPlayerInstance.markers.add(this.markerList);
      console.log('Removed sucessss');
      }, (err) => {
       this.markerList = backUpMarkerList;
       console.log('errorr', err);
      });
  }

  onSelectBehaviour(e) {
    e.stopPropagation();
  }
}
