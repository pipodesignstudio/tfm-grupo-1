import { UsersService } from '../../../../../shared/services/users.service';
import {
  Component,
  signal,
  ChangeDetectorRef,
  ViewChild,
  ViewEncapsulation,
  inject,
  effect,
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
import { ActivityService } from '../../../../../shared/services/activity.service';

import { IActivity } from '../../../../../shared/interfaces/iactivity.interface';

import { EventInput } from '@fullcalendar/core';

import { ActivityFormComponent } from '../../../../../components/activity/activity-form.component';
import { FamiliesStore } from '../../../../../shared/services/familiesStore.service';

import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';

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
    ActivityFormComponent,
    SelectModule,
  ],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CalendarPageComponent {
  @ViewChild('fullCalendarRef') calendarComponent!: FullCalendarComponent;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) {}

  familiesStore = inject(FamiliesStore);
  activityService = inject(ActivityService);

  calendarVisible = signal(true);

  allEvents: IActivity[] = [];
  currentEvents: MyEvent[] = [];
  selectedDateEvents: MyEvent[] = [];

  mostrarActivityModal = false;
  actividadInfo: IActivity | null = null;

  private familiaEffect = effect(async () => {
    const familia = this.familiesStore.familiaSeleccionada();
    console.log(familia, 'familia seleccionada en el efecto');
    if (familia == null || !this.calendarComponent) return;

    try {
      // Cargar los eventos de la familia seleccionada
      const activities = await this.activityService.getActivitiesFamily(
        String(familia.id)
      );
      console.log(activities, 'Actividades de la familia seleccionada');
      this.allEvents = activities;
      console.log(this.allEvents);
      const eventInputs = this.mapActivitiesToEvents(activities);
      this.currentEvents = eventInputs;
      this.filtrarEventosPorFecha(new Date().toISOString().slice(0, 10));

      // Actualizar el calendario con los nuevos eventos
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents(); // Limpia los eventos anteriores
      calendarApi.addEventSource(eventInputs);
    } catch (error) {
      console.error('Error al cargar los eventos:', error);
    }
  });


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
    height: 'auto',
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
    /*     eventsSet: this.handleEvents.bind(this),*/
    eventDidMount: this.eventDidMount.bind(this),
  });

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

  abrirActivityModal(actividad: IActivity | null = null) {
    this.actividadInfo = actividad || null;
    this.mostrarActivityModal = true;
    // Si no se pasa actividad, se inicializa como null
  }

  cerrarActivityModal() {
    this.mostrarActivityModal = false;
  }

  redirectToObjective() {
    this.router.navigate(['/objectives']);
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
      this.mostrarActivityModal = false;
    }
  }

  onCheckedChange(event: MyEvent) {
    console.log(event, 'checked:', event.checked);
  }

  editarActividad(actividad: Partial<IActivity>) {
    console.log('Editar actividad con ID:', actividad.id);
    // Aquí puedes implementar la lógica para editar la actividad
  }

  deleteActivity(actividad: IActivity) {
    console.log('Borrar actividad con ID:', actividad.id);
    this.activityService
      .deleteActivity(actividad.id, actividad.nino_id)
      .then(() => {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.getEventById(String(actividad.id))?.remove();
        this.allEvents = this.allEvents.filter(
          (event) => event.id !== actividad.id
        );
        this.currentEvents = this.mapActivitiesToEvents(this.allEvents);
        this.filtrarEventosPorFecha(new Date().toISOString().slice(0, 10));
      });
  }
}
