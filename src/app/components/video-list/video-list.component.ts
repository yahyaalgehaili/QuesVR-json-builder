import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FileHandle} from "../../directives/drag-drop.directive";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, debounceTime, Observable, ReplaySubject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {VideoContextItem, VideoService} from "../../services/video.service";
import {VIDEO_FORMATS} from "../../models/scene.model";
import {DetailsService} from "../../services/details.service";


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

  constructor(
    public dialog: MatDialog,
    public videoService: VideoService,
    private detailsService: DetailsService
  ) {
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
      const path: string = this.detailsService.getDetails().path;
      video.src = window.URL.createObjectURL(file.file);
      video.preload = 'metadata';
      video.onloadedmetadata =  ()=> {
        videos.push({
          id: '1',
          name: `${path}/${file.file.name}`,
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

  addFilesManually(event: Event) {
    event.stopPropagation();
    this.videoService.openUploadDialog(true);
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
