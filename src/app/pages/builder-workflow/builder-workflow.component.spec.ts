import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderWorkflowComponent } from './builder-workflow.component';

describe('BuilderWorkflowComponent', () => {
  let component: BuilderWorkflowComponent;
  let fixture: ComponentFixture<BuilderWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderWorkflowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuilderWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
