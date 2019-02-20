import { Component, OnInit, Input } from '@angular/core';
import * as Pitchfinder from 'pitchfinder';
// import * as buffer from 'audio-lena/mp3';
// import decode from 'audio-decode';
import WavDecoder from 'wav-decoder';
@Component({
  selector: 'mat-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss'],
})
export class ComparisonComponent implements OnInit {
  @Input() vocalUrl: string;
  arrayBuffer: any;
  fileReader = new FileReader();
  detectPitch = Pitchfinder.AMDF();
  frequencies: any;
  public compare(vocalUrl) {
    this.vocalUrl = vocalUrl;
    console.log('vocalUrl: ' + this.vocalUrl);
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
    this.fileReader.onload = (e: any) => {
      console.log(e);
      self.arrayBuffer = e.currentTarget.result;
      console.log('ArrayBuffer: ', self.arrayBuffer);
      console.log('Byte Length: ' + self.arrayBuffer.byteLength);
      // get audio data form file using wavDecoder
      const decodeWav = WavDecoder.decode(self.arrayBuffer).then(audioData => {
        console.log('Sample Rate: ', audioData.sampleRate);
        console.log('Channel Data 0: ', audioData.channelData[0]); // Float32Array
        console.log('Channel Data 1: ', audioData.channelData[1]); // Float32Array
        const pitch = self.detectPitch(audioData.channelData[0]); // null if pitch cannot be identified
        console.log('Pitch: ' + pitch);
        this.frequencies = Pitchfinder.frequencies(
          self.detectPitch,
          audioData,
          {
            tempo: 128, // in BPM, defaults to 120
            quantization: 4, // samples per beat, defaults to 4 (i.e. 16th notes)
          }
        );
        // or use multiple detectors for better accuracy at the cost of speed.
        // const detectors = [self.detectPitch, Pitchfinder.AMDF()];
        // const moreAccurateFrequencies = Pitchfinder.frequencies(
        //   detectors,
        //   audioData,
        //   {
        //     tempo: 130, // in BPM, defaults to 120
        //     quantization: 4, // samples per beat, defaults to 4 (i.e. 16th notes)
        //   }
        // );
        console.log('Frequencies:' + this.frequencies.toString());
        // console.log(
        //   'Accurate Frequencies:' + moreAccurateFrequencies.toString()
        // );
      });
      // get audio data from file using `audio-decode`
      /*const decodedMp3 = decode(self.arrayBuffer).then(decoded => {
        console.log('Decoded: ', decoded);
        const float32Array = decoded.getChannelData(0); // get a single channel of sound
        console.log('Channel Data: ', float32Array);
        const pitch = self.detectPitch(float32Array); // null if pitch cannot be identified
        const frequencies = Pitchfinder.frequencies(
          self.detectPitch,
          float32Array,
          {
            tempo: 128, // in BPM, defaults to 120
            quantization: 4, // samples per beat, defaults to 4 (i.e. 16th notes)
          }
        );
        // or use multiple detectors for better accuracy at the cost of speed.
        const detectors = [self.detectPitch, Pitchfinder.AMDF()];
        const moreAccurateFrequencies = Pitchfinder.frequencies(
          detectors,
          float32Array,
          {
            tempo: 130, // in BPM, defaults to 120
            quantization: 4, // samples per beat, defaults to 4 (i.e. 16th notes)
          }
        );
        console.log('Frequencies:' + frequencies.toString());
        console.log(
          'Accurate Frequencies:' + moreAccurateFrequencies.toString()
        );
      });*/
    };
  }

  ngOnInit() {}
}
