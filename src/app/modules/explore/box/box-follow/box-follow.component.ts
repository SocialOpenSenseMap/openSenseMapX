import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NotificationsService } from 'src/app/models/notifications/state/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BoxQuery } from 'src/app/models/box/state/box.query';
import { BoxService } from 'src/app/models/box/state/box.service';
import { SensorService } from 'src/app/models/sensor/state/sensor.service';
import { HttpErrorResponse } from '@angular/common/http';
import { sensorIcons } from 'src/app/helper/sensorIcons';

@Component({
  selector: 'osem-box-follow',
  templateUrl: './box-follow.component.html',
  styleUrls: ['./box-follow.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxFollowComponent implements OnInit {

  @Input() activeBox;
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
    private changeDetector: ChangeDetectorRef) {}


  async ngOnInit() {
    this.notificationsService.messageToUser = "message appers here";
    await this.sleep(5000);
    console.log(this.notificationRules);
  }

  async ngOnChanges(changes) {
    if (changes.user && typeof changes.user.currentValue != "undefined" && changes.user.currentValue != null) {
      this.notificationsService.getRulesAndConnectors();
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendNotification() {
    // get input elements of the form
    let sensors = (<HTMLSelectElement>document.getElementById("form-sensors"));
    let operators = (<HTMLSelectElement>document.getElementById("form-operators"));
    let thresholds = (<HTMLInputElement>document.getElementById("form-thresholds"));
    let email = (<HTMLInputElement>document.getElementById("form-email"));
    // check if the input elements have been found and if they have values
    if (sensors && operators && thresholds && email
      && sensors.value != "" && operators.value != "" && thresholds.value != "" && email.value != "") {
      let notificationChannels = [];
      if(email.checked) {
        notificationChannels.push({
            "channel": "email", 
            "email": this.user.email
        })
      }
      // create a notification rule
      this.notificationsService.createNotificationRule({
        sensors: [sensors.value],
        box: this.activeBox._id,
        name: "aRule",
        activationThreshold: thresholds.value,
        activationOperator: operators.value,
        activationTrigger: "any",
        active: true,
        notificationChannel: notificationChannels
      }, this.activeBox.name, sensors.options[sensors.selectedIndex].text)
    }
    this.sleep(500);
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
}
