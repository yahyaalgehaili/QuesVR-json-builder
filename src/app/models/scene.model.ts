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
}

export interface QuestionModel {
  title: string;
  options: OptionModel[];
  startAppearance: number;
  endAppearance: number;
}

export interface OptionModel {
  title: string;
  gotoId: number;
}
