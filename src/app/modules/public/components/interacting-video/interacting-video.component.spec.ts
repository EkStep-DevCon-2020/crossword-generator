import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractingVideoComponent } from './interacting-video.component';

describe('InteractingVideoComponent', () => {
  let component: InteractingVideoComponent;
  let fixture: ComponentFixture<InteractingVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractingVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractingVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
