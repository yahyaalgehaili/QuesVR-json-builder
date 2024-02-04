import {Component, EventEmitter, Output} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-builder-toolbar',
  standalone: true,
  templateUrl: './builder-toolbar.component.html',
  imports: [
    TranslateModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule
  ],
  styleUrl: './builder-toolbar.component.scss'
})
export class BuilderToolbarComponent {

  @Output()
  clickVideoDrawer: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  clickHome: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  clickAdd: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  clickClear: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  clickImport: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  clickCode: EventEmitter<boolean> = new EventEmitter<boolean>();


}
