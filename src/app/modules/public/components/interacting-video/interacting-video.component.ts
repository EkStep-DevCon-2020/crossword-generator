import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ConfigService } from '../../services';
declare var videojs: any;
@Component({
  selector: 'app-interacting-video',
  templateUrl: './interacting-video.component.html',
  styleUrls: ['./interacting-video.component.scss']
})
export class InteractingVideoComponent implements OnInit, AfterViewInit {

  videoList: Array<any>;
  selVideo: any;
  showPreview: boolean;
  videoPlayerInstance: any;
  constructor(public configService: ConfigService) { }

  ngOnInit() {
    const request = {
      url: `composite/v1/search`,
      header: {
        'Content-Type': 'application/json'
      },
      data: {
          request: {
               filters: {
                 createdBy: 'interaction_videos',
                  status: ['Draft']
               }
           }
          }
       };
    this.configService.post(request).subscribe((res) => {
      this.videoList = res.result.content;
    }, (err) => {

    });
  }

  ngAfterViewInit() {

  }

  clickHandler(que) {
     this.selVideo = que;
     this.showPreview = true;
     setTimeout(() => {
      this.videoPlayerInstance = videojs(document.getElementById('video_player_id'), {}, () => {
        // Player (this) is initialized and ready.
          console.log('--------->');
      });
      this.videoPlayerInstance.markers({
        markers: [
           {
              time: 16,
              text: 'any'
           },
        ]
     });
     }, 0);
  }

}
