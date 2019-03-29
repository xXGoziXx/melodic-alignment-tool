import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import {
  AngularFirestoreModule,
  FirestoreSettingsToken,
} from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';
import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DropZoneDirective } from './drop-zone/drop-zone.directive';
import { FileUploadComponent } from './home/file-upload/file-upload.component';
import { FileSizePipe } from './file-size/file-size';
import { HomeComponent } from './home/home.component';
import { MidiCreatorComponent } from './midi-creator/midi-creator.component';
import { NavComponent } from './nav/nav.component';
import { TableComponent } from './home/comparison/table/table.component';
import { ComparisonComponent } from './home/comparison/comparison.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'midi-creator', component: MidiCreatorComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent,
    TableComponent,
    HomeComponent,
    MidiCreatorComponent,
    AboutComponent,
    FileUploadComponent,
    FileSizePipe,
    DropZoneDirective,
    ComparisonComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(
      environment.firebase,
      'melodic-alignment-tool'
    ),
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    LayoutModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: FirestoreSettingsToken, useValue: {} },
    ComparisonComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
