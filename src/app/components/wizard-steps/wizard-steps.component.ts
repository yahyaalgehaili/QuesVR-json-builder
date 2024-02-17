import {Component, Input} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {NgClass} from "@angular/common";

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

@Component({
  selector: 'app-wizard-steps',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    NgClass
  ],
  templateUrl: './wizard-steps.component.html',
  styleUrl: './wizard-steps.component.scss'
})
export class WizardStepsComponent {

  @Input()
  workflowSteps: WizardStepList;

  next(): void {
    this.workflowSteps.steps[this.workflowSteps.activeStep].visited = true;
    // set the right validation
    this.workflowSteps.steps[this.workflowSteps.activeStep].invalid = false;

    if (this.workflowSteps.steps[this.workflowSteps.activeStep +1]) {
      this.workflowSteps.activeStep += 1;
    }
  }

  previous(): void{
    this.workflowSteps.steps[this.workflowSteps.activeStep].visited = false;
    // set the right validation
    this.workflowSteps.steps[this.workflowSteps.activeStep].invalid = false;

    if (this.workflowSteps.steps[this.workflowSteps.activeStep -1]) {
      this.workflowSteps.activeStep -= 1;
    }
  }

  selectStep(newIndex: number) {
    this.workflowSteps.activeStep = newIndex;

    this.workflowSteps.steps.forEach((step, index) => {
      step.visited = index <= newIndex;
    })
  }

}
