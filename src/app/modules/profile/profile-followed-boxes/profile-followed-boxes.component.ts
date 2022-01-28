import { Component, OnInit, Input } from '@angular/core';
import { NotificationsQuery } from 'src/app/models/notifications/state/notifications.query';
import { NotificationsService } from 'src/app/models/notifications/state/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'osem-profile-followed-boxes',
    templateUrl: './profile-followed-boxes.component.html',
    styleUrls: ['./profile-followed-boxes.component.scss'],
})

export class ProfileFollowedBoxesComponent implements OnInit {
    
  @Input() notificationRules;
  @Input () user;

  constructor(private notificationsQuery: NotificationsQuery, private notificationsService: NotificationsService, public router: Router) { }
  dataSource: any [] = [];
  editField: string;
  idRule: string;
  confirm=false;
  create=false;

  //Function for button to edit notification rule

  updateValue(i:number, id:string, boxSensors: any, boxBox:string , boxName: string, boxActivationTrigger:string, boxActive: boolean, boxUser: string , boxNotCha:any, event: any) {
    let e = (document.getElementById('sel-operators'+i)) as HTMLSelectElement;
    let operators = e.options[e.selectedIndex].text;
    let thresholds = document.getElementById('form-thresholds'+i);
    let f = document.getElementById("check-email"); //TODO: Getting notification by email option
    console.log(thresholds);
    this.notificationsService.updateNotificationRule({
      notificationRuleId:id,
      sensors:boxSensors,
      box:boxBox,
      name:boxName,
      // @ts-ignore
      activationThreshold: thresholds.value,
      activationOperator: operators,
      activationTrigger:boxActivationTrigger,
      active:boxActive,
      user:boxUser,
      notificationChannel:boxNotCha,
    })
    this.reload();
  }
  
  reload(){
  window.location.reload();
  }

  //Functions for deletetion of notification rule

  selectItem(id:string) {
    this.confirm = true;
    this.idRule=id;
  }

  cancel() { 
    this.confirm=false;
  }

  remove(id:string) {
    this.notificationsService.deleteNotificationRule(id);
    this.confirm=false;
    this.reload();
  }

  //Functions for adding
  addRule() { 
    this.create=true;
  }

  boxFollow(id:string){
    this.router.navigateByUrl('/(modal:follow-box)?boxId='+id)
  }


  ngOnChanges(changes) {
    if(changes.notificationRules && typeof changes.notificationRules.currentValue != "undefined") {
        this.dataSource = changes.notificationRules.currentValue;
    }
  }

  ngOnInit(): void {
      
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngAfterViewInit(): void {
    // afterViewInit code.
    this.init();
  }

  init(): void {
    // init code.
  }
}