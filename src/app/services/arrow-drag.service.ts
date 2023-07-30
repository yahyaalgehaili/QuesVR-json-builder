import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArrowDragService {

  draggingArrow$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  updatedTables$: Subject<boolean> = new Subject<boolean>();

  public getDraggingArrow$(): Observable<boolean> {
    return this.draggingArrow$.asObservable();
  }

  public setDraggingArrow(value: boolean): void {
    this.draggingArrow$.next(value);
  }
}
