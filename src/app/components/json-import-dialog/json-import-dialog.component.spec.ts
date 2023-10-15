import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonImportDialogComponent } from './json-import-dialog.component';

describe('JsonImportDialogComponent', () => {
  let component: JsonImportDialogComponent;
  let fixture: ComponentFixture<JsonImportDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JsonImportDialogComponent]
    });
    fixture = TestBed.createComponent(JsonImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
