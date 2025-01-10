import { Component, OnDestroy, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar',
  imports: [
    FullCalendarModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, OnDestroy {
  constructor(private translate: TranslateService) {
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
      nowIndicator: true,
      locales: [frLocale],
      locale: this.translate.currentLang,
      headerToolbar: {left: 'prev,next today', center: 'title', right: 'timeGridWeek,timeGridDay'},
      titleFormat: {day: 'numeric', month: 'long', year: 'numeric', separator: ' – '},
      slotLabelFormat: {hour: '2-digit', minute: '2-digit', hour12: false},
      dayHeaderFormat: {weekday: 'short', day: '2-digit', month: 'short'},
      slotMinTime: '07:00:00',
      slotMaxTime: '19:00:00',
      plugins: [interactionPlugin, timeGridPlugin]
    };
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.calendarOptions.locale = event.lang;
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  onDateSelect(selectInfo: any) {
    const start = selectInfo.startStr;
    const end = selectInfo.endStr;
    const calendarApi = selectInfo.view.calendar;
    calendarApi.addEvent({
      title: 'Nouvel événement',
      start: start,
      end: end,
      allDay: selectInfo.allDay,
    });
    calendarApi.unselect();
  }
}
