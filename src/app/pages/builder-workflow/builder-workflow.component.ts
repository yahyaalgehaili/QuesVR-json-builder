import {Component, OnInit} from '@angular/core';
import {Scene, StoryInfo} from "../../models/scene.model";
import {NavigationEvent, WizardStepList} from "../../components/wizard-steps/wizard-steps.component";
import {DetailsFormModel} from "../../components/details-form/details-form.component";
import {BehaviorSubject, Observable, of} from "rxjs";
import {VideoContextItem, VideoService} from "../../services/video.service";
import {DetailsService} from "../../services/details.service";
import {SceneService, ValidationModel} from "../../services/scene.service";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-builder-workflow',
  templateUrl: './builder-workflow.component.html',
  styleUrl: './builder-workflow.component.scss'
})
export class BuilderWorkflowComponent implements OnInit {

  nextStepObservable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  videos$: Observable<VideoContextItem[]> = of([]);

  details$: Observable<StoryInfo>;

  workflowSteps: WizardStepList;

  scene$: Observable<Scene>;

  constructor(
    private videoService: VideoService,
    private detailsService: DetailsService,
    private translateService: TranslateService,
    private sceneService: SceneService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.workflowSteps = {
      activeStep: 0,
      steps: [
        {
          id: 'details',
          invalid: false,
          label: this.translateService.instant('WIZARD_STEPS.DETAILS'),
          visited: false,
        },
        {
          id: 'videos',
          invalid: false,
          label: this.translateService.instant('WIZARD_STEPS.VIDEOS'),
          visited: false,
        },
        {
          id: 'editor',
          invalid: false,
          label: this.translateService.instant('WIZARD_STEPS.EDITOR'),
          visited: false,
        },
        {
          id: 'preview',
          invalid: false,
          label: this.translateService.instant('WIZARD_STEPS.PREVIEW'),
          visited: false,
        },
      ]
    }
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
        const sceneValidation: ValidationModel | null = this.sceneService.validateScene(this.sceneService.getScene());
        if (sceneValidation?.translationString) {
          this.snackbar.open(this.translateService.instant(sceneValidation?.translationString, {id: sceneValidation.id}),
            undefined ,
            {duration: 5000});
        }
        return !sceneValidation;
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
