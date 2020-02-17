import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent, CrosswordGeneratorComponent, WorkspaceComponent } from './components';
import { PublicRoutingModule } from './public-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PublicRoutingModule
  ],
  declarations: [LoginComponent, CrosswordGeneratorComponent, WorkspaceComponent]
})
export class PublicModule { }
