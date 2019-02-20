import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  AngularFireStorage,
  AngularFireUploadTask,
} from 'angularfire2/storage';
import { Observable, Observer } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';

import * as MidiConvert from 'midiconvert';
import WaveSurfer from 'wavesurfer.js';
import * as $ from 'jquery';

@Component({
  selector: 'mat-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  // Determines which step user is on
  @Input() step: string;
  // Sends the URL to the Home Component
  @Output() fileUrl = new EventEmitter<string>();
  // Main task
  task: AngularFireUploadTask;

  // File name
  name: string | null;
  // Progress monitoring
  percentage: Observable<number | null>;

  snapshot: Observable<any | null>;

  // Download URL
  downloadURL: Observable<string | null>;

  // State for dropzone CSS toggling
  isHovering: boolean;

  // File sizes for filtering
  fileSizes = [10, 100, 1000, 10000, 100000, 10000000, 10000000000];

  // WaveSurfer library variable
  wavesurfer: any = { isPlaying: () => {}, getMute: () => {} };

  // Boolean variable for if play buttons are hovered
  hoveredWSB = false;

  // Boolean variable for if wavesurfer has loaded the file
  wavesurferLoaded: Observable<boolean | false> = new Observable(
    (subscriber: Observer<boolean>) => {
      subscriber.next(true);
      // subscriber.complete();
    }
  );
  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore
  ) {}

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList, folder) {
    // The File object
    const file = event.item(0);

    // Client-side validation for files
    if (
      (file.type.split('/')[0] === 'audio' &&
        file.type.split('/')[1] === ('mid' || 'midi' || 'x-midi') &&
        folder === 'MIDI') ||
      (file.type.split('/')[0] === 'audio' && folder === 'Vocal')
    ) {
      console.log('File Type:' + file.type);
    } else {
      console.error('Unsupported File Type! :( \n MIDI File Expected...');
      return;
    }

    // The storage path
    const path = `${folder}/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'My AngularFire-Powered MAT!' };

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // The file name
    this.name = file.name;

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges();
    // The file's download URL
    this.task
      .snapshotChanges()
      .pipe(
        finalize(
          () => (this.downloadURL = this.storage.ref(path).getDownloadURL())
        )
      )
      .subscribe();
    this.snapshot = this.task.snapshotChanges().pipe(
      tap(snap => {
        if (snap.bytesTransferred === snap.totalBytes) {
          // Update firestore on completion
          this.db.collection(folder).add({ path, size: snap.totalBytes });
        }
      })
    );
  }
  // Loads Midi Data
  loadMidiData(url) {
    MidiConvert.load(url, function(midi) {
      // console.log(midi);
      $('#midiContent').html(JSON.stringify(midi));
      return midi;
    });
  }
  // Loads Vocal Data
  loadVocalData(url) {
    this.fileUrl.emit(url);
    $('#waveform').html('');
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: '#455a64',
      progressColor: '#FFD183',
      cursorColor: '#43A047',
      responsive: true,
      autoCenter: true,
    });
    this.wavesurfer.on('error', err => {
      console.log(err);
    });
    this.wavesurfer.load(url);
    this.wavesurfer.on('ready', () => {
      this.wavesurferLoaded.subscribe();
    });
  }
  // Reveals next button for Steps
  revealNext(i) {
    $('#next' + i).show();
  }
  // Determines if the upload task is active
  isActive(snapshot) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }

  // Toggles an Element's Visibility
  toggleElementVisibility(id) {
    $('#' + id).toggle('slow');
  }

  ngOnInit() {}
}
