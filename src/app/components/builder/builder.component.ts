import {ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {Scene, VIDEO_FORMATS, VideoModel} from '../../models/scene.model';
import {ArrowDragService} from '../../services/arrow-drag.service';
import {MatDialog} from '@angular/material/dialog';
import {JsonImportDialogComponent} from '../json-import-dialog/json-import-dialog.component';
import {PanZoomAPI, PanZoomConfig, PanZoomConfigOptions, PanZoomModel, Rect} from "ngx-panzoom";
import {Subscription} from "rxjs";
import {cloneDeep} from "lodash";

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent implements OnInit, OnDestroy {

  private panZoomConfigOptions: PanZoomConfigOptions = {
    zoomLevels: 4,
    scalePerZoomLevel: 2.0,
    zoomStepDuration: 0.01,
    freeMouseWheelFactor: 0.001,
    zoomToFitZoomLevelFactor: 0.5,
    dragMouseButton: 'right',
    initialPanX: 0,
    initialPanY: 0,
    keepInBoundsDragPullback: 100,
  };
  panzoomConfig: PanZoomConfig;
  private panZoomAPI: PanZoomAPI;
  private apiSubscription: Subscription;
  panzoomModel: PanZoomModel;
  private modelChangedSubscription: Subscription;
  canvasWidth = 4000;
  initialZoomHeight: number; // set in resetZoomToFit()
  initialZoomWidth = this.canvasWidth;
  scale: number;

  @Input()
  scene: Scene;

  constructor(
    private draggingArrowService: ArrowDragService,
    public dialog: MatDialog,
    private el: ElementRef,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.panzoomConfig = this.initPanzoomConfig();
    this.initialZoomHeight = this.panzoomConfig.initialZoomToFit?.height;
    this.scale = this.getCssScale(this.panzoomConfig.initialZoomLevel)
    this.changeDetector.detectChanges();

    this.apiSubscription = this.panzoomConfig.api.subscribe(
      (api: PanZoomAPI) => {
        this.panZoomAPI = api
      }
    );
    this.modelChangedSubscription = this.panzoomConfig.modelChanged.subscribe(
      (model: PanZoomModel) => {
        if (!model.isPanning) {
          // also do this based on time via a pipe
          this.draggingArrowService.updatedTables$.next(true);

          this.panIntoBounds(model);
        }

        this.onModelChanged(model)
      }
    );
    this.changeDetector.detectChanges()
  }

  ngOnDestroy(): void {
    this.modelChangedSubscription.unsubscribe();
    this.apiSubscription.unsubscribe();
  }

  panIntoBounds(model: PanZoomModel) {
    console.log(model);
    const bounds = {
      x: {min: -3500, max: 0},
      y: {min: -2000, max: 0}
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

  private initPanzoomConfig(): PanZoomConfig {
    return {
      ...new PanZoomConfig(this.panZoomConfigOptions),
      // initialZoomToFit: this.getInitialZoomToFit()
    };
  }

  onModelChanged(model: PanZoomModel): void {
    this.panzoomModel = cloneDeep(model);
    this.scale = this.getCssScale(this.panzoomModel.zoomLevel);
    this.changeDetector.markForCheck();
    this.changeDetector.detectChanges();
  }

  private getCssScale(zoomLevel: any): number {
    return Math.pow(this.panzoomConfig.scalePerZoomLevel, zoomLevel - this.panzoomConfig.neutralZoomLevel);
  }

  getInitialZoomToFit(): Rect {
    const width = this.el.nativeElement.clientWidth;
    const height = this.canvasWidth * this.el.nativeElement.clientHeight / width;
    return {
      x: 0,
      y: 0,
      width: this.canvasWidth,
      height
    };
  }

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
    if (this.scene.videos.length === 0) {
      return 0;
    }
    const sortedScenes: VideoModel[] =
      this.scene.videos.sort((a, b) => a.id - b.id);
    const highestId: number = sortedScenes.length > 0 ? sortedScenes[sortedScenes.length - 1]?.id : 0;

    return highestId + 1;
  }

  removeVideo(video: VideoModel) {
    this.draggingArrowService.removeArrowsWithTargetId(`videoId${video.id}`)

    setTimeout(() => {
      this.scene.videos.splice(
        this.scene.videos.findIndex((v: VideoModel): boolean => v.id === video.id),
        1)
      setTimeout(() => this.draggingArrowService.updatedTables$.next(true), 10);
    }, 100)

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

  panBackToStart() {
    this.panZoomAPI.resetView();
  }
}
