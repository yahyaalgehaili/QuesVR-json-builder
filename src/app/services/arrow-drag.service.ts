import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

export interface GoToArrow {
  sourceId: string;
  sourceElement: HTMLElement;
  targetId: string;
  targetElement: HTMLElement;
  arrow: any;
}

@Injectable({
  providedIn: 'root'
})
export class ArrowDragService {

  draggingArrow$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentArrows$: BehaviorSubject<GoToArrow[]> = new BehaviorSubject<GoToArrow[]>([]);
  lastRemovedTarget$: BehaviorSubject<string> = new BehaviorSubject<string>('')

  updatedTables$: Subject<boolean> = new Subject<boolean>();

  public getDraggingArrow$(): Observable<boolean> {
    return this.draggingArrow$.asObservable();
  }

  public setDraggingArrow(value: boolean): void {
    this.draggingArrow$.next(value);
  }

  public addOrUpdateArrow(arrow: GoToArrow): void {
    const newArrowArray: GoToArrow[] = this.currentArrows$.value;
    let selectedArrowIndex: number = newArrowArray.findIndex((a: GoToArrow) => a.sourceId === arrow.sourceId);
    if(selectedArrowIndex > -1) {
      newArrowArray[selectedArrowIndex] = arrow;
    } else {
      newArrowArray.push(arrow);
    }

    this.currentArrows$.next(newArrowArray);
  }

  public removeArrowsWithTargetId(targetId: string): void {
    const currentArrows: GoToArrow[] = [...this.currentArrows$.value];

    const toRemoveIndexes: any[] = currentArrows
      .filter((arrow) => arrow.targetId === targetId)
      .map((_arrow, i: number) => i);
    this.lastRemovedTarget$.next(targetId);

    toRemoveIndexes.reverse().forEach((toRemove: number) => {
      currentArrows.splice(toRemove);
    })
  }
}
