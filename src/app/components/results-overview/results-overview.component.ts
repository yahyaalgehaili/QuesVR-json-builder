import {Component, Input, OnInit} from '@angular/core';
import {Scene, StoryInfo} from "../../models/scene.model";
import {VideoContextItem} from "../../services/video.service";
import {Observable, ReplaySubject} from "rxjs";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";

export interface FileContextItem {
  id: string;
  name: string;
  type: string;
}

@Component({
  selector: 'app-results-overview',
  templateUrl: './results-overview.component.html',
  styleUrl: './results-overview.component.scss'
})
export class ResultsOverviewComponent implements OnInit {

  @Input()
  details: StoryInfo;

  @Input()
  scene: Scene;

  @Input()
  videos: VideoContextItem[] = [];

  files: FileContextItem[] = [];

  displayedColumns: string[] = ['id', 'name', 'type'];

  dataSource= new FileDataSource(this.files);

  ngOnInit() {
    this.files = [
      {id: '1', name: 'story.json', type: 'JSON File'},
      {id: '2', name: 'storyInfo.json', type: 'JSON File'},
      {id: '3', name: 'thumbnail.jpg', type: 'JPG File'},
      ...this.videos.map((video) => ({
        id: video.id,
        name: video.name,
        type: 'MP4 File',
      }))
    ]
  }

  downloadConfigs(): void {
    this.downloadJson(this.details, 'storyInfo');
    this.downloadJson(this.scene, 'story');
  }

  getFileIcon(type: string): string {
    switch (type) {
      case 'MP4 File':
        return 'movie';
      case 'JSON File':
        return 'description';
      case 'JPG File':
        return 'image';
      default:
        return 'description';
    }
  }

  private downloadJson(jsonObject: any, fileName: string): void {
    const json = JSON.stringify(jsonObject);
    const uri = "data:text/json;charset=UTF-8," + encodeURIComponent(json);

    const element = document.createElement('a');
    element.setAttribute('href', uri);
    element.setAttribute('download', `${fileName}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}

class FileDataSource extends DataSource<FileContextItem> {
  private _dataStream = new ReplaySubject<FileContextItem[]>();

  constructor(initialData: FileContextItem[]) {
    super();
    this.setData(initialData);
  }

  override connect(collectionViewer: CollectionViewer): Observable<FileContextItem[]> {
    return this._dataStream;
  }

  override disconnect(collectionViewer: CollectionViewer) {
  }

  setData(data: FileContextItem[]) {
    this._dataStream.next(data);
  }
}

