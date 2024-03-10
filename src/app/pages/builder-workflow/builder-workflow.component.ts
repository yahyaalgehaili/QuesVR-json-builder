import { Component } from '@angular/core';
import {Scene, StoryInfo, VIDEO_FORMATS} from "../../models/scene.model";
import {NavigationEvent, WizardStepList} from "../../components/wizard-steps/wizard-steps.component";
import {DetailsFormModel} from "../../components/details-form/details-form.component";
import {BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: 'app-builder-workflow',
  templateUrl: './builder-workflow.component.html',
  styleUrl: './builder-workflow.component.scss'
})
export class BuilderWorkflowComponent {

  nextStepObservable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  details: StoryInfo = {
    title: '',
    description: '',
    path: ''
  }

  workflowSteps: WizardStepList = {
    activeStep: 0,
    steps: [
      {
        id: 'details',
        invalid: false,
        label: 'details',
        visited: false,
      },
      {
        id: 'videos',
        invalid: false,
        label: 'videos',
        visited: false,
      },
      {
        id: 'editor',
        invalid: false,
        label: 'editor',
        visited: false,
      },
      {
        id: 'preview',
        invalid: false,
        label: 'preview',
        visited: false,
      },
    ]
  }

  scene: Scene = {
    name: 'test scene',
    id: 1,
    videos: [
      {
        id: 0,
        videoFormat: VIDEO_FORMATS.LEFT_EYE_ON_TOP,
        fileName: 'Test/test-scene1.mp4',
        questions: [
          {
            title: 'Where do you want to go?',
            startAppearance: 10,
            endAppearance: 50,
            options: [
              {title: 'left', gotoId: null},
              {title: 'right', gotoId: null},
              {title: 'up', gotoId: null}
            ]
          },
        ],
        nextVideo: 1,
      },
      {
        id: 1,
        videoFormat: VIDEO_FORMATS.LEFT_EYE_ON_TOP,
        fileName: 'Test/test-scene1.mp4',
        questions: [
          {
            title: 'Where do you want to go?',
            startAppearance: 10,
            endAppearance: 50,
            options: [
              {title: 'left', gotoId: 1},
              {title: 'right', gotoId: 2},
              {title: 'up', gotoId: 3}
            ]
          }
        ],
        builderConfig: {
          point: {
            x: 620,
            y: 320
          }
        }
      },
      {
        id: 2,
        videoFormat: VIDEO_FORMATS.LEFT_EYE_ON_TOP,
        fileName: 'Test/test-scene1.mp4',
        questions: [
          {
            title: 'Where do you want to go?',
            startAppearance: 10,
            endAppearance: 50,
            options: [
              {title: 'left', gotoId: 1},
              {title: 'right', gotoId: 2},
              {title: 'up', gotoId: 3}
            ]
          }
        ]
      },
      {
        id: 3,
        videoFormat: VIDEO_FORMATS.LEFT_EYE_ON_TOP,
        fileName: 'Test/test-scene1.mp4',
        questions: [
          {
            title: 'Where do you want to go?',
            startAppearance: 10,
            endAppearance: 50,
            options: [
              {title: 'left', gotoId: 1},
              {title: 'right', gotoId: 2},
              {title: 'up', gotoId: 3}
            ]
          }
        ]
      }
    ]
  }

  setDetails(details: DetailsFormModel) {
    this.details = {
      title: details.title?.trim() ?? '',
      description: details.description ?? '',
      path: details.title ? details.title?.trim().replace(' ', '-') : ''
    }
  }

  switchStep(navigation: NavigationEvent) {
    if (!this.validateCurrentStep()) {
      this.workflowSteps.steps[this.workflowSteps.activeStep].invalid = true;
      return;
    }
    this.workflowSteps.steps[this.workflowSteps.activeStep].invalid = false;

    if (navigation.transport !== undefined) {
      this.workflowSteps.steps[this.workflowSteps.activeStep].visited = navigation.transport > 0;

      if (this.workflowSteps.steps[this.workflowSteps.activeStep + navigation.transport]) {
        this.workflowSteps.activeStep = this.workflowSteps.activeStep + navigation.transport;
      }
      return;
    }

    if (navigation.target !== undefined) {
      this.workflowSteps.activeStep = navigation.target;

      this.workflowSteps.steps.forEach((step, index) => {
        step.visited = index <= (navigation.target as number);
      })
      return;
    }
  }

  validateCurrentStep(): boolean {
    switch (this.workflowSteps.activeStep) {
      case 0:
        this.nextStepObservable.next(!this.validateDetails());
        return this.validateDetails();
      default:
        return true
    }
  }

  validateDetails(): boolean {
    return !!this.details.title && !!this.details.description;
  }

}
