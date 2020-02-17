import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent, CrosswordGeneratorComponent } from './components';
import { HttpClientModule } from '@angular/common/http';
import { PublicRoutingModule } from './public-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PublicRoutingModule,
    HttpClientModule
  ],
  declarations: [LoginComponent, CrosswordGeneratorComponent]
})
export class PublicModule { }
