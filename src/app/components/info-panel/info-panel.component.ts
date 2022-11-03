import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss'],
})
export class InfoPanelComponent implements OnInit {
  points = 563;
  @Output() runSim = new EventEmitter<any>();

  @Output() levelChanged = new EventEmitter<Level>();

  currentLevel: Level = Level.Ground;
  level = Level;

  constructor() {}

  ngOnInit(): void {}

  shareData($event: any) {
    this.points += 200;
    console.log('share data');
  }

  visualiseData($event: any) {
    this.runSim.emit();
  }

  levelChange(ev: MatButtonToggleChange): void {
    if (ev.value === "roof")
      this.currentLevel = Level.Roof;
    else
      this.currentLevel = Level.Ground;

    this.levelChanged.emit(this.currentLevel);
  }
}

export enum Level {
  Ground,
  Roof
}