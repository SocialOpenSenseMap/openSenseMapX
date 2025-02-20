import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { slideInOutMenu } from 'src/app/helper/animations';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'osem-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  animations: [slideInOutMenu],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavRightComponent implements OnInit {

  @Output() themeToggled = new EventEmitter();
  @Output() languageToggled = new EventEmitter();
  @Output() settingsToggled = new EventEmitter();
  @Output() clusteringToggled = new EventEmitter();

  @Input() theme;
  @Input() language;
  @Input() settings;
  @Input() user;
  @Input() unread;
  @Input() clustering;

  constructor(public router: Router) { }

  ngOnInit() {
  }

  toggleTheme(them){
    if(them === "light") {
      this.themeToggled.emit('dark');
    } else {
      this.themeToggled.emit('light');
    }
  }

  toggleLanguage(lang){
    if(lang === "de-DE") {
      this.languageToggled.emit('en-US');
    } else {
      this.languageToggled.emit('de-DE');
    }
  }

  toggleSettings(){
    this.settingsToggled.emit();
  }

  toggleClustering(){
    this.clusteringToggled.emit();
  }
}
