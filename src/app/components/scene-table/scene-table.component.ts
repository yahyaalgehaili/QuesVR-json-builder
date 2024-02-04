import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {VIDEO_FORMATS, VideoModel} from '../../models/scene.model';
import {ArrowDragService} from '../../services/arrow-drag.service';
import {Observable, Subscription} from 'rxjs';
import {CdkDragEnd} from '@angular/cdk/drag-drop';

declare var LeaderLine: any;

@Component({
  selector: 'app-scene-table',
  templateUrl: './scene-table.component.html',
  styleUrls: ['./scene-table.component.scss']
})
export class SceneTableComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() video: VideoModel;

  @Input() boundaryElement: string;

  @Output() onRemoveVideo: EventEmitter<VideoModel> = new EventEmitter<VideoModel>();

  @Output() onUpdate: EventEmitter<VideoModel> = new EventEmitter<VideoModel>();

  DraggingArrow$: Observable<boolean>

  arrowLocation: { x: 0, y: 0 };

  nextVideoElement: HTMLElement | undefined;

  goToArrow: any;

  arrowOptions: any = {
    path: 'grid',
    startSocket: 'bottom',
    endSocket: 'left'
  }

  nextVideoActionElementId: string;

  updatedTable$: Observable<boolean>;

  subscription: Subscription;

  protected readonly Number = Number;

  protected readonly VIDEO_FORMATS = VIDEO_FORMATS;

  constructor(private draggingArrowService: ArrowDragService) {
  }

  ngOnInit(): void {
    if (this.video) {
      this.nextVideoActionElementId = 'next-video-action-' + this.video.id;
    }
    this.DraggingArrow$ = this.draggingArrowService.getDraggingArrow$();
    this.updatedTable$ = this.draggingArrowService.updatedTables$;
    this.subscription = this.updatedTable$.subscribe((): void => this.updateArrow());

    this.draggingArrowService.lastRemovedTarget$.subscribe((arrowTarget: string) => {
      if (arrowTarget === this.nextVideoElement?.id && this.goToArrow) {
        this.goToArrow.remove();
        this.goToArrow = undefined;
        this.nextVideoElement = undefined;
      }
    })
  }

  ngAfterViewInit() {
    setTimeout(() => this.initArrow(), 10);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();

    if (this.goToArrow) {
      this.goToArrow.remove();
      this.goToArrow = undefined;
    }
  }

  initArrow(): void {
    if (this.video.nextVideo) {
      const nextVideoTemplate: HTMLElement | null = document.getElementById(`videoId${this.video.nextVideo}`);

      if (nextVideoTemplate) {
        this.nextVideoElement = nextVideoTemplate;
        this.createNextVideoArrow(this.video.nextVideo, nextVideoTemplate);
      }

    }
  }

  onReleaseVideo(): void {
    this.onUpdate.emit(this.video);
    this.updateArrows();
  }

  onVideoDragEnd(dropEvent: CdkDragEnd): void {
    const newXValue = this.video.builderConfig
      ? this.video.builderConfig.point.x + dropEvent.distance.x
      : dropEvent.distance.x;

    const newYValue = this.video.builderConfig
      ? this.video.builderConfig.point.y + dropEvent.distance.y
      : dropEvent.distance.y;

    this.video.builderConfig = {
      point: {
        x: newXValue >= 0 ? newXValue: 0,
        y: newYValue >= 0 ? newYValue: 0
      }
    }

  }


  updateArrows(): void {
    this.draggingArrowService.updatedTables$.next(true);
  }

  removeOption(questionId: number, optionId: number): void {
    this.video.questions[questionId].options.splice(optionId, 1);
    setTimeout(() => this.draggingArrowService.updatedTables$.next(true), 10);
    this.onUpdate.emit(this.video);
  }

  addOption(questionId: number): void {
    this.video.questions[questionId].options.push({
      title: '',
      gotoId: 0
    })

    setTimeout(() => this.draggingArrowService.updatedTables$.next(true), 10);
    this.onUpdate.emit(this.video);
  }

  addQuestion(): void {
    this.video.questions.push({
      title: '',
      options: [],
      startAppearance: 0.0,
      endAppearance: -1.0
    })
    setTimeout(() => this.draggingArrowService.updatedTables$.next(true), 10);
    this.onUpdate.emit(this.video);
  }

  removeQuestion(questionId: number): void {
    this.video.questions.splice(questionId, 1);
    setTimeout(() => this.draggingArrowService.updatedTables$.next(true), 10);
    this.onUpdate.emit(this.video);
  }

  getVideoFormatIcon(videoFormat: VIDEO_FORMATS): string {
    switch (videoFormat) {
      case VIDEO_FORMATS.LEFT_EYE_ON_TOP:
        return 'view_in_ar';
      case VIDEO_FORMATS.MONO_SCOPE:
        return 'crop_din';
      default:
        return '';
    }
  }

  getVideoFormatTooltip(videoFormat: VIDEO_FORMATS): string {
    switch (videoFormat) {
      case VIDEO_FORMATS.LEFT_EYE_ON_TOP:
        return 'Left eye on top';
      case VIDEO_FORMATS.MONO_SCOPE:
        return 'Monoscope';
      default:
        return '';
    }
  }

  onArrowDrag() {
    this.draggingArrowService.setDraggingArrow(true);
  }

  onArrowDrop(dropEvent: CdkDragEnd) {
    this.nextVideoElement = (dropEvent.event.srcElement as HTMLElement);
    const goToId: number = parseInt(
      (dropEvent.event.srcElement as HTMLElement).id.replace('videoId', '')
    );

    this.createNextVideoArrow(goToId, this.nextVideoElement);
    this.onUpdate.emit(this.video);
  }

  createNextVideoArrow(nextVideoId: number, nextVideoElement: HTMLElement): void {
    if (nextVideoId) {

      this.video.nextVideo = nextVideoId;

      if (this.goToArrow) {
        this.goToArrow.remove();
      }

      this.goToArrow = new LeaderLine(
        document.getElementById(this.nextVideoActionElementId),
        nextVideoElement,
        this.arrowOptions
      )
    }

    this.draggingArrowService.setDraggingArrow(false);
    this.arrowLocation = {x: 0, y: 0};
  }


  updateArrow(): void {
    if (!this.goToArrow) {
      return
    }

    if (!this.nextVideoElement) {
      return
    }

    if (!this.nextVideoActionElementId) {
      return
    }

    if (this.goToArrow) {
      this.goToArrow.remove();
    }

    this.goToArrow = new LeaderLine(
      document.getElementById(this.nextVideoActionElementId),
      this.nextVideoElement,
      this.arrowOptions
    );
  }

  removeNextVideoLink(): void {
    this.video.nextVideo = undefined;

    if (this.goToArrow) {
      this.goToArrow.remove();
      this.goToArrow = undefined;
    }

    setTimeout(() => this.draggingArrowService.updatedTables$.next(true), 10);
  }

  removeVideo(): void {
    this.onRemoveVideo.emit(this.video);
  }

  dragStarted() {
    this.goToArrow?.position();
  }
}
