import { ConfigService, TelemetryService } from '../../services';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

const STALL_ID = 'STA1';
const IDEA_ID = 'IDE2';
const visitedProfiles = [];

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('video', { static: false }) videoElement: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  videoWidth = 0;
  videoHeight = 0;
  openSuccessModal = false;
  openErrorModal = false;
  captureImage = false;
  visitorid = '';
  name = '';
  qrCode = false;
  image: string;
  camera;
  constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 300 },
      height: { ideal: 300 }
    }
  };

  constructor(private renderer: Renderer2,
              public configService: ConfigService,
              public telemetryService: TelemetryService,
              public router: Router) { }

  ngOnInit() {
    this.startCamera();
    this.telemetryService.initialize({
      did: 'device1',
      stallId: STALL_ID,
      ideaId: IDEA_ID
    });
  }

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }

  handleError(error) {
    console.log('Error: ', error);
  }

  attachVideo(stream) {
    this.camera = stream.getTracks()[0];
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }
  capture() {
    this.captureImage = true;
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    this.image = this.canvas.nativeElement.toDataURL('image/png');
    this.camera.stop();
    this.uploadImage();
  }

  uploadImage() {
    const id = UUID.UUID();
    const imageId = 'do_11295943688090419214';
    const imageName = `${id}.png`;
    fetch(this.image)
    .then(res => res.blob())
    .then(blob => {
      const fd = new FormData();
      const file = new File([blob], imageName);
      fd.append('file', file);
      const request = {
        url: `private/content/v3/upload/${imageId}`,
        data: fd
      };
      this.configService.post(request).pipe(catchError(err => {
        const errInfo = { errorMsg: 'Image upload failed' };
        this.reCaptureImage();
        return throwError(errInfo);

      })).subscribe((response) => {
        console.log('response ', response);
        this.identifyFace(response);
      });
    });
  }

  identifyFace(response) {
    const request = {
      url: `reghelper/face/identify/multiple`,
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        request: {
          photo: response.result.content_url
        }
      }
    };
    this.configService.post(request).pipe().subscribe((res) => {
      if (res && res.result && res.result.osids && res.result.osids.length > 0) {
        const that = this;
        // tslint:disable-next-line:only-arrow-functions
        res.result.osids.forEach(function(profileId) {
          if (!visitedProfiles.includes(profileId)) {
            console.log('New visitor');
            visitedProfiles.push(profileId);
            const data = {
              profileId
            };
            that.telemetryService.visit(data);
          } else {
            console.log('Old visitor');
          }
        });
      }

    }, (err) => {
      this.reCaptureImage();
      console.log('identifyFace err ', err);
      this.openSuccessModal = false;
      this.openErrorModal = true;
    });
  }

  getUserDtailsByVisitorId() {
    if (this.visitorid) {
      const request = {
        url: `reg/search`,
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          request: {
            entityType: ['Visitor'],
            filters: {
              code: {
                eq : this.visitorid
              }
            }
          }
        }
      };
      this.configService.post(request).pipe().subscribe((res) => {
        if (res.result.Visitor.length > 0) {
          console.log('response ', res.result.Visitor[0]);
          const data = {
            profileId: res.result.Visitor[0].osid
          };
          this.telemetryService.visit(data);
          this.openSuccessModal = true;
          this.openErrorModal = false;
          this.name = res.result.Visitor[0].name;
        } else {
          this.openErrorModal = true;
        }
      });

    }
  }

  gotoWorkspace() {
    this.router.navigate(['/workspace']);
  }

  reCaptureImage() {
    setInterval(() => {
     (this.canvas.nativeElement.getContext('2d')).clearRect(0, 0, this.canvas.nativeElement.height, this.canvas.nativeElement.width);
     setTimeout(() => {
       this.capture();
     }, 3000);
    }, 60000);
  }
}
