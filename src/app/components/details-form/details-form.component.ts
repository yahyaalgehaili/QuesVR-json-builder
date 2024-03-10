import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Observable} from "rxjs";

export interface DetailsFormModel {
  title?: string;
  description?: string;
}

@Component({
  selector: 'app-details-form',
  templateUrl: './details-form.component.html',
  styleUrl: './details-form.component.scss'
})
export class DetailsFormComponent implements OnInit {

  @Input()
  nextEvent: Observable<boolean>;

  @Input()
  details: DetailsFormModel;

  @Output()
  results: EventEmitter<DetailsFormModel> = new  EventEmitter<DetailsFormModel>();

  formGroup: FormGroup = new FormGroup<any>({
    title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(500)])
  });

  ngOnInit(): void {
    if (this.nextEvent) {
      this.nextEvent.subscribe((value: boolean) => {
        if (value) {
          this.formGroup.markAllAsTouched();
        }
      })
    }

    if (this.details) {
      this.formGroup.get('title')?.setValue(this.details.title, {emitEvent: false});
      this.formGroup.get('description')?.setValue(this.details.description, {emitEvent: false});
    }

    this.formGroup.valueChanges.subscribe(() => {
      this.results.emit(this.formGroup.value)
    });
  }

  getErrorKey(errors: ValidationErrors | null | undefined): string {
    if (errors) {
      return Object.keys(errors)[0];
    }
    return '';
  }
}
