import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NotificationsService } from 'src/app/models/notifications/state/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BoxQuery } from 'src/app/models/box/state/box.query';
import { BoxService } from 'src/app/models/box/state/box.service';
import { SensorService } from 'src/app/models/sensor/state/sensor.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UiService } from 'src/app/models/ui/state/ui.service';

@Component({
  selector: 'osem-box-connect-form',
  templateUrl: './box-connect-form.component.html',
  styleUrls: ['./box-connect-form.component.scss']
})
export class BoxConnectFormComponent implements OnInit {

  @Input() activeBox;
  @Input() user;
  @Input() notificationRules;
  @Input() areNotificationsLoaded;
  sensorUnitConnect;
  textFormConnect;
  showAddConnect: boolean;
  subscription: Subscription;
  clickEventSubscription: Subscription;
  connectorOptions = ["and", "or", "xor"];
  connector;


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
      this.clickEventSubscription = this.uiService.getClickEvent().subscribe(()=> {this.sendNotificationB()})
     }

  ngOnInit() { 
  }

  async getConnector(){
    if (this.showAddConnect){
      let _e = (document.getElementById("form-connector-connect")) as HTMLSelectElement;
      let _sel = _e.selectedIndex;
      let _opt = _e.options[_sel];
      this.connector = (<HTMLSelectElement><unknown>_opt).textContent;
    }
  }

  async sendNotificationB(){

    // get input elements of the form B
    let sensorsB = document.getElementById("form-sensors-connect");
    let operatorsB = document.getElementById("form-operators-connect");
    let thresholdsB = document.getElementById("form-thresholds-connect");

    if (this.showAddConnect && sensorsB && operatorsB && thresholdsB) {
      // create a notification rule for B
      this.notificationsService.createNotificationRule({
        // @ts-ignore
        sensors: [sensorsB.value],
        box: this.activeBox._id,
        name: "bRule",
        // @ts-ignore
        activationThreshold: thresholdsB.value,
        // @ts-ignore
        activationOperator: operatorsB.value,
        activationTrigger: "any",
        active: true,
        notificationChannel: [],
        // @ts-ignore
      }, this.activeBox.name, sensorsB.options[sensorsB.selectedIndex].text)
    }
  }

  selectedConnect(){
    let e = (document.getElementById("form-sensors-connect")) as HTMLSelectElement;
    let sel = e.selectedIndex;
    let opt = e.options[sel];
    let chosenSensor = (<HTMLSelectElement><unknown>opt).textContent;
    let boxSensors = this.activeBox.sensors;
    for(let i = 0; i < boxSensors.length; i++) {
      if (chosenSensor == boxSensors[i].title){
        this.sensorUnitConnect = boxSensors[i].unit;
        this.textFormConnect = "Value in " + this.sensorUnitConnect;
      }
    }
  }
}
