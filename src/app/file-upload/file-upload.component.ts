import { Component, OnInit } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import * as MidiConvert from 'midiconvert';
import * as $ from 'jquery';
@Component({
  selector: 'mat-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  file: any;
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

  fileSizes = [10, 100, 1000, 10000, 100000, 10000000, 10000000000];

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

    // Client-side validation
    if (
      file.type.split('/')[0] !== 'audio' &&
      file.type.split('/')[1] !== ('mid' || 'midi' || 'x-midi')
    ) {
      console.error('Unsupported File Type! :( \n MIDI File Expected...');
      return;
    } else {
      console.log('File Type:' + file.type);
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
          this.db.collection('MIDI').add({ path, size: snap.totalBytes });
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
  // Determines if the upload task is active
  isActive(snapshot) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }

  ngOnInit() {}
}
