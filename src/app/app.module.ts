import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {HomeComponent} from './pages/home/home.component';
import {NgOptimizedImage} from '@angular/common';
import {BuilderComponent} from './components/builder/builder.component';
import {SceneTableComponent} from './components/scene-table/scene-table.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {VideoOptionComponent} from './components/video-option/video-option.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatDialogModule} from '@angular/material/dialog';
import {NgJsonEditorModule} from 'ang-jsoneditor';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {MatMenuModule} from "@angular/material/menu";
import {BuilderWorkflowComponent} from "./pages/builder-workflow/builder-workflow.component";
import {PanZoomComponent} from "ngx-panzoom";
import {BuilderToolbarComponent} from "./components/builder-toolbar/builder-toolbar.component";
import {WizardStepsComponent} from "./components/wizard-steps/wizard-steps.component";
import {DetailsFormComponent} from "./components/details-form/details-form.component";
import {MatInputModule} from "@angular/material/input";
import {VideoListComponent} from "./components/video-list/video-list.component";
import {MatTableModule} from "@angular/material/table";
import {DragDropDirective} from "./directives/drag-drop.directive";
import {UploadVideoFilesDialogComponent} from "./dialogs/upload-video-files-dialog/upload-video-files-dialog.component";
import {VideoListItemComponent} from "./components/video-list-item/video-list-item.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    DetailsFormComponent,
    BuilderWorkflowComponent,
    BuilderComponent,
    SceneTableComponent,
    VideoOptionComponent,
    VideoListComponent,
    VideoListItemComponent,
    UploadVideoFilesDialogComponent,
    DragDropDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    DragDropModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatIconModule,
    MatSidenavModule,
    FormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    ClipboardModule,
    MatDialogModule,
    NgJsonEditorModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatMenuModule,
    PanZoomComponent,
    BuilderToolbarComponent,
    WizardStepsComponent,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule
  ],
  providers: [],
  exports: [
    DragDropDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
