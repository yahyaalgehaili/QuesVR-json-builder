import {Component, Input, OnInit} from '@angular/core';
import {VideoModel} from '../../models/scene.model';
import {ArrowDragService} from '../../services/arrow-drag.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-scene-table',
  templateUrl: './scene-table.component.html',
  styleUrls: ['./scene-table.component.scss']
})
export class SceneTableComponent implements OnInit {

  @Input() video: VideoModel;

  @Input() boundaryElement: string;

  DraggingArrow$: Observable<boolean>

  constructor(private draggingArrowService: ArrowDragService) {
  }

  ngOnInit(): void {
    this.DraggingArrow$ = this.draggingArrowService.getDraggingArrow$();
  }

  updateArrows(): void {
    this.draggingArrowService.updatedTables$.next(true);
  }

  removeOption(questionId: number, optionId: number): void {
    this.video.questions[questionId].options.splice(optionId, 1);
    setTimeout(() => this.draggingArrowService.updatedTables$.next(true), 10);
  }

  addOption(questionId: number): void {
    this.video.questions[questionId].options.push({
      title: '',
      gotoId: 0
    })

    this.draggingArrowService.updatedTables$.next(true);
  }

  addQuestion(): void {
    this.video.questions.push({
      title: '',
      options: [],
      startAppearance: 0.0,
      endAppearance: -1.0
    })
  }

  removeQuestion(questionId: number): void {
    this.video.questions.splice(questionId, 1);
  }
}
