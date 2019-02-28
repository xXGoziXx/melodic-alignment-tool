import { Component, OnInit, Input } from '@angular/core';
import Chart, { InteractionMode, ChartConfiguration } from 'chart.js';
import * as Pitchfinder from 'pitchfinder';
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
  detectPitch = new Pitchfinder.YIN();
  pitch: any;
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
    // when the file is read
    this.fileReader.onload = (e: any) => {
      // stores the file as an ArrayBuffer
      self.arrayBuffer = e.currentTarget.result;
      console.log('ArrayBuffer: ', self.arrayBuffer);
      console.log('Byte Length: ' + self.arrayBuffer.byteLength);
      // get audio data form file using WavDecoder
      const decodedWav = WavDecoder.decode.sync(self.arrayBuffer);
      console.log('Sample Rate: ', decodedWav.sampleRate);
      const detectors = [Pitchfinder.YIN()];
      let moreAccurateFrequencies = Pitchfinder.frequencies(
        detectors,
        decodedWav.channelData[0],
        {
          tempo: 128, // in BPM, defaults to 120
          quantization: 4, // samples per beat, defaults to 4 (i.e. 16th notes)
        }
      );
      /* vocal test data pre-calculated */
      /*[17640.395528936995,18726.972774623853,210,212.12277483468188,234.5937743620731,18454.110180588144,281.1160910016887,277.4343256108928,283.30533337205463,280.47114053065536,280.8846737684757,282.01989876947385,279.564367380423,281.9702747122019,0,0,281.8279065120751,278.20077871517884,278.38408350070523,312.12665025285503,330.1659354063537,0,284.9978920125136,0,318.82445758558754,356.10281590054433,348.57414745722696,353.7549022929497,352.6164957272168,0,0,0,319.38047239137677,353.29785527682094,352.399556844769,351.578487078433,353.70538363345617,352.657657844728,350.61807505248055,356.5070266463866,356.57823447486146,355.1522291167095,0,18557.02854455429,18402.560463070815,17923.635388751045,17827.67823459781,0,18164.967011454395,208.95158762649635,213.36663539012926,210.48385833703082,206.03373003928812,0,239.67847467425364,279.5193544893314,280.0979129887348,279.11392405063293,18630.15450411411,286.460504058385,232.18910368658288,18670.748917040208,209.69877284162712,18079.728508373006,0,17916.056621886884,17994.077578443532,18677.42310924685,0,0,0,231.5588714445374,233.42755078747862,235.64257982659967,0,276.18362805992916,281.1754277180157,280.9761764707367,279.1425053802541,317.123905222104,0,0,281.5203725323482,284.1150132672389,282.1898285266621,279.22708227355866,283.23267461330204,280.96549262944075,280.7487641596633,18136.555084571937]*/
      moreAccurateFrequencies = moreAccurateFrequencies.map(
        (element, index) => ({
          x: index,
          y: element,
        })
      );
      // console.log(
      //   'Accurate Frequencies:' +
      //     moreAccurateFrequencies.map(e => JSON.stringify(e)).toString()
      // );
      const ctx: any = document.getElementById('VocalChart');
      const LineConfig: ChartConfiguration = {
        type: 'line',
        data: {
          labels: moreAccurateFrequencies.map(xy => xy.x),
          datasets: [
            {
              data: moreAccurateFrequencies.map(xy => xy.y),
              label: 'Vocal Pitches',
              borderColor: '#ffab40',
              fill: false,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: 'Chart of Vocal Pitches',
          },
          legend: { display: false },
        },
      };
      const ScatterConfig: ChartConfiguration = {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Vocals Frequency Graph',
              fill: false,
              backgroundColor: '#ffab40',
              borderColor: '#ffab40',
              data: moreAccurateFrequencies,
            },
          ],
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'Chart.js Line Chart',
          },
          legend: { display: false },
          tooltips: {
            mode: 'index' as InteractionMode,
            intersect: false,
          },
          hover: {
            mode: 'nearest' as InteractionMode,
            intersect: true,
          },
          scales: {
            xAxes: [
              {
                type: 'linear',
                display: false,
                scaleLabel: {
                  display: true,
                  labelString: 'Index',
                  fontColor: 'white',
                },
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Frequency',
                  fontColor: 'white',
                },
              },
            ],
          },
        },
      };
      const frequencyChart = new Chart(ctx, ScatterConfig);
    };
  }

  ngOnInit() {}
}
