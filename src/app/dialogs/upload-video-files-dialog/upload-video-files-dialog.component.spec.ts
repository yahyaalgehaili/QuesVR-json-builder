import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadVideoFilesDialogComponent } from './upload-video-files-dialog.component';

describe('UploadVideoFilesDialogComponent', () => {
  let component: UploadVideoFilesDialogComponent;
  let fixture: ComponentFixture<UploadVideoFilesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadVideoFilesDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadVideoFilesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
