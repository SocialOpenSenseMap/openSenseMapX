import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
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
