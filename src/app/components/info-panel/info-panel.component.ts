import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss'],
})
export class InfoPanelComponent implements OnInit {
  points = 563;
  @Output() runSim = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}

  shareData($event: any) {
    this.points += 200;
    console.log('share data');
  }

  visualiseData($event: any) {
    this.runSim.emit();
  }
}
