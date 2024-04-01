import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {StoryInfo} from "../models/scene.model";

export const defaultDetails: StoryInfo = {
  title: '',
  description: '',
  path: ''
}

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  private detailsStore$: BehaviorSubject<StoryInfo> = new BehaviorSubject<StoryInfo>(defaultDetails);

  constructor() { }

  getDetails(): StoryInfo {
    return this.detailsStore$.value;
  }

  getDetails$(): Observable<StoryInfo> {
    return this.detailsStore$.asObservable();
  }

  setDetails(details: StoryInfo) {
    this.detailsStore$.next(details);
  }
}
