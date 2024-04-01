import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, take, tap} from "rxjs";
import {
  UploadVideoFilesDialogComponent
} from "../dialogs/upload-video-files-dialog/upload-video-files-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {VIDEO_FORMATS} from "../models/scene.model";

export interface VideoContextItem {
  id: string;
  name: string;
  /* length in seconds */
  length: number;
  format: VIDEO_FORMATS;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  private videoStore$: BehaviorSubject<VideoContextItem[]> = new BehaviorSubject<VideoContextItem[]>([]);

  constructor(public dialog: MatDialog) {
  }

  getSelectedVideos(): VideoContextItem[] {
    return this.videoStore$.value
  }

  getSelectedVideos$(): Observable<VideoContextItem[]> {
    return this.videoStore$.asObservable()
  }

  setVideos(newVideos: VideoContextItem[]): void {
    this.videoStore$.next(newVideos);
  }

  /**
   * Adds new videos to the array with unique names.
   * @param newVideos
   */
  addVideos(newVideos: VideoContextItem[]): void {
    const uniqueVideos: VideoContextItem[] = [];
    let duplicateVideoCount: number = 0;
    this.videoStore$.pipe(
      take(1),
      tap((videos: VideoContextItem[]) => {
        newVideos.forEach((newVideo) => {
          if (!!videos.find((v) => v.name === newVideo.name)) {
            duplicateVideoCount += 1
          } else {
            uniqueVideos.push(newVideo);
          }
        })

        if (duplicateVideoCount > 0) {
          // todo: show error 'x duplicate items haven ot been added'
        }

        this.videoStore$.next([...this.videoStore$.value, ...uniqueVideos]);
      })).subscribe()
  }

  openUploadDialog(forceManual: boolean = false): void {
    const dialogRef = this.dialog.open(UploadVideoFilesDialogComponent, {data: {forceManual}});

    dialogRef.afterClosed().subscribe((result: {videos: VideoContextItem[]}) => {
      if (result?.videos) {
        this.addVideos(result.videos);
      }
    })
  }

  updateVideoPath(newPathName: string) {
    const newVideos: VideoContextItem[] = this.getSelectedVideos().map((video: VideoContextItem) => ({
      ...video,
      name: `${newPathName}/${video.name.split('/')[video.name.split('/').length - 1]}`
    }))

    this.setVideos(newVideos);
  }
}
