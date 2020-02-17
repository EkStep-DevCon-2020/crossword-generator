import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent, CrosswordGeneratorComponent } from './components';
import { PublicRoutingModule } from './public-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PublicRoutingModule
  ],
  declarations: [LoginComponent, CrosswordGeneratorComponent]
})
export class PublicModule { }
