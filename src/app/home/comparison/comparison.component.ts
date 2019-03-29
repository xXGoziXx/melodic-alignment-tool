import { Component, OnInit, Input } from '@angular/core';
import Chart from 'chart.js';
import Dygraph from 'dygraphs';
import * as Pitchfinder from 'pitchfinder';
import WavDecoder from 'wav-decoder';
import MIDIUtils from 'midiutils';
import DynamicTimeWarping from 'dynamic-time-warping';
import { MIDI } from 'midi';
@Component({
  selector: 'mat-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss'],
})
export class ComparisonComponent implements OnInit {
  @Input() vocalUrl: string;
  @Input() midiData: string;
  arrayBuffer: any;
  fileReader = new FileReader();
  detectPitch = new Pitchfinder.YIN();
  pitch: any;
  midiTempo = 120;
  midiTimeSig = 4;
  midi: MIDI;
  distance: any;
  path: any;
  result: any;
  moreAccurateFrequencies: Array<any>;
  midiFrequencies = [];
  showScoreChart = false;
  public compare(vocalUrl, midiData) {
    this.vocalUrl = vocalUrl;
    this.midiData = midiData;
    // console.log('vocalUrl: ' + this.vocalUrl);
    // console.log('midiData: ' + this.midiData);
    fetch(this.vocalUrl)
      .then(res => res.blob()) // get's the response and returns it as a blob
      .then(blob => {
        console.log('Blob: ', blob);
        // reads the data from the blob as an ArrayBuffer
        this.fileReader.readAsArrayBuffer(blob);
      })
      .catch(error => console.log(error)); // prints out error
  }
  constructor() {
    const self = this;
    // when the file is read
    this.fileReader.onload = (e: any) => {
      self.midi = JSON.parse(self.midiData);
      let trackIndex = 0;
      // if there is a bpm
      if (self.midi.header.bpm !== undefined) {
        self.midiTempo = self.midi.header.bpm;
      }
      // if there is a time signature
      if (self.midi.header.timeSignature !== undefined) {
        /* gets the time signature from
           Header's timeSignature array,
           depending on which track is being used
        */
        for (const index in self.midi.tracks) {
          if (self.midi.tracks.hasOwnProperty(index)) {
            const track = self.midi.tracks[index];
            if (track.length !== 0) {
              trackIndex = parseInt(index, 10);
              self.midiTimeSig = self.midi.header.timeSignature[trackIndex];
              break;
            }
          }
        }
      }
      // stores the file as an ArrayBuffer
      self.arrayBuffer = e.currentTarget.result;
      console.log('ArrayBuffer: ', self.arrayBuffer);
      console.log('Byte Length: ' + self.arrayBuffer.byteLength);
      // get audio data form file using WavDecoder
      const decodedWav = WavDecoder.decode.sync(self.arrayBuffer);
      console.log('Sample Rate: ', decodedWav.sampleRate);
      const detectors = [Pitchfinder.AMDF()];
      console.log('Tempo: ', self.midiTempo);
      console.log('Quantization: ', self.midiTimeSig);

      this.moreAccurateFrequencies = Pitchfinder.frequencies(
        detectors,
        decodedWav.channelData[0],
        {
          tempo: self.midiTempo, // in BPM, defaults to 120
          quantization: self.midiTimeSig, // samples per beat, defaults to 4 (i.e. 16th notes)
        }
      );
      const midiFreqRaw = self.midi.tracks[trackIndex].notes.map(note => ({
        x: this.calcQTime(note.time, self.midiTempo, self.midiTimeSig),
        y: NaN,
        z: MIDIUtils.noteNumberToFrequency(note.midi),
      }));
      // padded results for midi
      for (
        let index = 0;
        index <
        this.calcQTime(
          self.midi.tracks[trackIndex].duration,
          self.midiTempo,
          self.midiTimeSig
        );
        index++
      ) {
        if (midiFreqRaw.findIndex(xyz => xyz.x === index) !== -1) {
          // if theres a note at this quantized time in the midi file
          self.midiFrequencies.push({
            x: index,
            y: NaN,
            z: midiFreqRaw.find(xyz => xyz.x === index).z,
          });
        } else {
          // otherwise use the last one
          self.midiFrequencies.push({
            x: index,
            y: NaN,
            z: self.midiFrequencies.find(xyz => xyz.x === index - 1).z,
          });
        }
      }

      self.moreAccurateFrequencies = self.moreAccurateFrequencies.map(
        (element, index) => ({
          x: index,
          y: element,
          z: NaN,
        })
      );
      // pad NaN values
      for (
        let index = 0;
        index < self.moreAccurateFrequencies.length;
        index++
      ) {
        if (isNaN(self.moreAccurateFrequencies[index].y)) {
          self.moreAccurateFrequencies[index].y =
            index === 0 ? 0 : self.moreAccurateFrequencies[index - 1].y;
        }
      }
      const dtw = new DynamicTimeWarping(
        this.prepareSignature(this.midiFrequencies.map(xyz => [xyz.x, xyz.z])),
        this.prepareSignature(
          this.moreAccurateFrequencies.map(xyz => [xyz.x, xyz.y])
        ),
        this.euclideanDistance
      );
      self.distance = dtw.getDistance();
      self.path = dtw.getPath();
      self.result = this.distance / this.path.length;
      console.log('Distance: ', this.distance);
      console.log('Path: ', this.path);
      console.log('Result: ', this.result);
      const ctx: any = document.getElementById('VocalChart');
      const ctxDTW: any = document.getElementById('DTWChart');
      const options = {
        legend: 'always',
        rollPeriod: 7,
        title: 'Frequency Graph',
        labels: ['QTime', 'Vocal', 'MIDI'],
        xlabel: 'Quantized Time',
        ylabel: 'Frequency',
        colors: ['#ffd180', '#7cb342'],
      };
      const optionsDTW = {
        legend: 'always',
        rollPeriod: 7,
        title: 'DTW Graph',
        labels: ['QTime', 'DTW Path'],
        xlabel: 'Quantized Time',
        ylabel: 'Frequency',
        colors: ['#ffffff'],
      };

      const data = this.mergeFreqArray(
        self.moreAccurateFrequencies.map(xyz => [xyz.x, xyz.y, NaN]),
        self.midiFrequencies.map(xyz => [xyz.x, NaN, xyz.z])
      );
      const dataDTW = this.path;
      console.log('Vocal Frequencies Data: ', data);
      const g = new Dygraph(ctx, data, options);
      // const gDTW = new Dygraph(ctxDTW, dataDTW, optionsDTW);
    };
    $(() => {
      const VocalChart = document.getElementById('VocalChart');
      // create an observer instance
      const pickedObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          // @ts-ignore
          // console.log('Change Detected: ', mutation.target.innerHTML);
          $('span#distance').html(self.distance);
          $('span#result').html(self.result);
        });
      });

      // configuration of the observer:
      const config = { attributes: true, childList: true, characterData: true };

      // pass in the target node, as well as the observer options
      pickedObserver.observe(VocalChart, config);
    });
  }

  calcQTime(time: number, tempo: number, timeSig: number) {
    // convert to minute
    const time2Mins = time / 60;
    // get the number of beats
    const mins2Beats = time2Mins * tempo;
    // get the Quantized time
    const qTime = mins2Beats * timeSig;
    return qTime;
  }
  mergeFreqArray(vFreq, mFreq) {
    const maxLength = Math.max(vFreq.length, mFreq.length);
    const res = [];
    for (let index = 0; index < maxLength; index++) {
      const vI = vFreq.findIndex(e => e[0] === index);
      const mI = mFreq.findIndex(e => e[0] === index);
      if (mI === -1 && vI === -1) {
        res.push([index, NaN, NaN]);
      } else if (vI === -1) {
        res.push([index, NaN, mFreq[mI][2]]);
      } else if (mI === -1) {
        res.push([index, vFreq[vI][1], NaN]);
      } else {
        res.push([index, vFreq[vI][1], mFreq[mI][2]]);
      }
    }
    return res;
  }
  euclideanDistance(a, b) {
    const xDiff = a[0] - b[0];
    const yDiff = a[1] - b[1];
    const ED = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    return ED;
  }
  // data is an array of arrays with the x coordinate in 0 and y in 1
  prepareSignature(data) {
    let xMean = 0;
    let yMean = 0;
    const diffData = [];
    for (let i = 0; i < data.length; i++) {
      xMean = xMean + data[i][0];
      yMean = yMean + data[i][1];
    }
    xMean = xMean / data.length;
    yMean = yMean / data.length;
    for (let i = 0; i < data.length; i++) {
      diffData[i] = [data[i][0] - xMean, data[i][1] - yMean];
    }
    return diffData;
  }
  ngOnInit() {}
}
