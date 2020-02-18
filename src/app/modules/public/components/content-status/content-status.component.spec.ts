import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentStatusComponent } from './content-status.component';

describe('ContentStatusComponent', () => {
  let component: ContentStatusComponent;
  let fixture: ComponentFixture<ContentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
