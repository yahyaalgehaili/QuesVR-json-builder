import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Scene, VIDEO_FORMATS, VideoModel} from '../../models/scene.model';
import {ArrowDragService} from '../../services/arrow-drag.service';
import {PanZoomAPI, PanZoomConfig, PanZoomConfigOptions, PanZoomModel} from "ngx-panzoom";
import {interval, sampleTime, Subscription, tap} from "rxjs";
import {cloneDeep} from "lodash";
import {JsonEditorOptions} from "ang-jsoneditor";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {VideoContextItem, VideoService} from "../../services/video.service";

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent implements OnInit, OnDestroy {

  editorOptions: JsonEditorOptions;

  drawerOpenedInterval: Subscription;

  panzoomConfig: PanZoomConfig;
  panzoomModel: PanZoomModel;
  initialZoomHeight: number; // set in resetZoomToFit()
  scale: number;

  private panZoomConfigOptions: PanZoomConfigOptions = {
    zoomLevels: 4,
    zoomOnDoubleClick: false,
    scalePerZoomLevel: 2.0,
    zoomStepDuration: 0.01,
    freeMouseWheelFactor: 0.001,
    zoomToFitZoomLevelFactor: 0.5,
    dragMouseButton: 'right',
    initialPanX: 0,
    initialPanY: 0,
    keepInBoundsDragPullback: 100,
  };
  private panZoomAPI: PanZoomAPI;
  private apiSubscription: Subscription;
  private modelChangedSubscription: Subscription;

  jsonScene: Scene;

  @Input()
  scene: Scene;

  @Input()
  videos: VideoContextItem[] = [];

  @Output()
  sceneUpdate: EventEmitter<Scene> = new EventEmitter<Scene>();

  constructor(
    private draggingArrowService: ArrowDragService,
    private changeDetector: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    public videoService: VideoService
  ) {}

  ngOnInit(): void {
    this.jsonScene = cloneDeep(this.scene);
    this.panzoomConfig = this.initPanzoomConfig();
    this.initialZoomHeight = this.panzoomConfig.initialZoomToFit?.height;
    this.scale = this.getCssScale(this.panzoomConfig.initialZoomLevel)
    this.changeDetector.detectChanges();

    this.apiSubscription = this.panzoomConfig.api.subscribe(
      (api: PanZoomAPI) => {
        this.panZoomAPI = api
      }
    );

    this.modelChangedSubscription = this.panzoomConfig.modelChanged.pipe(
      tap((model: PanZoomModel) => {
        if (!model.isPanning) {
          // also do this based on time via a pipe
          this.draggingArrowService.updatedTables$.next(true);
          this.panIntoBounds(model);
        }
        this.onModelChanged(model)
      }),
      sampleTime(30),
      tap((model: PanZoomModel) => {
        if (model.isPanning) {
          this.draggingArrowService.updatedTables$.next(true);
        }
      })
    ).subscribe();

    this.changeDetector.detectChanges();
    this.initJsonViewer();
  }

  ngOnDestroy(): void {
    this.modelChangedSubscription.unsubscribe();
    this.apiSubscription.unsubscribe();
  }

  sceneAction(action: 'add' | 'clear' | 'remove' | 'move' | 'update', video?: VideoModel): void {
    switch (action) {
      case "add":
        this.addVideo();
        break;
      case "clear":
        this.clearScene();
        break;
      case "remove":
        video ? this.removeVideo(video) : null;
        break;
      case "update":
      case "move":
        this.sceneUpdate.emit(this.scene);
        break;
    }
    setTimeout(() => this.jsonScene = cloneDeep(this.scene), 100);

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
    this.sceneUpdate.emit(this.scene);
  }

  removeVideo(video: VideoModel) {
    this.draggingArrowService.removeArrowsWithTargetId(`videoId${video.id}`)

    setTimeout(() => {
      this.scene.videos.splice(
        this.scene.videos.findIndex((v: VideoModel): boolean => v.id === video.id),
        1)
      this.sceneUpdate.emit(this.scene);
      setTimeout(() => this.draggingArrowService.updatedTables$.next(true), 10);
    }, 100)

  }

  clearScene() {
    this.scene = {
      name: 'test scene',
      id: 1,
      videos: []
    }

    this.sceneUpdate.emit(this.scene);

    setTimeout(() => this.draggingArrowService.updatedTables$.next(true), 10);
  }

  updateBuilder(action: 'start' | 'end') {
    this.drawerOpenedInterval?.unsubscribe();
    if (action === "start") {
      this.drawerOpenedInterval = interval(30).subscribe(() => this.draggingArrowService.updatedTables$.next(true));
    } else {
      this.draggingArrowService.updatedTables$.next(true);
    }
  }

  panIntoBounds(model: PanZoomModel) {
    const bounds = {
      x: {min: -3500, max: 0},
      y: {min: -2000, max: 0}
    }

    if (
      model.pan.x > (bounds.x.max + 500) ||
      model.pan.x < (bounds.x.min - 500) ||
      model.pan.y > (bounds.y.max + 500) ||
      model.pan.y < (bounds.y.min - 500)
    ) {
      this.panBackToStart();
      return;
    }

    let panXValue = 0;
    let panYValue = 0;

    if (model.pan.x > bounds.x.max) {
      panXValue = model.pan.x + .1;
    } else if (model.pan.x < bounds.x.min) {
      panXValue = -500;
    }

    if (model.pan.y > bounds.y.max) {
      panYValue = model.pan.y + .1;
    } else if (model.pan.y < bounds.y.min) {
      panYValue = -500;
    }

    if (panXValue !== 0 || panYValue !== 0) {
      this.panZoomAPI.panDelta({x: panXValue, y: panYValue}, 0.3)
    }
  }

  panBackToStart() {
    this.panZoomAPI.resetView();
  }

  private initPanzoomConfig(): PanZoomConfig {
    return {
      ...new PanZoomConfig(this.panZoomConfigOptions),
    };
  }

  private onModelChanged(model: PanZoomModel): void {
    this.panzoomModel = cloneDeep(model);
    this.scale = this.getCssScale(this.panzoomModel.zoomLevel);
    this.changeDetector.markForCheck();
    this.changeDetector.detectChanges();
  }

  private getCssScale(zoomLevel: any): number {
    return Math.pow(this.panzoomConfig.scalePerZoomLevel, zoomLevel - this.panzoomConfig.neutralZoomLevel);
  }

  private initJsonViewer() {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'view'
    this.editorOptions.modes = ['view'];
    this.editorOptions.mainMenuBar = true;
    this.editorOptions.expandAll = true;
  }

  private findLowestId(): number {
    if (this.scene.videos.length === 0) {
      return 0;
    }
    const sortedScenes: VideoModel[] =
      this.scene.videos.sort((a, b) => a.id - b.id);
    const highestId: number = sortedScenes.length > 0 ? sortedScenes[sortedScenes.length - 1]?.id : 0;

    return highestId + 1;
  }

  public downloadScene(): void {
    const json = JSON.stringify(this.scene);
    const uri = "data:text/json;charset=UTF-8," + encodeURIComponent(json);

    const element = document.createElement('a');
    element.setAttribute('href', uri);
    element.setAttribute('download', 'story.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

  }

  public sceneToString(): string {
    return JSON.stringify(this.scene);
  }

  public copyScene(): void {
    this.snackbar.open(this.translate.instant('BUILDER.COPY_SCENE'), undefined, {duration: 2000})
  }
}
