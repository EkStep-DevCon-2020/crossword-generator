import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosswordGeneratorComponent } from './crossword-generator.component';

describe('CrosswordGeneratorComponent', () => {
  let component: CrosswordGeneratorComponent;
  let fixture: ComponentFixture<CrosswordGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrosswordGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosswordGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
