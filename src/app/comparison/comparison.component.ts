import { Component, OnInit } from '@angular/core';
// import Fs from 'fs';
import * as Pitchfinder from 'pitchfinder';
import * as WavDecoder from 'wav-decoder';

// declare var fs: any;

@Component({
  selector: 'mat-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss'],
})
export class ComparisonComponent implements OnInit {
  constructor() {
    // see below for optional constructor parameters.
    // const detectPitch = new Pitchfinder.YIN();
    // const buffer = fs.readFileSync('');
    // const decoded = WavDecoder.decode(buffer); // get audio data from file using `wav-decoder`
    // const float32Array = decoded.channelData[0]; // get a single channel of sound
    // const pitch = detectPitch(float32Array); // null if pitch cannot be identified
    // const frequencies = Pitchfinder.frequencies(detectPitch, float32Array, {
    //   tempo: 128, // in BPM, defaults to 120
    //   quantization: 4, // samples per beat, defaults to 4 (i.e. 16th notes)
    // });
  }

  ngOnInit() {}
}
