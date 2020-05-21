import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndentedTreeComponent } from './indented-tree/indented-tree.component';


const routes: Routes = [
  {
    path:'indentedTree',
    component: IndentedTreeComponent
  },
  { 
    path: '',
    redirectTo: 'indentedTree',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
