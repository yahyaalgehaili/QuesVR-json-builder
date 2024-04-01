import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {VIDEO_FORMATS, VideoModel} from '../../models/scene.model';
import {ArrowDragService} from '../../services/arrow-drag.service';
import {Observable, Subscription} from 'rxjs';
import {CdkDragEnd} from '@angular/cdk/drag-drop';
import {FormControl} from "@angular/forms";
import {VideoContextItem, VideoService} from "../../services/video.service";

declare var LeaderLine: any;

@Component({
  selector: 'app-scene-table',
  templateUrl: './scene-table.component.html',
  styleUrls: ['./scene-table.component.scss'],
  encapsulation: ViewEncapsulation.None
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

  @ViewChild('videoInput') videoInput: ElementRef<HTMLInputElement>;
  videoOptions: VideoContextItem[] = [];
  filteredVideoOptions: VideoContextItem[] = [];

  videoControl: FormControl<VideoContextItem | null> = new FormControl<VideoContextItem | null>(null);

  protected readonly Number = Number;

  protected readonly VIDEO_FORMATS = VIDEO_FORMATS;

  constructor(
    private draggingArrowService: ArrowDragService,
    private videoService: VideoService
  ) {
  }

  ngOnInit(): void {
    this.videoService.getSelectedVideos$().subscribe((videos) => {
      this.videoOptions = videos;
      this.filteredVideoOptions = this.videoOptions.slice();
    });

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
    });

    this.initVideoInput();

    this.videoControl.valueChanges.subscribe((value) => {
      if (value) {
        this.video.fileName = value.name;
        this.video.videoFormat = value.format;
        this.onUpdate.emit(this.video);
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

  initVideoInput() {
    if (this.video.fileName) {
      const selectedVideo = this.videoOptions.find((video) => video.name === this.video.fileName);
      if (selectedVideo) {
        this.videoControl.setValue(selectedVideo);
      }

    }
  }

  filter(): void {
    const filterValue = this.videoInput.nativeElement.value.toLowerCase();
    this.filteredVideoOptions = this.videoOptions.filter(o => o.name.toLowerCase().includes(filterValue));
  }

  getVideoOptionText(option: VideoContextItem): string {
    const stringList: string[] = option?.name.split('/');
    if (stringList && stringList.length) {
      return stringList[stringList.length - 1];
    }

    return option?.name;
  };

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
      gotoId: null
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
