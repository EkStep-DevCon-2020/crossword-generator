import { BrowserModule } from '@angular/platform-browser';
import { NgModule,  } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CrosswordGeneratorComponent } from './components/crossword-generator/crossword-generator.component';

@NgModule({
  declarations: [
    AppComponent,
    CrosswordGeneratorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
