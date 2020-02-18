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
      this.videoPlayerInstance = videojs(document.getElementById('video_player_id'), {
        controls: true,
        autoplay: true,
        preload: 'auto'
      }, () => {
         console.log('------> videojs initialiazed...');
      });
      this.videoPlayerInstance.markers({
        markerStyle: {
          width: '7px',
          'border-radius': '30%',
          'background-color': 'red'
       },
       markerTip: {
          display: true,
          text: (marker) => {
             return 'Break: ' + marker.text;
          },
          time: (marker) => {
             return marker.time;
          }
       },
       breakOverlay: {
          display: false,
          displayTime: 3,
          style: {
             width: '100%',
             height: '20%',
             'background-color': 'rgba(0,0,0,0.7)',
             color: 'white',
             'font-size': '17px'
          },
          text: (marker) => {
             return 'Break overlay: ' + marker.overlayText;
          }
       },
       onMarkerClick: (marker) => {},
       onMarkerReached: (marker) => {},
       markers: []
     });
    }, 0);
  }

}
