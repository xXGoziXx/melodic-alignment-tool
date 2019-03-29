import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ComparisonComponent } from './comparison/comparison.component';
@Component({
  selector: 'mat-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  public vocalUrl = 'home';
  public midiData = 'home';
  constructor(
    private _formBuilder: FormBuilder,
    public comp: ComparisonComponent
  ) {}
  getVocalUrl($event) {
    // console.log('Vocal Url: ' + $event);
    this.vocalUrl = $event;
  }
  getMidiData($event) {
    // console.log('Midi Data: ' + $event);
    this.midiData = $event;
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }
}
