// Generated by https://quicktype.io

export interface MIDI {
  header: Header;
  startTime: number;
  duration: number;
  tracks: Track[];
}

export interface Header {
  PPQ: number;
  bpm: number;
  timeSignature: number[];
  name: string;
}

export interface Track {
  startTime: number;
  duration: number;
  length: number;
  notes: Note[];
  controlChanges: ControlChanges;
  id: number;
  name?: string;
  channelNumber?: number;
  isPercussion?: boolean;
}

export interface ControlChanges {}

export interface Note {
  name: Name;
  midi: number;
  time: number;
  velocity: number;
  duration: number;
}

export enum Name {
  A5 = 'A5',
  B4 = 'B4',
  B5 = 'B5',
  C5 = 'C5',
  C6 = 'C6',
  D5 = 'D5',
  E5 = 'E5',
  F5 = 'F5',
  G4 = 'G4',
  G5 = 'G5',
}
