import { Component, OnInit, AfterViewInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { ConfigService, TelemetryService } from '../../services';
import { questionData } from './questionData.data';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-add-marker',
  templateUrl: './add-marker.component.html',
  styleUrls: ['./add-marker.component.scss']
})
export class AddMarkerComponent implements OnInit, AfterViewInit, OnChanges {

  questionsSelectedd;
  markerList: Array<any> = [];
  mcqLayout: boolean;
  questionList: Array<any> = [];
                              // {id: '1', que: 'How are you?', options: ['Good', 'Nice', 'Not Bad', 'Awesome'], ans: 0},
                              // {id: '12', que: 'Who Are You?', options: ['Why?', 'Why You?', 'I Am ...', 'You?'], ans: 2}
  queSelected: string;
  showMessageModal: boolean;
  @Input() videoPlayerInstance: any;
  @Input() playerConfig: any;
  @Output() refreshEvent = new EventEmitter<any>();
  selectedQuestions: Array<any> = [];
  constructor(public configService: ConfigService, public telemetryService: TelemetryService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.playerConfig) {
    this.questionList = _.get(questionData, this.playerConfig.name);
    const option = {
      url: 'content/v1/read/' + (this.playerConfig ? this.playerConfig.identifier : ''),
    };
    this.configService.get(option).subscribe((res) => {
      if (res.result.content.markerList) {
      this.markerList = JSON.parse(res.result.content.markerList);
      }
      console.log(this.markerList);
    });
  }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // tslint:disable-next-line:no-unused-expression
      Boolean(this.markerList.length) ? this.videoPlayerInstance.markers.add(this.markerList) : null ;
    }, 1000);
  }

  // getQueData() {
  //   this.addMarker({questionData: this.selectedQuestions});
  // }

  addMarker() {
    const markerData = {time: Math.floor(this.videoPlayerInstance.currentTime()), questionData: this.selectedQuestions};
    this.markerList.push(markerData);
    this.mcqLayout = false;
    this.updateContentMeta().subscribe((res) => {
      this.telemetryService.engagement({
        contentId: this.playerConfig.identifier,
        contentType: 'interactive_video',
        contentName: 'interactive_video',
        profileId: this.telemetryService.profileId
      });
      this.videoPlayerInstance.markers.add(this.markerList);
      console.log('sucessss');
      this.videoPlayerInstance.pause();
      this.selectedQuestions = [];
      }, (err) => {
        this.videoPlayerInstance.pause();
        console.log('errorr', err);
        alert('Server Error... Try Again');
        this.selectedQuestions = [];
      });
  }

  publishContent() {
    const option = {
      url: 'private/content/v3/publish/' + this.playerConfig.identifier,
      data: {
        request: {
          content: {
            publisher: 'devcon',
            lastPublishedBy: 'devcon'
          }
        }
      }
    };
    return this.configService.post(option).pipe(tap((res) => {
    })).subscribe(() => {
      this.showMessageModal = true;
      this.refreshEvent.emit('Publish sucess');
      console.log('Publish sucess');
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
    return this.configService.patch(option).pipe(tap((res) => this.playerConfig.versionKey = res.result.versionKey));
  }

  deleteMarker(index) {
    const backUpMarkerList = this.markerList;
    this.markerList = _.filter(this.markerList, (obj, i) => i !== index);
    // this.videoPlayerInstance.markers.add(this.markerList);
    this.updateContentMeta().subscribe((res) => {
      this.videoPlayerInstance.markers.remove(_.range(0, index + 1));
      console.log('Removed sucessss');
      }, (err) => {
       this.markerList = backUpMarkerList;
       console.log('errorr', err);
      });
  }

  removeAll() {
    this.markerList = [];
    this.updateContentMeta().subscribe((res) => {
      // this.videoPlayerInstance.markers.remove([1, 2, 3, 4]);
      this.refreshEvent.emit('Remove sucess');
      console.log('All removed...');
      }, (err) => {
       console.log('errorr', err);
      });
  }

  questionClickHandler(e) {
    // console.log("checked-->", this.questionsSelectedd);
    _.find(this.selectedQuestions, que => que.id === e) ?
    (this.selectedQuestions = _.filter(this.selectedQuestions, que => que.id !== e)) :
     this.selectedQuestions.push(_.filter(this.questionList, que => que.id === e)[0]);

    console.log('--->', this.selectedQuestions);
  }

  onSelectBehaviour(e) {
    e.stopPropagation();
  }
}
