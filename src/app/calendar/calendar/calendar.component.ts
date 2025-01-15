import { Component, OnDestroy, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventInput, EventSourceFuncArg } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { map, Observable, Subscription } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ToasterService } from '../../core/services/toaster.service';
import { CalendarEventFormComponent } from '../calendar-event-form/calendar-event-form.component';
import { CalendarEvent } from '../entity/calendar-event.entity';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  providers: [DialogService]
})
export class CalendarComponent implements OnInit, OnDestroy {
  constructor(private dialogService: DialogService,
              private calendarService: CalendarService,
              private toasterService: ToasterService,
              private translateService: TranslateService,) {
  }

  calendarOptions!: CalendarOptions
  private langChangeSubscription!: Subscription;

  ngOnInit(): void {
    this.calendarOptions = {
      allDaySlot: false,
      firstDay: 1,
      initialView: 'timeGridWeek',
      selectable: true,
      selectMirror: true,
      select: this.onDateSelect.bind(this),
      events: (arg: EventSourceFuncArg, successCallback: (eventInputs: EventInput[]) => void, failureCallback: (error: Error) => void) => {
        this.getEvents(arg.start, arg.end).subscribe((eventList: EventInput[]) => successCallback(eventList));
      },
      nowIndicator: true,
      locales: [frLocale],
      locale: this.translateService.currentLang,
      headerToolbar: {left: 'prev,next today', center: 'title', right: 'timeGridWeek,timeGridDay'},
      titleFormat: {day: 'numeric', month: 'long', year: 'numeric', separator: ' – '},
      slotLabelFormat: {hour: '2-digit', minute: '2-digit', hour12: false},
      dayHeaderFormat: {weekday: 'short', day: '2-digit', month: 'short'},
      slotMinTime: '07:00:00',
      slotMaxTime: '19:00:00',
      plugins: [interactionPlugin, timeGridPlugin]
    };
    this.langChangeSubscription = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.calendarOptions.locale = event.lang;
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  onDateSelect(dateSelectArg: DateSelectArg) {
    const calendarApi = dateSelectArg.view.calendar;
    calendarApi.unselect();
    this.dialogService.open(CalendarEventFormComponent, {
      header: this.translateService.instant('users.add_user'),
      data: {start: dateSelectArg.start, end: dateSelectArg.end},
      closable: true,
      modal: true,
    }).onClose.subscribe((calendarEvent: CalendarEvent) => {
      if (calendarEvent) {
        calendarApi.addEvent({
          title: calendarEvent.title,
          start: calendarEvent.startDate,
          end: calendarEvent.endDate
        });
        this.toasterService.emitValue({
          severity: 'success',
          summary: this.translateService.instant('common.success'),
          detail: this.translateService.instant('common.success_message')
        });
      }
    });
  }

  private getEvents(startDate: Date, endDate: Date): Observable<EventInput[]> {
    return this.calendarService.findAll(startDate, endDate).pipe(map((calendarEvents: CalendarEvent[]) => {
      return calendarEvents.map((calendarEvent: CalendarEvent) => {
        return {
          id: `calendarEvent-${calendarEvent.id}`,
          title: calendarEvent.title,
          start: calendarEvent.startDate,
          end: calendarEvent.endDate,
          extendedProps: {calendarEvent},
        }
      });
    }));
  }
}
