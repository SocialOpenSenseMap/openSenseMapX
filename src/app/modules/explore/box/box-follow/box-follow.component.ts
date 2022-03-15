import { ChangeDetectionStrategy, Component, Input, Output, OnInit, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NotificationsService } from 'src/app/models/notifications/state/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BoxQuery } from 'src/app/models/box/state/box.query';
import { BoxService } from 'src/app/models/box/state/box.service';
import { UiService } from 'src/app/models/ui/state/ui.service';

@Component({
  selector: 'osem-box-follow',
  templateUrl: './box-follow.component.html',
  styleUrls: ['./box-follow.component.scss'],
})
export class BoxFollowComponent implements OnInit {

  @Input() activeBox;
  @Input() user;
  @Input() notificationRules;
  @Input() areNotificationsLoaded;
  sensorUnit;
  textForm;
  showAddConnect: boolean = false;
  subscription: Subscription;
  clickObservable: Observable<Event> = fromEvent(document,'click');
  aRule;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private boxService: BoxService,
    private boxQuery: BoxQuery,
    public notificationsService: NotificationsService,
    public router: Router,
    private changeDetector: ChangeDetectorRef,
    private uiService: UiService) {
      this.subscription = this.uiService.onToggle().subscribe((value) => (this.showAddConnect = value));
    }

  ngOnInit() {
    this.observeClick();
  }

  async ngOnChanges(changes) {
    if (changes.user && typeof changes.user.currentValue != "undefined" && changes.user.currentValue != null) {
      this.notificationsService.getRulesAndConnectors();
    }
  }

  async sendNotification() {

    if (this.showAddConnect){
      this.uiService.sendClickEvent();
    }
    
    // get input elements of the form A
    let sensors = document.getElementById("form-sensors");
    let operators = document.getElementById("form-operators");
    let thresholds = document.getElementById("form-thresholds");
    let email = document.getElementById("form-email");

    if (sensors && operators && thresholds && email) {
      let notificationChannels = [];
      // @ts-ignore
      if(email.checked) {
        notificationChannels.push({
            "channel": "email", 
            "email": this.user.email
        })
      }
      // create a notification rule for A
      this.aRule = this.notificationsService.createNotificationRule({
        // @ts-ignore
        sensors: [sensors.value],
        box: this.activeBox._id,
        name: "aRule",
        // @ts-ignore
        activationThreshold: thresholds.value,
        // @ts-ignore
        activationOperator: operators.value,
        activationTrigger: "any",
        active: true,
        notificationChannel: notificationChannels
        // @ts-ignore
      }, this.activeBox.name, sensors.options[sensors.selectedIndex].text)
    }
    this.changeDetector.detectChanges(); 
  }

  selected(){
    let e = (document.getElementById("form-sensors")) as HTMLSelectElement;
    let sel = e.selectedIndex;
    let opt = e.options[sel];
    let chosenSensor = (<HTMLSelectElement><unknown>opt).textContent;
    let boxSensors = this.activeBox.sensors;
    for(let i = 0; i < boxSensors.length; i++) {
      if (chosenSensor == boxSensors[i].title){
        this.sensorUnit = boxSensors[i].unit;
        this.textForm = "Value in " + this.sensorUnit
      }
    }
  }

  configCenter(){
    this.router.navigate(
      [{ outlets: { sidebar: ['m','profile','fbox'] }}]
    )
  }

  toggleAddConnect(){
    this.uiService.toggleAddConnect();
  }

  observeClick() {
    this.clickObservable.subscribe(() => { if (this.notificationsService.messageAppears == true) { 
      this.notificationsService.messageAppears = false;
      }
  })}
}



  