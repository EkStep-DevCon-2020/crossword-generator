import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent, CrosswordGeneratorComponent } from './components';
import { HttpClientModule } from '@angular/common/http';
import { PublicRoutingModule } from './public-routing.module';
import {SuiDropdownModule} from 'ng2-semantic-ui';

@NgModule({
  imports: [
    CommonModule,
    PublicRoutingModule,
    HttpClientModule,
    SuiDropdownModule
  ],
  declarations: [LoginComponent, CrosswordGeneratorComponent]
})
export class PublicModule { }
