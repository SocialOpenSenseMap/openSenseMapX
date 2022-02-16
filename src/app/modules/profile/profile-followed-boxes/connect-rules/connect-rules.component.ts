import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { BoxQuery } from 'src/app/models/box/state/box.query';
import { BoxService } from 'src/app/models/box/state/box.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NotificationsService } from 'src/app/models/notifications/state/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'osem-connect-rules',
  templateUrl: './connect-rules.component.html',
  styleUrls: ['./connect-rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectRulesComponent implements OnInit {

  @Input() activeRule;
  @Input() user;
  @Input() notificationRules;
  @Input() areNotificationsLoaded;
  sensorUnit;
  textForm;
  messageToUser;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private boxService: BoxService,
    private boxQuery: BoxQuery,
    public notificationsService: NotificationsService,
    public router: Router,
    private changeDetector: ChangeDetectorRef
  ) { }

  dataSource: any [] = [];

  async ngOnInit() {
    await this.sleep(5000);
    console.log(this.notificationRules);
  }

  async ngOnChanges(changes) {
    if (changes.user && typeof changes.user.currentValue != "undefined" && changes.user.currentValue != null) {
      this.notificationsService.getRulesAndConnectors();
      this.dataSource = changes.notificationRules.currentValue;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
