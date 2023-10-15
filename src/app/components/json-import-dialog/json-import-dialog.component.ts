import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {JsonEditorOptions} from 'ang-jsoneditor';
import {FormBuilder, FormGroup} from '@angular/forms';
import {VIDEO_FORMATS} from '../../models/scene.model';

@Component({
  selector: 'app-json-import-dialog',
  templateUrl: './json-import-dialog.component.html',
  styleUrls: ['./json-import-dialog.component.scss']
})
export class JsonImportDialogComponent implements OnInit{
  public editorOptions: JsonEditorOptions;
  userJson: any = {
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
      }
    ]
  };

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<JsonImportDialogComponent>,
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code'
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
    this.editorOptions.mainMenuBar = true;
    this.editorOptions.templates = {
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
        }
      ]
    };

    this.form = this.formBuilder.group({
      jsonInput: [this.userJson]
    })
  }

  cancel() {
    this.dialogRef.close();
  }

  updateJson(json: any) {
    this.userJson = json;

    // todo: validate this json with the right interface.
  }
}
