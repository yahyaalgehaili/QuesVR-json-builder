import { Component } from '@angular/core';
import {Scene, VIDEO_FORMATS} from "../../models/scene.model";

@Component({
  selector: 'app-builder-workflow',
  templateUrl: './builder-workflow.component.html',
  styleUrl: './builder-workflow.component.scss'
})
export class BuilderWorkflowComponent {

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
              {title: 'left', gotoId: 0},
              {title: 'right', gotoId: 0},
              {title: 'up', gotoId: 0}
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

  sidebarToggled = false;

  toggleSideBar() {
    this.sidebarToggled = !this.sidebarToggled
  }

  copyJson(): string {
    return JSON.stringify(this.scene)
  }
}
