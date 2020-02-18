import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent, CrosswordGeneratorComponent, WorkspaceComponent,
  ContentReviewComponent, ContentStatusComponent } from './components';
import { HttpClientModule } from '@angular/common/http';
import { PublicRoutingModule } from './public-routing.module';
import {SuiDropdownModule, SuiDimmerModule} from 'ng2-semantic-ui';

@NgModule({
  imports: [
    CommonModule,
    PublicRoutingModule,
    HttpClientModule,
    SuiDropdownModule,
    SuiDimmerModule
  ],
  declarations: [LoginComponent, CrosswordGeneratorComponent, WorkspaceComponent,
    ContentReviewComponent,
    ContentStatusComponent]
})
export class PublicModule { }
