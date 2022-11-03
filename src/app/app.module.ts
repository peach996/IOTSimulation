import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShellComponent } from './components/shell/shell.component';
import { BabylonViewerComponent } from './components/babylon-viewer/babylon-viewer.component';
import { InfoPanelComponent } from './components/info-panel/info-panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AttributePanelComponent } from './components/attribute-panel/attribute-panel.component';

import { MatButtonModule } from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    AppComponent,
    ShellComponent,
    BabylonViewerComponent,
    InfoPanelComponent,
    AttributePanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
