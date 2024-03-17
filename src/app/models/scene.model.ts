import {Point} from '@angular/cdk/drag-drop';

export enum VIDEO_FORMATS {
  LEFT_EYE_ON_TOP = 0,
  MONO_SCOPE = 1
}

export interface StoryInfo {
  title: string;
  description: string;
  path: string;
}

export interface Scene {
  id: number;
  name: string;
  videos: VideoModel[];
}

export interface VideoModel {
  id: number;
  fileName: string;
  videoFormat: VIDEO_FORMATS;
  questions: QuestionModel[];
  nextVideo?: number;
  builderConfig?: BuilderConfig;
}

export interface BuilderConfig {
  point: Point;
}

export interface QuestionModel {
  title: string;
  options: OptionModel[];
  startAppearance: number;
  endAppearance: number;
}

export interface OptionModel {
  title: string;
  gotoId?: number | null;
}

export const mockVideos: VideoModel[] = [
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
];
