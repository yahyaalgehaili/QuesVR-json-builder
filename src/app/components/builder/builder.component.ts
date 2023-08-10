import {Component, Input, OnInit} from '@angular/core';
import {Scene, VIDEO_FORMATS, VideoModel} from '../../models/scene.model';
import {ArrowDragService} from '../../services/arrow-drag.service';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent implements OnInit {

  constructor(private draggingArrowService: ArrowDragService) {
  }

  @Input()
  scene: Scene;

  ngOnInit(): void {

  }

  scrollStart(): void {
    this.draggingArrowService.updatedTables$.next(true);
  }

  addVideo(): void {
    const newVideo: VideoModel = {
      id: this.findLowestId(),
      videoFormat: VIDEO_FORMATS.LEFT_EYE_ON_TOP,
      fileName: '',
      questions: []
    }

    this.scene.videos.push(newVideo);
  }

  findLowestId(): number {
    const sortedScenes: VideoModel[] =
      this.scene.videos.sort((a, b) => a.id - b.id);
    const highestId: number = sortedScenes[sortedScenes.length - 1].id;

    return highestId + 1;
  }
}
