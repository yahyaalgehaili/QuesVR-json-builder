import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  languages: string[] = [];
  selectedLanguage: BehaviorSubject<string> = new BehaviorSubject<string>('en');

  constructor(
    private translateService: TranslateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.languages = this.translateService.getLangs();
    this.selectedLanguage.next(this.translateService.currentLang);
  }

  public setLanguage(language: string) {
    this.selectedLanguage.next(language);
    this.translateService.use(language);
  }

  public navigateToBuilder() {
    this.router.navigate(['builder']).then();
  }

  navigateToHome() {
    this.router.navigate(['']).then();
  }
}
