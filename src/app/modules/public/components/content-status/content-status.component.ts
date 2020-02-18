import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-content-status',
  templateUrl: './content-status.component.html',
  styleUrls: ['./../content-review/content-review.component.scss']
})
export class ContentStatusComponent implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit() {
  }

}
