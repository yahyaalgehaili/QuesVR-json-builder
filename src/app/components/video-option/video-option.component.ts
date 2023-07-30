import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CdkDragEnd} from '@angular/cdk/drag-drop';
import {OptionModel} from '../../models/scene.model';
import {ArrowDragService} from '../../services/arrow-drag.service';
import {Observable, Subscription} from 'rxjs';

declare var LeaderLine: any;

@Component({
  selector: 'app-video-option',
  templateUrl: './video-option.component.html',
  styleUrls: ['./video-option.component.scss']
})
export class VideoOptionComponent implements OnInit, OnDestroy {

  constructor(private draggingArrowService: ArrowDragService) {
  }

  @Input()
  option: OptionModel;

  @Input()
  optionElementId: string;

  @Output()
  onRemove: EventEmitter<boolean> = new EventEmitter<boolean>()

  goToElement: HTMLElement;

  arrowLocation: { x: 0, y: 0 };

  goToArrow: any;

  arrowOptions: any = {
    path: 'grid',
    startSocket: 'right',
    endSocket: 'left'
  }

  updatedTable$: Observable<boolean>;
  subscription: Subscription


  ngOnInit(): void {
    this.updatedTable$ = this.draggingArrowService.updatedTables$;
    this.subscription = this.updatedTable$.subscribe((): void => this.updateArrow());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onArrowDrag(): void {
    this.draggingArrowService.setDraggingArrow(true);
  }

  onArrowDrop(dropEvent: CdkDragEnd): void {
    this.goToElement = (dropEvent.event.srcElement as HTMLElement);
    const goToId: string = (dropEvent.event.srcElement as HTMLElement).id;
    if (goToId.startsWith('videoId')) {

      this.option.gotoId = parseInt(goToId.replace('videoId', ''));

      if (this.goToArrow) {
        this.goToArrow.remove();
      }

      this.goToArrow = new LeaderLine(
        document.getElementById(this.optionElementId),
        (dropEvent.event.srcElement as HTMLElement),
        this.arrowOptions
      )
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
    if (this.goToArrow) {
      this.goToArrow.remove();
    }
    this.onRemove.emit(true);
  }

  resetArrowLocation(): void {
    this.arrowLocation = {x: 0, y: 0};
  }
}
