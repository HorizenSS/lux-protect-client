import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertMapComponent } from './alert-map.component';

describe('AlertMapComponent', () => {
  let component: AlertMapComponent;
  let fixture: ComponentFixture<AlertMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
