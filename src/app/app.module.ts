import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndentedTreeComponent } from './indented-tree/indented-tree.component';
import { IndentedTreeLeftTopComponent } from './indented-tree-left-top/indented-tree-left-top.component';

@NgModule({
  declarations: [
    AppComponent,
    IndentedTreeComponent,
    IndentedTreeLeftTopComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
