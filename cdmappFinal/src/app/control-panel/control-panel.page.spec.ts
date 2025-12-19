import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HardcodePage } from './control-panel.page';

describe('HardcodePage', () => {
  let component: HardcodePage;
  let fixture: ComponentFixture<HardcodePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HardcodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
