import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoOptionComponent } from './video-option.component';

describe('VideoOptionComponent', () => {
  let component: VideoOptionComponent;
  let fixture: ComponentFixture<VideoOptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoOptionComponent]
    });
    fixture = TestBed.createComponent(VideoOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
