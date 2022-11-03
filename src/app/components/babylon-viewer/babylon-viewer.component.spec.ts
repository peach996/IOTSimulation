import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabylonViewerComponent } from './babylon-viewer.component';

describe('BabylonViewerComponent', () => {
  let component: BabylonViewerComponent;
  let fixture: ComponentFixture<BabylonViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BabylonViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BabylonViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
