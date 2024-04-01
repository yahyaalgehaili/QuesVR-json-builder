import {Component, OnInit} from '@angular/core';
import {Scene, StoryInfo} from "../../models/scene.model";
import {NavigationEvent, WizardStepList} from "../../components/wizard-steps/wizard-steps.component";
import {DetailsFormModel} from "../../components/details-form/details-form.component";
import {BehaviorSubject, Observable, of} from "rxjs";
import {VideoContextItem, VideoService} from "../../services/video.service";
import {DetailsService} from "../../services/details.service";
import {SceneService} from "../../services/scene.service";

@Component({
  selector: 'app-builder-workflow',
  templateUrl: './builder-workflow.component.html',
  styleUrl: './builder-workflow.component.scss'
})
export class BuilderWorkflowComponent implements OnInit {

  nextStepObservable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  videos$: Observable<VideoContextItem[]> = of([]);

  details$: Observable<StoryInfo>;

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

  scene$: Observable<Scene>;

  constructor(
    private videoService: VideoService,
    private detailsService: DetailsService,
    private sceneService: SceneService
  ) {}

  ngOnInit(): void {
    this.videos$ = this.videoService.getSelectedVideos$();
    this.details$ = this.detailsService.getDetails$();
    this.scene$ = this.sceneService.getScene$();
  }

  setDetails(details: DetailsFormModel) {
    const newPathName = details.title ? details.title?.trim().replace(' ', '-') : ''
    this.detailsService.setDetails({
      title: details.title?.trim() ?? '',
      description: details.description ?? '',
      path: newPathName
    })

    this.videoService.updateVideoPath(newPathName);
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
      case 1:
        this.nextStepObservable.next(!this.validateVideos());
        return this.validateVideos();
      case 2:
        this.nextStepObservable.next(!!this.sceneService.validateScene(this.sceneService.getScene()));
        return !this.sceneService.validateScene(this.sceneService.getScene());
      default:
        return true
    }
  }

  /**
   * returns true when valid
   */
  validateDetails(): boolean {
    return !!this.detailsService.getDetails().title && !!this.detailsService.getDetails().description;
  }

  /**
   * returns true when valid
   */
  validateVideos(): boolean {
    return this.videoService.getSelectedVideos().length > 0
  }

  setVideos(videos: VideoContextItem[]): void {
    this.videoService.addVideos(videos);
  }

  updateScene(scene: Scene): void {
    this.sceneService.setScene(scene);
  }
}
