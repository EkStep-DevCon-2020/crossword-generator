import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent, CrosswordGeneratorComponent, WorkspaceComponent,
  ContentReviewComponent, ContentStatusComponent, HeaderComponent } from './components';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { PublicRoutingModule } from './public-routing.module';
import {SuiDropdownModule, SuiDimmerModule, SuiPopupModule, SuiModalModule} from 'ng2-semantic-ui';

@NgModule({
  imports: [
    CommonModule,
    PublicRoutingModule,
    HttpClientModule,
    SuiDropdownModule,
    SuiDimmerModule,
    FormsModule,
    SuiPopupModule,
    SuiModalModule
  ],
  declarations: [LoginComponent, CrosswordGeneratorComponent, WorkspaceComponent,
    ContentReviewComponent,
    ContentStatusComponent,
    HeaderComponent],
  exports: [HeaderComponent]
})
export class PublicModule { }
