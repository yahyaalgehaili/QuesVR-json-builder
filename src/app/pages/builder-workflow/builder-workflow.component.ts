import {Component, OnInit} from '@angular/core';
import {Scene, StoryInfo} from "../../models/scene.model";
import {NavigationEvent, WizardStepList} from "../../components/wizard-steps/wizard-steps.component";
import {DetailsFormModel} from "../../components/details-form/details-form.component";
import {BehaviorSubject, Observable, of} from "rxjs";
import {VideoContextItem, VideoService} from "../../services/video.service";

@Component({
  selector: 'app-builder-workflow',
  templateUrl: './builder-workflow.component.html',
  styleUrl: './builder-workflow.component.scss'
})
export class BuilderWorkflowComponent implements OnInit {

  nextStepObservable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  videos$: Observable<VideoContextItem[]> = of([]);

  details: StoryInfo = {
    title: 'test',
    description: 'test',
    path: 'test'
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
    videos: []
  }

  constructor(private videoService: VideoService) {
  }

  ngOnInit(): void {
    this.videos$ = this.videoService.getSelectedVideos$();
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
      case 1:
        this.nextStepObservable.next(!this.validateVideos());
        return this.validateVideos();
      default:
        return true
    }
  }

  validateDetails(): boolean {
    return !!this.details.title && !!this.details.description;
  }

  validateVideos(): boolean {
    return this.videoService.getSelectedVideos().length > 0
  }

  setVideos(videos: VideoContextItem[]) {
    this.videoService.addVideos(videos);
  }
}
