import {
  Component,
  signal,
  ChangeDetectorRef,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FullCalendarModule,
  FullCalendarComponent,
} from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FormsModule } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';

import { format } from 'date-fns';
import { ActivityService } from '../../../service/activity.service';

import { IActivity } from '../../../interfaces/iactivity.interface';

import { EventInput } from '@fullcalendar/core';

import { CreateActivityComponent } from '../../../components/activity/create-activity.component';

interface MyEvent extends EventInput {
  checked?: boolean;
}

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    DropdownModule,
    FormsModule,
    CreateActivityComponent,
  ],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CalendarPageComponent {
  @ViewChild('fullCalendarRef') calendarComponent!: FullCalendarComponent;

  calendarVisible = signal(true);

  activityService = inject(ActivityService);

  allEvents: IActivity[] = [];

  currentEvents: MyEvent[] = [];

  selectedDateEvents: MyEvent[] = [];

  mostrarModalNuevoEvento = false;

  async ngOnInit() {
    // Cargar los eventos de la familia con id '1'
    try {
      const activities = await this.activityService.getActivitiesFamily('1');
      console.log(activities);
      this.allEvents = activities;
      console.log(this.allEvents);
      const eventInputs = this.mapActivitiesToEvents(activities);
      this.currentEvents = eventInputs;
      this.filtrarEventosPorFecha(new Date().toISOString().slice(0, 10));

      // También actualiza el calendario si usas signal
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents(); // Limpia los eventos anteriores
      calendarApi.addEventSource(eventInputs);
    } catch (error) {
      console.error('Error al cargar los eventos:', error);
    }
  }

  selectedDate = format(new Date(), 'MMMM, do, EEE'); // Formato YYYY-MM-DD

  filtroOpciones = [
    { label: 'Todos', value: null },
    { label: 'Lucas', value: 1 },
    { label: 'Sofía', value: 2 },
  ];

  filtroSeleccionado: number | null = null;

  filtrarEventos() {
    const filterValue: { label: string; value: number } | any =
      this.filtroSeleccionado;
    if (!filterValue) {
      this.selectedDateEvents = [...this.currentEvents];
    } else {
      console.log(filterValue.value);
      this.selectedDateEvents = this.currentEvents.filter((evento: any) =>
        evento.id_nino === filterValue.value ? evento.id_nino : null
      );
    }
  }

  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin],
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next',
    },
    initialView: 'dayGridMonth',
    initialEvents: [],
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    contentHeight: 'auto',
    longPressDelay: 0,
    select: this.handleDateSelect.bind(this),
    /*     eventsSet: this.handleEvents.bind(this),
     */ eventDidMount: this.eventDidMount.bind(this),
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
    const clickedDate = selectInfo.startStr.split('T')[0];
    this.filtrarEventosPorFecha(clickedDate);
  }

  private filtrarEventosPorFecha(fecha: string) {
    const filtrados = this.currentEvents.filter(
      (event: any) => event.start === fecha
    );

    this.selectedDateEvents = filtrados;

    console.log(filtrados, this.selectedDate);

    this.selectedDate = format(new Date(fecha), 'MMMM, do, EEE');

    console.log(`Eventos filtrados para la fecha ${fecha}:`, filtrados);
  }

  /*  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  } */

  private mapActivitiesToEvents(activities: IActivity[]): EventInput[] {
    return activities.map((activity) => ({
      id: String(activity.id),
      title: activity.titulo,
      start: format(new Date(activity.fecha_realizacion), 'yyyy-MM-dd'), // asegúrate que `fecha` sea en formato ISO o YYYY-MM-DD
      allDay: true,
      color: activity.color ?? undefined, // evita pasar null
      actividadInfo: activity, // Puedes agregar información adicional si es necesario
    }));
  }

  nuevoTituloEvento = '';
  nuevaFechaEvento = new Date().toISOString().slice(0, 10);

  agregarEventoRapido() {
    this.nuevoTituloEvento = '';
    this.nuevaFechaEvento = new Date().toISOString().slice(0, 10);
    this.mostrarModalNuevoEvento = true;
  }

  cerrarModalNuevoEvento() {
    this.mostrarModalNuevoEvento = false;
  }

  guardarNuevaActividad(nuevaActividad: Partial<IActivity>) {
    // Asegurar que estas propiedades son instancias de Date
    const actividadConFechas: IActivity = {
      ...nuevaActividad,
      fecha_realizacion: new Date(nuevaActividad.fecha_realizacion!),
      hora_inicio: nuevaActividad.hora_inicio
        ? new Date(nuevaActividad.hora_inicio)
        : undefined,
      hora_fin: nuevaActividad.hora_fin
        ? new Date(nuevaActividad.hora_fin)
        : undefined,
    } as IActivity;

    const calendarApi = this.calendarComponent.getApi();
    const fecha =
      actividadConFechas.fecha_realizacion.toLocaleDateString('en-CA');

    try {
      this.activityService
        .createActivity(actividadConFechas)
        .then((actividadCreada) => {
          console.log('Actividad creada:', actividadCreada);
          calendarApi.addEvent({
            title: actividadConFechas.titulo || 'Sin título',
            start: fecha,
            allDay: true,
            color: actividadConFechas.color || '#7c3aed',
          });
        });
    } catch (error) {
      console.error('Error al crear la actividad:', error);
    } finally {
      this.mostrarModalNuevoEvento = false;
    }
  }

  onCheckedChange(event: MyEvent) {
    console.log(event, 'checked:', event.checked);
    
  }
}
