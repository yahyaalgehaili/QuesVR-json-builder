import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FileHandle} from "../../directives/drag-drop.directive";
import {BehaviorSubject, debounceTime} from "rxjs";
import {VideoContextItem} from "../../services/video.service";
import {VIDEO_FORMATS} from "../../models/scene.model";

export interface UploadVideoFilesUploadData {
  forceManual?: boolean;
}

@Component({
  selector: 'app-upload-video-files-dialog',
  templateUrl: './upload-video-files-dialog.component.html',
  styleUrl: './upload-video-files-dialog.component.scss'
})
export class UploadVideoFilesDialogComponent implements OnInit {

  manualInput: boolean = false;

  uploadedVideos: VideoContextItem[];

  uploadedVideos$: BehaviorSubject<VideoContextItem[]> = new BehaviorSubject<VideoContextItem[]>([]);

  constructor(
    public dialogRef: MatDialogRef<UploadVideoFilesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UploadVideoFilesUploadData
  ) {
  }

  ngOnInit(): void {
    this.manualInput = this.data.forceManual ?? false;

    this.uploadedVideos$.pipe(debounceTime(200)).subscribe((videos: VideoContextItem[]) => {
      if (videos && videos?.length > 0) {
        this.uploadedVideos = videos;
        this.dialogRef.close({videos: this.uploadedVideos});
      }
    })
  }

  uploadFiles(files: FileHandle[]) {
    const videos :VideoContextItem[] = [];
    files.forEach((file) => {
      const video = document.createElement('video');
      video.src = window.URL.createObjectURL(file.file);
      video.preload = 'metadata';
      video.onloadedmetadata =  ()=> {
        videos.push({
          id: '1',
          name: file.file.name,
          format: VIDEO_FORMATS.LEFT_EYE_ON_TOP,
          length: Math.round(video.duration)
        });
        this.uploadedVideos$.next(videos);
      }
    })
  }

  onFileSelect(uploads: any) {
    const fileList: FileList = uploads.target.files;
    const files: FileHandle[] = Array.from(fileList).map((file: File) => ({
      file: file,
      url: window.URL.createObjectURL(file)
    }))

    this.uploadFiles(files)
  }

  toggleManualInput(event: Event): void {
    event.stopPropagation();
    this.manualInput = !this.manualInput;
  }
}
