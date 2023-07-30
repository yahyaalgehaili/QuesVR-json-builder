import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  @Output()
  sidebarToggle: EventEmitter<boolean> = new EventEmitter<boolean>(true);

  toggledSidebar: boolean = false;

  toggleSidebar(): void {
    this.toggledSidebar = !this.toggledSidebar;
    this.sidebarToggle.emit(this.toggledSidebar);
  }



}
