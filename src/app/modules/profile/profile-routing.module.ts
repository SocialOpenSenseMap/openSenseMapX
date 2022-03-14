import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileWrapperComponent } from './profile-wrapper/profile-wrapper.component';
import { ProfileNavContainerComponent } from './profile-nav-container/profile-nav-container.component';
import { ProfileBoxesContainerComponent } from './profile-boxes-container/profile-boxes-container.component';
import { ProfileBoxCreateContainerComponent } from './box-create/profile-box-create-container/profile-box-create-container.component';
import { ProfileBoxCreateDeviceContainerComponent } from './box-create/profile-box-create-device-container/profile-box-create-device-container.component';
import { ProfileBoxCreateGeneralContainerComponent } from './box-create/profile-box-create-general-container/profile-box-create-general-container.component';
import { ProfileBoxCreateSensorsContainerComponent } from './box-create/profile-box-create-sensors-container/profile-box-create-sensors-container.component';
import { ProfileVisContainerComponent } from './profile-vis-container/profile-vis-container.component';
import { ProfileFollowedBoxesComponent } from './profile-followed-boxes/profile-followed-boxes.component';
import { ProfileFollowedBoxesContainerComponent } from './profile-followed-boxes-container/profile-followed-boxes-container.component';
import { ConnectRulesComponent } from './profile-followed-boxes/connect-rules/connect-rules.component';
import { ConnectRulesContainerComponent } from './profile-followed-boxes/connect-rules-container/connect-rules-container.component';

const routes: Routes = [
  {path: '', component: ProfileWrapperComponent, data: {name: 'Profil'}, children: [
    {path: 'boxes', component: ProfileBoxesContainerComponent, data: {name: 'Boxes'}},
    {path: 'newbox', component: ProfileBoxCreateContainerComponent, data: {name: 'New Box'}, children: [
      {path: '', redirectTo: 'device'},
      {path: 'device', component: ProfileBoxCreateDeviceContainerComponent},
      {path: 'general', component: ProfileBoxCreateGeneralContainerComponent},
      {path: 'sensors', component: ProfileBoxCreateSensorsContainerComponent},
    ]},
    {path: 'fbox', component: ProfileFollowedBoxesContainerComponent, data: {name: 'Configuration center'}},
    {path: 'connect-rule', component: ConnectRulesContainerComponent, outlet: 'modal'},
    {path: '', component: ProfileNavContainerComponent},
    {path: 'vis', component: ProfileVisContainerComponent, data: {name: 'Visulizations'}},
  ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
