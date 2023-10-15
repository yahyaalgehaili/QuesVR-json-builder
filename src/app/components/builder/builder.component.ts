import {Component, Input} from '@angular/core';
import {Scene, VIDEO_FORMATS, VideoModel} from '../../models/scene.model';
import {ArrowDragService} from '../../services/arrow-drag.service';
import {MatDialog} from '@angular/material/dialog';
import {JsonImportDialogComponent} from '../json-import-dialog/json-import-dialog.component';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent {

  constructor(
    private draggingArrowService: ArrowDragService,
    public dialog: MatDialog
  ) {
  }

  @Input()
  scene: Scene;

  scrollStart(): void {
    this.draggingArrowService.updatedTables$.next(true);
  }

  addVideo(): void {
    const newVideo: VideoModel = {
      id: this.findLowestId(),
      videoFormat: VIDEO_FORMATS.LEFT_EYE_ON_TOP,
      fileName: '',
      questions: [],
      builderConfig: {
        point: {
          x: 0,
          y: 0
        }
      }
    }

    this.scene.videos.push(newVideo);
  }

  findLowestId(): number {
    const sortedScenes: VideoModel[] =
      this.scene.videos.sort((a, b) => a.id - b.id);
    const highestId: number = sortedScenes.length > 0 ? sortedScenes[sortedScenes.length - 1]?.id : 0;

    return highestId + 1;
  }

  removeVideo(video: VideoModel) {
    this.scene.videos.splice(
      this.scene.videos.findIndex((v: VideoModel): boolean => v.id === video.id),
      1)
    setTimeout(() => this.draggingArrowService.updatedTables$.next(true), 10);
  }

  clearScene() {
    this.scene = {
      name: 'test scene',
      id: 1,
      videos: []
    }

    setTimeout(() => this.draggingArrowService.updatedTables$.next(true), 10);
  }

  openImportDialog(): void {
    const dialogRef = this.dialog.open(JsonImportDialogComponent, {
      minWidth: 700
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.scene = result
    })
  }
}
