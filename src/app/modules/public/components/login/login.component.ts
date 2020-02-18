import { ConfigService } from '../../services';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

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
  qrCode = false;
  image: string;
  constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 300 },
      height: { ideal: 300 }
    }
  };

  constructor(private renderer: Renderer2, public configService: ConfigService) { }

  ngOnInit() {
  }

  startCamera() {
    this.openErrorModal = false;
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
    this.openSuccessModal = true;
    this.openErrorModal = false;
    this.getFileData();
  }

  openWorkspace() {
    this.openSuccessModal = this.openSuccessModal;
  }

  getFileData() {
    const id = UUID.UUID();
    const request = {
      url: 'private/content/v3/upload/url/' + id + '?idval=false',
      data: {
        request: {
          content: {
            fileName: `${id}.png`
          }
        }
      }
    };
    this.configService.post(request).pipe().subscribe((response) => {
      console.log('errrsrs response', response);
      const signedURL = response.result.pre_signed_url;
      const config = {
        processData: false,
        contentType: 'Asset',
        headers: {
          'x-ms-blob-type': 'BlockBlob'
        }
      };
      this.uploadToBlob(signedURL, this.image, config).subscribe((data) => {
        this.openSuccessModal = true;
        this.openErrorModal = false;
        const fileURL = signedURL.split('?')[0];
      });
    }, err => {
      this.openSuccessModal = false;
      this.openErrorModal = true;

    });
  }

  uploadToBlob(signedURL, file, config): Observable<any>  {
    return this.configService.put({url: signedURL, file, config}).pipe(catchError(err => {
      this.openSuccessModal = false;
      this.openErrorModal = true;
      return throwError(err);
    }), map(data => data));
  }

  closeModal() {
    (this.canvas.nativeElement.getContext('2d')).clearRect(0, 0, this.canvas.nativeElement.height, this.canvas.nativeElement.width);
    this.startCamera();
  }
}
