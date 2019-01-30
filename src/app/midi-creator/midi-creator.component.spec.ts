import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiCreatorComponent } from './midi-creator.component';

describe('MidiCreatorComponent', () => {
  let component: MidiCreatorComponent;
  let fixture: ComponentFixture<MidiCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MidiCreatorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidiCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
