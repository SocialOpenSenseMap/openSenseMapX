import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { NotificationsStore } from './notifications.store';
import { NotificationsQuery } from './notifications.query';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  AUTH_API_URL = environment.api_url;
  websocket;

  constructor(
    private notificationsStore: NotificationsStore, 
    private notificationsQuery: NotificationsQuery, 
    private router: Router,
    private http: HttpClient) {

  }

  async getNotificationRules(){
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer '+window.localStorage.getItem('sb_accesstoken'));

    this.http.get(this.AUTH_API_URL + '/notification/notificationRule', {headers: headers}).subscribe(async (res:any) => {
      this.notificationsStore.set({});
      let notifications = [];
      for (let i = 0; i < res.data.length; i++) {
        let notificationRule = res.data[i];
        let box = await this.getBox(notificationRule.box, headers);
        for (let j = 0; j < notificationRule.notifications.length; j++) {
          let notification = notificationRule.notifications[j];
          let sensors = [];
          for ( let i = 0; i < notificationRule.sensors.length; i++) {
            // @ts-ignore
            sensors.push(box.sensors.find(sensor => sensor._id == notificationRule.sensors[i]))
          }
          notification = {
            ...notification,
            type: "threshold",
            activationOperator: notificationRule.activationOperator,
            activationThreshold: notificationRule.activationThreshold,
            ruleName: notificationRule.name,
            box: box,
            // @ts-ignore
            sensor: box.sensors.find(sensor => sensor._id = notificationRule.sensor)
          }
          notifications.push(notification)
        }
        res.data[i] = {
          ...notificationRule,
          // @ts-ignore
          boxName: box.name,
          // @ts-ignore
          boxExposure: box.exposure,
          // @ts-ignore
          sensorName: box.sensors.find(sensor => sensor._id = notificationRule.sensor),
          // @ts-ignore
          boxDate: box.updatedAt,
        }
      }
      notifications.sort((a,b) => b.notificationTime.localeCompare(a.notificationTime));
      this.notificationsStore.update(state => ({
        ...state,
        notifications: notifications,
        notificationRules: res.data,
        areNotificationsLoaded: true
      }));
      //this.initializeWebsocket()
    });
  }

  createNotificationRule(params, boxName, sensorTitle) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer '+window.localStorage.getItem('sb_accesstoken'));
    this.http.post(`${environment.api_url}/notification/notificationRule`, params, {headers: headers}).subscribe((res:any) => {
      var d = new Date();
      let newNotification = {
        type: "notification-rule",
        boxName: boxName,
        boxId: params.box,
        sensorTitle: sensorTitle,
        timeText: d.getDate() + "." + (d.getMonth()+1) + "." + (String(d.getFullYear()).slice(2,4)) + ", " + d.getHours() + ":" + d.getMinutes()
      };
      //@ts-ignore
      let currentRules = this.notificationsStore.store._value.state.notificationRules;
      let indexOfChanged = currentRules.findIndex(x => x._id === res.data._id);
      if (indexOfChanged >= 0) currentRules[indexOfChanged] = res.data;
      this.notificationsStore.update(state => ({
        ...state,
        notifications: (typeof state.notifications != "undefined") ? [newNotification].concat(state.notifications) : [newNotification],
        notificationRules: currentRules
      }));
      this.setNewNotification(newNotification);

      // websocket
      if (this.websocket) {
        console.log('subscribing to ', res.data._id)
        this.websocket.send('subscribe:'+res.data._id)
      }
    });
  }

  // this will be shown in the popup
  setNewNotification(newNotification) {
    this.notificationsStore.update(state => ({
      ...state,
      newNotification: newNotification
    }))
  }

  getBox(id, headers){
    // TODO: this should not be requested from the backend again. Maybe it is already saved in another model in the frontend
    return new Promise ((resolve, reject) => {
      this.http.get(this.AUTH_API_URL + '/boxes/' + id, {headers: headers}).subscribe((res:any) => {
        resolve(res)
      });
    })
  }

  updateNotificationRule(params) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer '+window.localStorage.getItem('sb_accesstoken'));
    this.http.put(`${environment.api_url}/notification/notificationRule/`+params.notificationRuleId, params, {headers: headers}).subscribe((res:any) => {
      //@ts-ignore
      let currentRules = this.notificationsStore.store._value.state.notificationRules;
      let indexOfChanged = currentRules.findIndex(x => x._id === res.data._id);
      if (indexOfChanged >= 0) currentRules[indexOfChanged] = res.data;
      this.notificationsStore.update(state => ({
        ...state,
        notificationRules: currentRules
      }));
    });
  }

  deleteNotificationRule(notificationRuleId) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer '+window.localStorage.getItem('sb_accesstoken'));
    this.http.delete(`${environment.api_url}/notification/notificationRule/`+notificationRuleId, {headers: headers}).subscribe((res:any) => {
      //@ts-ignore
      let currentRules = this.notificationsStore.store._value.state.notificationRules;
      let indexOfDeleted = currentRules.findIndex(x => x._id === res.data._id);
      if (indexOfDeleted >= 0) currentRules.splice(indexOfDeleted, 1);;
      this.notificationsStore.update(state => ({
        ...state,
        notificationRules: currentRules
      }));
    });
  }
}
