import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UiQuery } from 'src/app/models/ui/state/ui.query';
import { BoxService } from 'src/app/models/box/state/box.service';
import { BoxQuery } from 'src/app/models/box/state/box.query';
import { SessionQuery } from 'src/app/models/session/state/session.query';
import { ActivatedRoute } from '@angular/router';
import { NotificationsQuery } from 'src/app/models/notifications/state/notifications.query';

@Component({
  selector: 'osem-box-follow-container',
  templateUrl: './box-follow-container.component.html',
  styleUrls: ['./box-follow-container.component.scss']
})
export class BoxFollowContainerComponent implements OnInit {

  activeBox$: Observable<any>;
  user$ = this.sessionQuery.user$;
  notificationRules$ = this.notificationsQuery.notificationRules$;
  areNotificationsLoaded$ = this.notificationsQuery.areNotificationsLoaded$;

  constructor(
    private uiQuery: UiQuery, 
    private activatedRoute: ActivatedRoute,
    private boxService: BoxService,
    private boxQuery: BoxQuery,
    private sessionQuery: SessionQuery,
    private notificationsQuery: NotificationsQuery) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(res => {
      this.boxService.getSingleBox(res.boxId).subscribe();
      this.boxService.setActive(res.boxId);
      this.activeBox$ = this.boxQuery.selectActiveWithSensorAndUI();
    });
  }

  

}
