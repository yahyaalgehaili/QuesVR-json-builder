import { Injectable } from '@angular/core';
import {OptionModel, QuestionModel, Scene, VIDEO_FORMATS, VideoModel} from "../models/scene.model";
import {BehaviorSubject, Observable} from "rxjs";

export interface ValidationModel {
  error: string;
  id?: string;
  translationString?: string;
}

export const defaultScene: Scene = {
  name: 'scene',
  id: 1,
  videos: []
}

@Injectable({
  providedIn: 'root'
})
export class SceneService {

  sceneStore$: BehaviorSubject<Scene> = new BehaviorSubject<Scene>(defaultScene);

  constructor() { }

  getScene(): Scene {
    return this.sceneStore$.value;
  }

  getScene$(): Observable<Scene> {
    return this.sceneStore$.asObservable();
  }

  setScene(scene: Scene) {
    this.sceneStore$.next(scene);
  }

  /**
   * returns null when valid
   * @param scene
   */
  validateScene(scene: Scene): ValidationModel | null {
    return this.validateSceneBase(scene) ?? this.validateSceneVideos(scene);
  }

  validateSceneBase(scene: Scene): ValidationModel | null {
    if (scene && scene.id && scene.name && scene.videos && scene.videos.length && !this.validateInitialVideo(scene)) {
      return null;
    }

    if (this.validateInitialVideo(scene)) {
      return this.validateInitialVideo(scene);
    }

    if (scene.videos && scene.videos.length < 1) {
      return {error:  'invalid base; missing videos', translationString: 'VIDEO.VALIDATION.MISSING_VIDEOS'}
    }

    return {error: 'invalid base', translationString: 'VIDEO.VALIDATION.DEFAULT'}
  }

  validateInitialVideo(scene: Scene): ValidationModel | null {
    if (!!scene.videos.find((video) => video.id === 0)) {
      return null;
    }
    return {error: 'invalid videos; missing video with id = 0', translationString: 'VIDEO.VALIDATION.MISSING_INIT_VIDEO'}
  }

  validateSceneVideos(scene: Scene): ValidationModel | null {
    if (scene && scene.videos && scene.videos.length) {
      const invalidVideo = scene.videos.find((video: VideoModel) => !!this.validateSceneVideo(video));
      return invalidVideo ? this.validateSceneVideo(invalidVideo) : null;
    }

    return {error: 'invalid videos; missing videos', translationString: 'VIDEO.VALIDATION.MISSING_VIDEOS'};

  }

  validateSceneVideo(video: VideoModel): ValidationModel | null {
    if (video && video.id >= 0 && Object.values(VIDEO_FORMATS).includes(video.videoFormat) && video.fileName && video.questions) {
      if (video.questions.length === 0) {
        return null;
      }

      return this.validateSceneVideoQuestions(video);

    }
    return {error: 'invalid videos; missing crucial video data', id: video.id.toString(), translationString: 'VIDEO.VALIDATION.MISSING_DATA'}
  }

  validateSceneVideoQuestions(video: VideoModel): ValidationModel | null {
    let id: string = '';
    const invalidQuestion = video.questions.find((question, index) => {
      id = `video${video.id}question${index}`
      return !!this.validateSceneVideoQuestion(question, id)
    });

    return invalidQuestion ? this.validateSceneVideoQuestion(invalidQuestion, id) : null;
  }

  validateSceneVideoQuestion(question: QuestionModel, id: string): ValidationModel | null {
    if (question && question.title && question.endAppearance !== null && question.startAppearance !== null && question.options) {
      if (question.options.length === 0) {
        return {error: 'invalid question; missing available options', id, translationString: 'VIDEO.VALIDATION.MISSING_OPTIONS'};
      }

      return this.validateSceneVideoQuestionOptions(question, id);
    }

    return {error: 'invalid question; missing crucial question data', id, translationString: 'VIDEO.VALIDATION.MISSING_QUESTION_DATA'};
  }

  validateSceneVideoQuestionOptions(question: QuestionModel, id: string): ValidationModel | null {
    let optionId: string = '';
    const invalidOption = question.options.find((option, index) => {
      optionId = `${id}answer${index}`
      return !!this.validateSceneVideoQuestionOption(option, optionId)
    });

    return invalidOption ? this.validateSceneVideoQuestionOption(invalidOption, optionId) : null;
  }

  validateSceneVideoQuestionOption(option: OptionModel, id: string): ValidationModel | null {
    if (option && option.title && !(option.gotoId === null || option.gotoId === undefined)) {
      return null;
    }
    return {error: 'invalid option; missing crucial option data', id, translationString: 'VIDEO.VALIDATION.OPTION_DATA'};
  }

}
