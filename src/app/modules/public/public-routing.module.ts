import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent, CrosswordGeneratorComponent, WorkspaceComponent } from './components';

const routes: Routes = [{
  path: '', component: LoginComponent
  },
  {
    path: 'create', component: WorkspaceComponent
  },
  {
    path: 'cw', component: CrosswordGeneratorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
