import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent, CrosswordGeneratorComponent, WorkspaceComponent, ContentReviewComponent } from './components';

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
    path: 'review/:contentId', component: ContentReviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
