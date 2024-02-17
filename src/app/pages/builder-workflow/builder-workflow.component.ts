import { Component } from '@angular/core';
import {Scene, VIDEO_FORMATS} from "../../models/scene.model";
import {WizardStepList} from "../../components/wizard-steps/wizard-steps.component";

@Component({
  selector: 'app-builder-workflow',
  templateUrl: './builder-workflow.component.html',
  styleUrl: './builder-workflow.component.scss'
})
export class BuilderWorkflowComponent {

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


}
