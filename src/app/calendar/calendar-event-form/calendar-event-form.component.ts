import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ClassicEditor, Bold, Essentials, Italic, Paragraph } from 'ckeditor5';
import coreTranslations from 'ckeditor5/translations/fr.js';
import { TranslateService } from '@ngx-translate/core';
import { CalendarService } from '../calendar.service';
import { CalendarEvent } from '../entity/calendar-event.entity';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-calendar-event-form',
  imports: [ReactiveFormsModule, CKEditorModule, DatePicker,],
  templateUrl: './calendar-event-form.component.html',
  styleUrl: './calendar-event-form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CalendarEventFormComponent {
  eventForm!: FormGroup;
  public Editor = ClassicEditor;
  config: any;
  constructor(private fb: FormBuilder,
              private translateService: TranslateService,
              private calendarService: CalendarService,
              private dialogRef: DynamicDialogRef,
              private dialogConfig: DynamicDialogConfig) {}

  ngOnInit() {
    const calendarEvent: CalendarEvent | undefined = this.dialogConfig.data?.calendarEvent;
    this.eventForm = this.fb.group({
      id: [calendarEvent?.id],
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
    this.config = {
      plugins: [ Essentials, Paragraph, Bold, Italic ],
        toolbar: ['undo', 'redo', '|', 'bold', 'italic',  '|', 'link', 'bulletedList', 'numberedList'],
        licenseKey: 'GPL',
        translations: [ coreTranslations ],
        language: {ui: this.translateService.currentLang}
    };
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const eventFormValue = this.eventForm.getRawValue();
      const observable = eventFormValue.id > 0 ? this.calendarService.update(eventFormValue.id, eventFormValue) : this.calendarService.create(eventFormValue);
      observable.subscribe((calendarEvent: CalendarEvent) => {
        if (calendarEvent && calendarEvent.id! > 0) {
          this.dialogRef.close(calendarEvent);
        }
      });
    }
  }
}
