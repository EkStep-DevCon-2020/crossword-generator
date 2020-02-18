import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services';

@Component({
  selector: 'app-interacting-video',
  templateUrl: './interacting-video.component.html',
  styleUrls: ['./interacting-video.component.scss']
})
export class InteractingVideoComponent implements OnInit {

  videoList: Array<any>;
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

}
