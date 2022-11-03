import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-attribute-panel',
  templateUrl: './attribute-panel.component.html',
  styleUrls: ['./attribute-panel.component.scss']
})
export class AttributePanelComponent implements OnInit {

  @Input()
  energyEfficiency: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
