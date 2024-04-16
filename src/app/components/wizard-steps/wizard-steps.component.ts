import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {NgClass} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {MatTooltipModule} from "@angular/material/tooltip";

export interface WizardStep {
  id: string;
  label: string;
  invalid: boolean;
  visited: boolean;
  tooltip?: string;
}

export interface WizardStepList {
  activeStep: number;
  steps: WizardStep[];
}

export interface NavigationEvent {
  target?: number;
  transport?: number;
}

@Component({
  selector: 'app-wizard-steps',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    NgClass,
    TranslateModule,
    MatTooltipModule
  ],
  templateUrl: './wizard-steps.component.html',
  styleUrl: './wizard-steps.component.scss'
})
export class WizardStepsComponent {

  @Input()
  workflowSteps: WizardStepList;

  @Output()
  navigation: EventEmitter<any> = new EventEmitter<any>()

  next(): void {
    this.navigation.emit({transport: 1})
  }

  previous(): void{
    this.navigation.emit({transport: -1})
  }

  selectStep(newIndex: number) {
    this.navigation.emit({target: newIndex})
  }

}
