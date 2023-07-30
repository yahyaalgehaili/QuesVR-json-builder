import {Component, Input, OnInit} from '@angular/core';
import {Scene} from '../../models/scene.model';
import {ArrowDragService} from '../../services/arrow-drag.service';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent implements OnInit {

  constructor(private draggingArrowService: ArrowDragService) {
  }

  @Input()
  scene: Scene;

  ngOnInit(): void {

  }

  scrollStart(): void {
    this.draggingArrowService.updatedTables$.next(true);
  }

}
