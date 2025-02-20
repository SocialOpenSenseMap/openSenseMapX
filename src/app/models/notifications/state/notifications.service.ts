import { Injectable, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { ID } from '@datorama/akita';
import { NotificationsStore } from './notifications.store';
import { NotificationsQuery } from './notifications.query';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  AUTH_API_URL = environment.api_url;

  public postError: EventEmitter<HttpErrorResponse> = new EventEmitter<HttpErrorResponse>();
  public messageToUser: string;
  public messageAppears: boolean = false;
  
  websocket;

  constructor(
    private notificationsStore: NotificationsStore,
    private notificationsQuery: NotificationsQuery,
    private router: Router,
    private http: HttpClient
    ) { }

  async getRulesAndConnectors(){
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer '+window.localStorage.getItem('sb_accesstoken'));

    this.http.get(this.AUTH_API_URL + '/notification/notificationRule', {headers: headers}).subscribe(async (res:any) => {
      let notificationRules = res.data;
      this.notificationsStore.set({});
      let notifications = [];
      for (let i = 0; i < notificationRules.length; i++) {
        try {
          let notificationRule = notificationRules[i];
          let box = await this.getBox(notificationRule.box, headers) as {
            sensors: Array<any>,
            name: string,
            exposure: string,
            updatedAt: string
          };
          let sensors = [];
          for ( let i = 0; i < notificationRule.sensors.length; i++) {
            sensors.push(box.sensors.find(sensor => sensor._id == notificationRule.sensors[i]))
          }
          notificationRules[i] = {
            ...notificationRule,
            boxWhole:box,
            boxName: box.name,
            boxExposure: box.exposure,
            //TODO: a notificationRule could theoretically have more than one sensor, but Im not sure if we care about that...
            sensorName: sensors[0].title,
            sensorWhole: sensors[0],
            boxDate: box.updatedAt,
          }
          for (let j = 0; j < notificationRule.notifications.length; j++) {
            let notification = notificationRule.notifications[j];
            notification = {
              ...notification,
              timeText: moment(notification.notificationTime).format("DD.MM.YYYY, HH:mm"),
              type: "threshold",
              activationOperator: notificationRule.activationOperator,
              activationThreshold: notificationRule.activationThreshold,
              ruleName: notificationRule.name,
              box: box,
              sensors: sensors
            }
            notifications.push(notification)
          }
        } catch(e) {
          console.error(e);
          notificationRules.splice(i, 1);
          i--;
        }
      }
      notifications.sort((a,b) => b.notificationTime.localeCompare(a.notificationTime));
      this.notificationsStore.update(state => ({
        ...state,
        notifications: notifications,
        notificationRules: notificationRules,
        areNotificationsLoaded: true
      }));

      // get all teh connectors and their notifications and add them to the store
      this.http.get(this.AUTH_API_URL + '/notification/notificationRule/connects', {headers: headers}).subscribe(async (res:any) => {

        let notifications = [];
        for (let i = 0; i < res.data.length; i++) {
          try {
            let notificationConnector = res.data[i];
            let ruleA = notificationRules.find(rule => rule._id == notificationConnector.ruleA)
            let ruleB = notificationRules.find(rule => rule._id == notificationConnector.ruleB)
            for (let j = 0; j < notificationConnector.notifications.length; j++) {
              let notification = notificationConnector.notifications[j];
              notification = {
                ...notification,
                timeText: moment(notification.notificationTime).format("DD.MM.YYYY, HH:mm"),
                type: "connector",
                connectionOperator: notificationConnector.connectionOperator,
                ruleName: notificationConnector.name,
                boxA: ruleA.boxWhole,
                sensorsA: [ruleA.sensorWhole],
                activationOperatorA: ruleA.activationOperator,
                activationThresholdA: ruleA.activationThreshold,
                boxB: ruleB.boxWhole,
                sensorsB: [ruleB.sensorWhole],
                activationOperatorB: ruleB.activationOperator,
                activationThresholdB: ruleB.activationThreshold
              }
              notifications.push(notification)
            }
            res.data[i] = {
              ...res.data[i],
              boxWholeA: ruleA.boxWhole,
              boxNameA: ruleA.boxWhole.name,
              boxExposureA: ruleA.boxWhole.exposure,
              //TODO: a notificationRule could theoretically have more than one sensor, but Im not sure if we care about that...
              sensorNameA: ruleA.sensorWhole.title,
              sensorWholeA: ruleA.sensorWhole,
              boxDateA: ruleA.boxWhole.updatedAt,
              boxWholeB: ruleB.boxWhole,
              boxNameB: ruleB.boxWhole.name,
              boxExposureB: ruleB.boxWhole.exposure,
              //TODO: a notificationRule could theoretically have more than one sensor, but Im not sure if we care about that...
              sensorNameB: ruleB.sensorWhole.title,
              sensorWholeB: ruleB.sensorWhole,
              boxDateB: ruleB.boxWhole.updatedAt,
            }
          } catch(e) {
            console.error(e);
            res.data.splice(i, 1);
            i--;
          }
        }
        this.notificationsStore.update(state => {
          notifications = notifications.concat(state.notifications)
          notifications.sort((a,b) => b.notificationTime.localeCompare(a.notificationTime));
          return {
            ...state,
            notifications: notifications,
            notificationConnectors: res.data,
            areNotificationsLoaded: true
          }
        });
        // after everything loaded initialize the websocket
        this.initializeWebsocket()
      });
    });
  }

  getSingleRule(idBox, idRule){
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer '+window.localStorage.getItem('sb_accesstoken'));
    this.http.get(this.AUTH_API_URL + `/notification/notificationRule/${idBox}/${idRule}`, {headers: headers}).subscribe(async (res:any)=> {
      let rule = res.data;
      rule = {
        "_id": "61ead7e3aad37d5f841028ad",
        box: rule.box,
        name: rule.name,
        activationThreshold: rule.activationThreshold,
        activationOperator: rule.activationOperator,
        /**"connected": [
            "6203cea8548b862fb8f459b3",
            "620683f7e2ba7651f05ff301"
        ],**/
        /**"notificationChannel": [
            {
                "email": "jfranco@uni-muenster.de",
                "channel": "email",
                "_id": "6200eac73030ba1da0762652"
            }
        ],**/
        activationTrigger: rule.activator,
        /**"sensors": [
            "61ead682aad37d5f841028ac"
        ]**/
      }
    });
  }

  async createNotificationRule(params, boxName, sensorTitle) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer '+window.localStorage.getItem('sb_accesstoken'));
    this.http.post(`${environment.api_url}/notification/notificationRule`, params, {headers: headers})
      .pipe(catchError(err => {
        if (err.status == 422) {
          this.messageToUser = "Fill all the boxes.";
        } else if (err.status == 500) {
          this.messageToUser = "Rule already exists."
        } else {
          this.messageToUser = "Something unexpected happened. Try again.";
        }
        this.messageAppears = true;
        throw 'An error occurred: ' + err;
      }))
      .subscribe(async (res:any) => {
      var d = new Date();
      // give a notification that a rule was created
      let newNotification = {
        type: "notification-rule",
        boxName: boxName,
        boxId: params.box,
        sensorTitle: sensorTitle,
        timeText: d.getDate() + "." + (d.getMonth()+1) + "." + (String(d.getFullYear()).slice(2,4)) + ", " + d.getHours() + ":" + d.getMinutes()
      };
      // update the notification rules
      let box = await this.getBox(res.data.box, headers) as {
        sensors: Array<any>,
        name: string,
        exposure: string,
        updatedAt: string
      };
      res.data = {
        ...res.data,
        boxName: box.name,
        boxExposure: box.exposure,
        //TODO: a notificationRule could theoretically have more than one sensor, but Im not sure if we care about that...
        sensorName: box.sensors.find(sensor => sensor._id == res.data.sensors[0]).title,
        boxDate: box.updatedAt,
      }
      this.notificationsStore.update(state => ({
        ...state,
        unread: true,
        notifications: (typeof state.notifications != "undefined") ? [newNotification].concat(state.notifications) : [newNotification],
        notificationRules: [res.data].concat(state.notificationRules)
      }));

      // websocket
      if (this.websocket) {
        this.websocket.send('subscribe:'+res.data._id)
      }
    });
  }

  /**
   * To connect notification rules
   * @param ruleA - this should be the entire rule
   * @param ruleB - this should be the entire rule
   * @param operator - "and", "or" or "xor"
   */
  async connectRules(ruleA,ruleB,operator, active) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer '+window.localStorage.getItem('sb_accesstoken'));
    let params = {
      name: "connectorAB",
      ruleA: ruleA._id.toString(),
      ruleB: ruleB._id.toString(),
      connectionOperator: operator,
      active: active
    }
    this.http.post(`${environment.api_url}/notification/notificationRule/connect`, params, {headers: headers})
    .pipe(catchError(err => {
      if (err.status == 422) {
        this.messageToUser = "Fill all the boxes.";
      } else if (err.status == 500) {
        this.messageToUser = "Rule already exists."
      } else {
        this.messageToUser = "Something unexpected happened. Try again.";
      }
      this.messageAppears = true;
      throw 'An error occurred: ' + err;
    }))
    .subscribe(async (res:any) => { 
      var d = new Date();
      // give a notification that a rule was created
      let newNotification = {
        type: "rule-connector-created",
        ruleA: ruleA._id,
        ruleB: ruleA._id,
        timeText: d.getDate() + "." + (d.getMonth()+1) + "." + (String(d.getFullYear()).slice(2,4)) + ", " + d.getHours() + ":" + d.getMinutes()
      };
      // update the notification rules
      res.data = {
        ...res.data,
        boxWholeA: ruleA.boxWhole,
        boxNameA: ruleA.boxWhole.name,
        boxExposureA: ruleA.boxWhole.exposure,
        //TODO: a notificationRule could theoretically have more than one sensor, but Im not sure if we care about that...
        sensorNameA: ruleA.sensorWhole.title,
        sensorWholeA: ruleA.sensorWhole,
        boxDateA: ruleA.boxWhole.updatedAt,
        boxWholeB: ruleB.boxWhole,
        boxNameB: ruleB.boxWhole.name,
        boxExposureB: ruleB.boxWhole.exposure,
        //TODO: a notificationRule could theoretically have more than one sensor, but Im not sure if we care about that...
        sensorNameB: ruleB.sensorWhole.title,
        sensorWholeB: ruleB.sensorWhole,
        boxDateB: ruleB.boxWhole.updatedAt,
      }
      this.notificationsStore.update(state => ({
        ...state,
        notifications: (typeof state.notifications != "undefined") ? [newNotification].concat(state.notifications) : [newNotification],
        notificationConnectors: [res.data].concat(state.notificationRules)
      }));
      // websocket
      if (this.websocket) {
        this.websocket.send('subscribe:'+res.data._id)
      }
    });
  }

  /**
   * To update notification rule connectors
   * @param connectorId - this should be id of the connector
   * @param ruleA - this should be the entire rule
   * @param ruleB - this should be the entire rule
   * @param operator - "and", "or" or "xor"
   */
  updateConnector(connectorId, ruleA, ruleB, operator, active) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer '+window.localStorage.getItem('sb_accesstoken'));
    let params = {
      name: "connectorAB",
      ruleA: ruleA._id.toString(),
      ruleB: ruleB._id.toString(),
      connectionOperator: operator,
      active: active
    }
    this.http.put(`${environment.api_url}/notification/notificationRule/connect/`+connectorId, params, {headers: headers}).subscribe(async (res:any) => {
      res.data = {
        ...res.data,
        boxWholeA: ruleA.boxWhole,
        boxNameA: ruleA.boxWhole.name,
        boxExposureA: ruleA.boxWhole.exposure,
        sensorNameA: ruleA.sensorWhole.title,
        sensorWholeA: ruleA.sensorWhole,
        boxDateA: ruleA.boxWhole.updatedAt,
        boxWholeB: ruleB.boxWhole,
        boxNameB: ruleB.boxWhole.name,
        boxExposureB: ruleB.boxWhole.exposure,
        sensorNameB: ruleB.sensorWhole.title,
        sensorWholeB: ruleB.sensorWhole,
        boxDateB: ruleB.boxWhole.updatedAt,
      }
      this.notificationsStore.update(state => {
        let currentConnectors = state.notificationConnectors;
        let indexOfChanged = currentConnectors.findIndex(x => x._id === res.data._id);
        if (indexOfChanged >= 0) currentConnectors[indexOfChanged] = res.data;
        return {
          ...state,
          notificationConnectors: currentConnectors
        }
      });
    });
  }

  /**
   * To delete a notification rule connector
   * @param connectorId - id of the connector
   */
  deleteConnector(connectorId) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer '+window.localStorage.getItem('sb_accesstoken'));
    this.http.delete(`${environment.api_url}/notification/notificationRule/connect/`+connectorId, {headers: headers}).subscribe((res:any) => {
      this.notificationsStore.update(state => {
        let currentConnectors = state.notificationConnectors;
        let indexOfDeleted = currentConnectors.findIndex(x => x._id === res.data._id);
        if (indexOfDeleted >= 0) currentConnectors.splice(indexOfDeleted, 1);
        return {
          ...state,
          notificationRules: currentConnectors
        }
      });
    });
  }

  updateNotificationRule(params) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer '+window.localStorage.getItem('sb_accesstoken'));
    this.http.put(`${environment.api_url}/notification/notificationRule/`+params.notificationRuleId, params, {headers: headers}).subscribe(async (res:any) => {
      // update the notification rules
      let box = await this.getBox(res.data.box, headers) as {
        sensors: Array<any>,
        name: string,
        exposure: string,
        updatedAt: string
      };
      res.data = {
        ...res.data,
        boxName: box.name,
        boxExposure: box.exposure, 
        //TODO: a notificationRule could theoretically have more than one sensor, but Im not sure if we care about that...
        sensorName: box.sensors.find(sensor => sensor._id == res.data.sensors[0]).title,
        boxDate: box.updatedAt,
      }
      this.notificationsStore.update(state => {
        let currentRules = state.notificationRules;
        let indexOfChanged = currentRules.findIndex(x => x._id === res.data._id);
        if (indexOfChanged >= 0) currentRules[indexOfChanged] = res.data;
        return {
          ...state,
          notificationRules: currentRules
        }
      });
    });
  }

  deleteNotificationRule(notificationRuleId) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer '+window.localStorage.getItem('sb_accesstoken'));
    this.http.delete(`${environment.api_url}/notification/notificationRule/`+notificationRuleId, {headers: headers}).subscribe((res:any) => {
      this.notificationsStore.update(state => {
        let currentRules = state.notificationRules;
        let indexOfDeleted = currentRules.findIndex(x => x._id === res.data._id);
        if (indexOfDeleted >= 0) currentRules.splice(indexOfDeleted, 1);
        return {
          ...state,
          notificationRules: currentRules
        }
      });
    });
  }

  getBox(id, headers){
    // TODO: this should not be requested from the backend again. Maybe it is already saved in another model in the frontend
    return new Promise ((resolve, reject) => {
      this.http.get(this.AUTH_API_URL + '/boxes/' + id, {headers: headers}).subscribe((res:any) => {
        resolve(res)
      },
      (err:any) => {
        reject(err)
      });
    })
  }

  initializeWebsocket() {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer '+window.localStorage.getItem('sb_accesstoken'));

    let connectws = () => {
      this.websocket = new WebSocket(environment.websocket_url)
      this.websocket.onopen = (evt) => {

        //@ts-ignore
        this.notificationsStore.store._value.state.notificationRules.forEach((rule) => {
          this.websocket.send('subscribe:'+rule._id)
        })

        //@ts-ignore
        this.notificationsStore.store._value.state.notificationConnectors.forEach((connector) => {
          this.websocket.send('subscribe:'+connector._id)
        })

      }
      this.websocket.onmessage = async (evt) => {
        const message = JSON.parse(evt.data)
        if (!message.resultA) {
          let box = await this.getBox(message.rule.box, headers) as {
            sensors: Array<any>,
            name: string,
            exposure: string,
            updatedAt: string
          };
          let sensors = [];
            for ( let i = 0; i < message.rule.sensors.length; i++) {
              sensors.push(box.sensors.find(sensor => sensor._id == message.rule.sensors[i]))
            }
          let notification = {
            notificationRule: message.rule._id,
            notificationValue: message.measurement.value,
            notificationTime: message.createdAt,
            timeText: moment(message.createdAt).format("DD.MM.YYYY, HH:mm"),
            type: "threshold",
            activationOperator: message.rule.activationOperator,
            activationThreshold: message.rule.activationThreshold,
            ruleName: message.rule.name,
            box: box,
            sensors: sensors
          }
          this.notificationsStore.update(state => ({
            ...state,
            unread: true,
            notifications: (typeof state.notifications != "undefined") ? [notification].concat(state.notifications) : [notification]
          }));
        } else {
          let boxA = await this.getBox(message.resultA.rule.box, headers) as {
            sensors: Array<any>,
            name: string,
            exposure: string,
            updatedAt: string
          };
          let sensorsA = [];
          for ( let i = 0; i < message.resultA.rule.sensors.length; i++) {            
            sensorsA.push(boxA.sensors.find(sensor => sensor._id == message.resultA.rule.sensors[i]))
          }
          let boxB = await this.getBox(message.resultB.rule.box, headers) as {
            sensors: Array<any>,
            name: string,
            exposure: string,
            updatedAt: string
          };
          let sensorsB = [];
          for ( let i = 0; i < message.resultB.rule.sensors.length; i++) {
            sensorsB.push(boxB.sensors.find(sensor => sensor._id == message.resultB.rule.sensors[i]))
          }
          let notification = {
            notificationRule: message.connectorID,
            notificationValueA: message.resultA.measurement.value,
            notificationValueB: message.resultB.measurement.value,
            notificationTime: message.createdAt,
            timeText: moment(message.createdAt).format("DD.MM.YYYY, HH:mm"),
            type: "connector",
            connectionOperator: message.connectionOperator,
            boxA: boxA,
            sensorsA: sensorsA,
            activationOperatorA: message.resultA.rule.activationOperator,
            activationThresholdA: message.resultA.rule.activationThreshold,
            boxB: boxB,
            sensorsB: sensorsB,
            activationOperatorB: message.resultB.rule.activationOperator,
            activationThresholdB: message.resultB.rule.activationThreshold
          }
          this.notificationsStore.update(state => ({
            ...state,
            unread: true,
            notifications: (typeof state.notifications != "undefined") ? [notification].concat(state.notifications) : [notification]
          }));
        }
      }
      this.websocket.onerror = (evt) => console.error('onerror', evt)
      this.websocket.onclose = (evt) => setTimeout(
        () => {
            console.warn('onclose', evt);
            connectws();
        }, 3000)
    }
    connectws();
  }

  unreadFalse() {
    this.notificationsStore.update(state => ({
      ...state,
      unread: false
    }));
  }
}
