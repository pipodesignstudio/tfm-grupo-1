import {
  Component,
  signal,
  ChangeDetectorRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FullCalendarModule,
  FullCalendarComponent,
} from '@fullcalendar/angular';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';

import { format } from 'date-fns';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CalendarPageComponent {
  @ViewChild('fullCalendarRef') calendarComponent!: FullCalendarComponent;

  calendarVisible = signal(true);

  allEvents =[
    { title: 'event 1', date: '2025-06-14', icon: 'pi pi-book' },
    { title: 'event 4', date: '2025-06-14', icon: 'pi pi-book' },
    { title: 'event 2', date: '2025-06-16', icon: 'pi pi-book' },
  ];

  currentEvents = signal<EventApi[]>([]);

  selectedDateEvents = [
    { title: 'event 6', date: '2025-06-14', icon: 'pi pi-book' },
  ];

  selectedDate = format(new Date('2025-02-15'), 'MMMM, do, EEE'); // Formato YYYY-MM-DD

  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin],
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next',
    },
    initialView: 'dayGridMonth',
    initialEvents: this.allEvents,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDidMount: this.eventDidMount.bind(this),
  });

  constructor(private changeDetector: ChangeDetectorRef) {}

  // Metodo para añadir el dot
  eventDidMount(info: any) {
    const dateStr = info.event.startStr.split('T')[0]; // Formato YYYY-MM-DD
    const dayCell = document.querySelector(`[data-date="${dateStr}"]`);

    if (dayCell && !dayCell.classList.contains('has-event-dot')) {
      dayCell.classList.add('has-event-dot');
    }
  }


  

  handleDateSelect(selectInfo: DateSelectArg) {

    const clickedDate = selectInfo.startStr.split('T')[0]; // YYYY-MM-DD
    this.selectedDateEvents = this.allEvents.filter((event) => {
      return event.date === clickedDate;
    });

    console.log(this.selectedDateEvents, clickedDate);
  }



  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  agregarEventoRapido() {
    const title = prompt('Título del nuevo evento');
    if (title && this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      const date = new Date();
      calendarApi.addEvent({
        title,
        start: date.toISOString().slice(0, 10),
        allDay: true,
      });
    }
  }
}
