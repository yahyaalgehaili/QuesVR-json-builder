import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CdkDragEnd} from '@angular/cdk/drag-drop';
import {OptionModel} from '../../models/scene.model';
import {ArrowDragService, GoToArrow} from '../../services/arrow-drag.service';
import {Observable, Subscription} from 'rxjs';

declare var LeaderLine: any;

@Component({
  selector: 'app-video-option',
  templateUrl: './video-option.component.html',
  styleUrls: ['./video-option.component.scss']
})
export class VideoOptionComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private draggingArrowService: ArrowDragService) {
  }

  @Input()
  option: OptionModel;

  @Input()
  optionElementId: string;

  @Output()
  onRemove: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  optionChange: EventEmitter<OptionModel> = new EventEmitter<OptionModel>();

  goToElement: HTMLElement;

  arrowLocation: { x: 0, y: 0 };

  goToArrow: any;

  arrowOptions: any = {
    path: 'grid',
    startSocket: 'right',
    endSocket: 'left',
    color: 'var(--secondary-400)'
  }

  updatedTable$: Observable<boolean>;
  subscription: Subscription


  ngOnInit(): void {
    this.updatedTable$ = this.draggingArrowService.updatedTables$;
    this.subscription = this.updatedTable$.subscribe((): void => this.updateArrow());
    this.draggingArrowService.lastRemovedTarget$.subscribe((arrowTarget: string) => {
      if (arrowTarget === `videoId${this.option.gotoId}` && this.goToArrow) {
        this.goToArrow.remove();
        this.goToArrow = undefined;
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

  onArrowDrag(): void {
    this.draggingArrowService.setDraggingArrow(true);
  }

  onArrowDrop(dropEvent: CdkDragEnd): void {
    this.goToElement = (dropEvent.event.srcElement as HTMLElement);
    const goToId: number = parseInt(
      (dropEvent.event.srcElement as HTMLElement).id.replace('videoId', '')
    );

    this.createGoToVideoArrow(goToId, this.goToElement)

    this.draggingArrowService.setDraggingArrow(false);
    this.resetArrowLocation();
    this.optionChange.emit(this.option);
  }

  private createGoToVideoArrow(gotoId: number, goToTemplate: HTMLElement | null): void {
    if (gotoId >= 0) {
      this.option.gotoId = gotoId;

      if (this.goToArrow) {
        this.goToArrow.remove();
      }

      this.goToArrow = new LeaderLine(
        document.getElementById(this.optionElementId),
        goToTemplate,
        this.arrowOptions
      )
    }

    const currentElement = document.getElementById(this.optionElementId);
    if (currentElement && goToTemplate) {
      const arrow: GoToArrow = {
        sourceId: this.optionElementId,
        sourceElement: currentElement,
        targetId: `videoId${gotoId}`,
        targetElement: goToTemplate,
        arrow: this.goToArrow
      }
      this.draggingArrowService.addOrUpdateArrow(arrow);
    }

    this.draggingArrowService.setDraggingArrow(false);
    this.resetArrowLocation();
  }

  updateArrow(): void {
    if (!this.goToArrow) {
      return
    }

    if (!this.goToElement) {
      return
    }

    if (!this.optionElementId) {
      return
    }

    this.goToArrow.remove();

    this.goToArrow = new LeaderLine(
      document.getElementById(this.optionElementId),
      this.goToElement,
      this.arrowOptions
    );
  }

  removeItem(): void {
    this.onRemove.emit(true);
  }

  resetArrowLocation(): void {
    this.arrowLocation = {x: 0, y: 0};
  }

  private initArrow(): void {
    if (this.option?.gotoId && this.option?.gotoId >= 0) {
      const goToTemplate: HTMLElement | null = document.getElementById(`videoId${this.option.gotoId}`);

      if (goToTemplate) {
        this.goToElement = goToTemplate;
        this.createGoToVideoArrow(this.option.gotoId, goToTemplate);
      }

    }
  }
}
