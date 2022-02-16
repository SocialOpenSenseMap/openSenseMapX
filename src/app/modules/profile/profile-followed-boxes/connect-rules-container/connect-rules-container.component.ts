import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UiQuery } from 'src/app/models/ui/state/ui.query';
import { UiService } from 'src/app/models/ui/state/ui.service';
import { ActivatedRoute } from '@angular/router';
import { BoxService } from 'src/app/models/box/state/box.service';
import { BoxQuery } from 'src/app/models/box/state/box.query';
import { SessionQuery } from 'src/app/models/session/state/session.query';
import { NotificationsQuery } from 'src/app/models/notifications/state/notifications.query';
import { NotificationsService } from 'src/app/models/notifications/state/notifications.service';

@Component({
  selector: 'osem-connect-rules-container',
  templateUrl: './connect-rules-container.component.html',
  styleUrls: ['./connect-rules-container.component.scss']
})
export class ConnectRulesContainerComponent implements OnInit {

  activeRule$: Observable<any>;
  user$ = this.sessionQuery.user$;
  notificationRules$ = this.notificationsQuery.notificationRules$;
  areNotificationsLoaded$ = this.notificationsQuery.areNotificationsLoaded$;

  constructor(
    private uiQuery: UiQuery, 
    private uiSerivce: UiService,
    private activatedRoute: ActivatedRoute,
    private boxService: BoxService,
    private notificationService: NotificationsService,
    private boxQuery: BoxQuery,
    private sessionQuery: SessionQuery,
    private notificationsQuery: NotificationsQuery) { }

  ngOnInit() {
    /**this.activatedRoute.queryParams.subscribe(res => {
      this.boxService.getSingleBox(res.ruleId).subscribe();
      this.boxService.setActive(res.ruleId);
      this.activeRule$ = this.boxQuery.selectActiveWithSensorAndUI();
    });**/
    this.activatedRoute.queryParams.subscribe(res => {
      this.notificationService.getSingleRule(res.boxId, res.ruleId);
    });
  }

}
