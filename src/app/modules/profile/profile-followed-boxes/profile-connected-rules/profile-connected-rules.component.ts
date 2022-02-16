import { ChangeDetectionStrategy,Component, OnInit, Input,ChangeDetectorRef, AfterViewInit, OnChanges , Pipe, PipeTransform } from '@angular/core';
import { NotificationsQuery } from 'src/app/models/notifications/state/notifications.query';
import { NotificationsService } from 'src/app/models/notifications/state/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'osem-profile-connected-rules',
  templateUrl: './profile-connected-rules.component.html',
  styleUrls: ['./../profile-followed-boxes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileConnectedRulesComponent implements OnInit {

  @Input() notificationRules;
  @Input() notificationConnectors;
  @Input() user;
  @Input() box;
  
  constructor(
    private notificationsQuery: NotificationsQuery, 
    private notificationsService: NotificationsService, 
    public router: Router,
    private changeDetector: ChangeDetectorRef,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) { }

  dataSource: any [] = [];
  idRule: string;
  confirm=false;
  

  //Functions for deleetion of connection

  deleteItem(id:string) {
    this.confirm = true;
    this.idRule=id;
  }

  cancel() { 
    this.confirm=false;
  }

  remove(id:string) { //TODO Need function for deleting connection and update
    //this.notificationsService.deleteNotificationRule(id);
    
    this.confirm=false;
    this.reload();
  }

  reload(){
    window.location.reload();
  }


  async ngOnChanges(changes) {
    if(changes.notificationConnectors && typeof changes.notificationConnectors.currentValue != "undefined") {
      this.dataSource = changes.notificationConnectors.currentValue;
    }
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
