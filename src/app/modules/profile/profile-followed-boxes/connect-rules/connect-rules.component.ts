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

  @Input() activeBox;
  @Input() user;
  @Input() notificationRules;
  @Input() areNotificationsLoaded;
  @Input() ruleId;
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
  public searchText : string;
  order: string = 'boxName';

  async ngOnInit() {
    await this.sleep(5000);
    console.log(this.ruleId);
  }

  async ngOnChanges(changes) {
    if (changes.notificationRules && typeof changes.notificationRules.currentValue != "undefined" && changes.notificationRules.currentValue != null) {
      this.dataSource = changes.notificationRules.currentValue;
    }
  }

  createConnection(i:number, id:string, ruleA: string, ruleB: string, active: boolean){
    let e = (document.getElementById('sel-connectors'+i)) as HTMLSelectElement;
    let operators = e.options[e.selectedIndex].text;
    active=false;
    // @ts-ignore
    if(document.getElementById('check-active'+i).checked){
      active=true;
    }
    this.notificationsService.updateConnector(id, ruleA, ruleB, operators, active)
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
