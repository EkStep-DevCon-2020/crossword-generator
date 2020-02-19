import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent, CrosswordGeneratorComponent, WorkspaceComponent } from './components';
import { InteractingVideoComponent } from './components/interacting-video/interacting-video.component';

const routes: Routes = [{
  path: '', component: LoginComponent
  },
  {
    path: 'workspace', component: WorkspaceComponent
  },
  {
    path: 'cw', component: CrosswordGeneratorComponent
  },
  {
    path: 'interactive-video', component: InteractingVideoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
