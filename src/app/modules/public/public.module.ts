import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent, CrosswordGeneratorComponent, WorkspaceComponent } from './components';
import { HttpClientModule } from '@angular/common/http';

import { PublicRoutingModule } from './public-routing.module';
import {SuiDropdownModule, SuiDimmerModule} from 'ng2-semantic-ui';
import { InteractingVideoComponent } from './components/interacting-video/interacting-video.component';
import { AddMarkerComponent } from './components/add-marker/add-marker.component';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    PublicRoutingModule,
    HttpClientModule,
    SuiDropdownModule,
    SuiDimmerModule,
    SuiModule,
    SuiTabsModule,
    FormsModule
  ],
  // tslint:disable-next-line:max-line-length
  declarations: [LoginComponent, CrosswordGeneratorComponent, WorkspaceComponent, InteractingVideoComponent, AddMarkerComponent, HeaderComponent]
})
export class PublicModule { }
