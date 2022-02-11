import { ChangeDetectionStrategy,Component, OnInit, Input,ChangeDetectorRef, AfterViewInit, OnChanges , Pipe, PipeTransform } from '@angular/core';
import { NotificationsQuery } from 'src/app/models/notifications/state/notifications.query';
import { NotificationsService } from 'src/app/models/notifications/state/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'osem-profile-followed-boxes',
  templateUrl: './profile-followed-boxes.component.html',
  styleUrls: ['./profile-followed-boxes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProfileFollowedBoxesComponent implements OnInit {
    
  @Input() notificationRules;
  @Input () user;
  @Input() box;

  constructor(
    private notificationsQuery: NotificationsQuery, 
    private notificationsService: NotificationsService, 
    public router: Router,
    private changeDetector: ChangeDetectorRef,
    private http: HttpClient) { }

  dataSource: any [] = [];
  editField: string;
  idRule: string;
  confirm=false;
  create=false;
  connectRule=false;
  edition: any [] = [];
  unit;
  order: string = 'boxName';
  public searchText : string;
  public customerData : any;

  //Function for button to edit notification rule
  editableRule(index:number){
    for(let i=0; i <=this.dataSource.length; i++){
      if (i=index){this.edition.push  (true)}
      else{this.edition.push(false)}
    }
  }

  async updateValue(i:number, id:string, boxSensors: any, boxBox:string , boxName: string, boxActivationTrigger:string, boxActive: boolean, boxUser: string , event: any) {
    
    let e = (document.getElementById('sel-operators'+i)) as HTMLSelectElement;
    let operators = e.options[e.selectedIndex].text;
    let thresholds = document.getElementById('form-thresholds'+i);
    let f = document.getElementById('check-email'+i)
    let g = document.getElementById('check-active'+i);
    let notificationChannels = [];
    // @ts-ignore
    if(document.getElementById('check-email'+i).checked) {
      notificationChannels.push({
          "channel": "email", 
          "email": this.user.email
      })
    }
    boxActive=false;
    // @ts-ignore
    if(document.getElementById('check-active'+i).checked){
      boxActive=true;
    }
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
      notificationChannel:notificationChannels,
    })
    this.sleep(500);
    this.changeDetector.detectChanges();
  }
  
  reload(){
  window.location.reload();
  }

  async getUnit(data){
    //let e = (document.getElementById('sensor'+i)) as HTMLSelectElement;
    //let sensorIndex = sensor.value;
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer '+window.localStorage.getItem('sb_accesstoken'));
    // @ts-ignore
    let boxBox=this.data.box;
    this.box = await this.notificationsService.getBox(boxBox, headers);
    //console.log(this.box.sensors[0].unit);
    for(let i = 0; i < this.box.sensors.length; i++) {
      // @ts-ignore
      if (data.sensorName == this.box.sensors[i].title){
        return this.unit = this.box.sensors[i].unit;
      }else{
        return "no unit"
      }
    }
  }

  //Functions for filtering
  filterByName(){
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("table-rules");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  //Functions for deletetion of notification rule

  deleteItem(id:string) {
    this.confirm = true;
    this.idRule=id;
  }

  //Connect rule

  connectItem(id:string) {
    this.connectRule = true;
    this.idRule=id;
  }

  cancel() { 
    this.confirm=false;
    this.connectRule = false;
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


  async ngOnChanges(changes) {
    if(changes.notificationRules && typeof changes.notificationRules.currentValue != "undefined") {
      this.dataSource = changes.notificationRules.currentValue;
      this.unit = this.getUnit(this.dataSource);
    }
    // @ts-ignore
  }

  async ngOnInit(){
    await this.sleep(5000);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  init(): void {
    // init code.
  }
}