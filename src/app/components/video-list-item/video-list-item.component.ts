import {Component, Input} from '@angular/core';
import {VideoContextItem} from "../../services/video.service";

@Component({
  selector: 'app-video-list-item',
  templateUrl: './video-list-item.component.html',
  styleUrl: './video-list-item.component.scss'
})
export class VideoListItemComponent {

  @Input()
  video: VideoContextItem;
}
