import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FileHandle} from "../../directives/drag-drop.directive";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, debounceTime, Observable, ReplaySubject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {
  UploadVideoFilesDialogComponent
} from "../../dialogs/upload-video-files-dialog/upload-video-files-dialog.component";

export interface VideoContextItem {
  id: string;
  name: string;
  /* length in seconds */
  length: number;
  format: string;
}

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss'
})
export class VideoListComponent implements OnInit, OnChanges {

  @Input()
  videos: VideoContextItem[] = [];

  @Output()
  upload: EventEmitter<VideoContextItem[]> = new EventEmitter<VideoContextItem[]>()

  displayedColumns: string[] = ['id', 'name', 'length', 'format', 'action'];

  dataSource= new VideolistDataSource(this.videos);

  uploadedVideos$: BehaviorSubject<VideoContextItem[]> = new BehaviorSubject<VideoContextItem[]>([]);

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.dataSource.setData(this.videos);
    this.uploadedVideos$.pipe(debounceTime(200)).subscribe((videos: VideoContextItem[]) => {
      if (videos && videos?.length > 0) {
        this.upload.emit(videos);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videos']) {
      this.dataSource.setData(this.videos);
    }
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
          format: 'left-eye-on-top',
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

  addFilesManually(event: Event) {
    event.stopPropagation();
    this.openUploadDialog(true);
  }

  openUploadDialog(forceManual: boolean = false): void {
    const dialogRef = this.dialog.open(UploadVideoFilesDialogComponent, {data: {forceManual}});

    dialogRef.afterClosed().subscribe((result: {videos: VideoContextItem[]}) => {
      if (result?.videos) {
        this.videos.push(...result.videos);
        this.uploadedVideos$.next([...this.videos])
      }
    })
  }
}

class VideolistDataSource extends DataSource<VideoContextItem> {
  private _dataStream = new ReplaySubject<VideoContextItem[]>();

  constructor(initialData: VideoContextItem[]) {
    super();
    this.setData(initialData);
  }

  override connect(collectionViewer: CollectionViewer): Observable<VideoContextItem[]> {
    return this._dataStream;
  }

  override disconnect(collectionViewer: CollectionViewer) {
  }

  setData(data: VideoContextItem[]) {
    this._dataStream.next(data);
  }
}
