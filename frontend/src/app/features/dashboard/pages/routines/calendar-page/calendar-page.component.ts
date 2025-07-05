import { FamilyService } from './../../../../../shared/services/family.service';
import { ChildService } from './../../../../../shared/services/child.service';
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

import { format } from 'date-fns';
import { ActivityService } from '../../../../../shared/services/activity.service';

import { IActivity } from '../../../../../shared/interfaces/iactivity.interface';

import { EventInput } from '@fullcalendar/core';

import { ActivityFormComponent } from '../../../../../components/activity/activity-form.component';
import { FamiliesStore } from '../../../../../shared/services/familiesStore.service';

import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { IChild, IUser } from '../../../../../shared/interfaces';
import { IFamiliaUsuario } from '../../../../../shared/interfaces/ifamily-users.interface';
import { IUsersFamilies } from '../../../../../shared/interfaces/iusers-families.interface';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
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

  childService = inject(ChildService);
  children: IChild[] = [];

  familyService = inject(FamilyService);
  usersFamily: IFamiliaUsuario[] = [];
  userFamilia: IUsersFamilies | null = null;

  allEvents: IActivity[] = [];
  currentEvents: EventInput[] = [];
  selectedDateEvents: EventInput[] = [];

  filtroOpciones: { label: string; value: number | null }[] = [];

  mostrarActivityModal = false;
  actividadInfo: IActivity | null = null;

  clickedDate: string = new Date().toISOString().slice(0, 10);

  ngOnInit() {
    // Inicializar el calendario y cargar la familia seleccionada
    this.familiaEffect;
    this.changeDetector.detectChanges();
  }


  private familiaEffect = effect(async () => {
    this.userFamilia = this.familiesStore.familiaSeleccionada();
    if (this.userFamilia == null || !this.calendarComponent) return;
    console.log(this.userFamilia);

    try {
      // Cargar los niños de la familia seleccionada
      this.children = await this.childService.getChildrenByFamily(
        String(this.userFamilia.id)
      );

      this.usersFamily = await this.familyService.getAllUsersFamily(
        String(this.userFamilia.id)
      );

      console.log('usuarios de la familia:', this.usersFamily);

      this.filtroOpciones = this.children.map((child) => ({
        label: child.nombre,
        value: Number(child.id),
      }));
      this.changeDetector.detectChanges();

      // Cargar los eventos de la familia seleccionada
      const activities = await this.activityService.getActivitiesFamily(
        String(this.userFamilia.id)
      );
      this.initEventosCalendario(activities);
    } catch (error) {
      console.error('Error al cargar los eventos:', error);
    }
  });

  selectedDate = format(new Date(), 'MMMM, do, EEE');
  filtroSeleccionado: number | null = null;

  async filtrarEventos() {
    console.log('filtro seleccionado:', this.filtroSeleccionado);
    const filterValue: number | null = this.filtroSeleccionado;
    if (!filterValue) {
      this.currentEvents = this.mapActivitiesToEvents(this.allEvents);
    } else {
      this.currentEvents = this.mapActivitiesToEvents(
        this.allEvents.filter(
          (evento: IActivity) => evento.ninos_id == filterValue
        )
      );
    }

    // Actualizar el calendario con los nuevos eventos
    const calendarApi = this.calendarComponent.getApi();

    calendarApi.removeAllEvents(); // Limpia los eventos anteriores
    // Limpia todos los dots (al principio de la función o antes de render)
    document
      .querySelectorAll('.has-event-dot')
      .forEach((el) => el.classList.remove('has-event-dot'));

    calendarApi.addEventSource(this.currentEvents);
    calendarApi.render(); // Renderiza el calendario con los nuevos eventos
  }

  private filtrarEventosPorFecha(fecha: string) {
    const filtrados = this.currentEvents.filter(
      (event: any) => event.start === fecha
    );

    this.selectedDateEvents = filtrados;

    console.log(filtrados, this.selectedDate);

    this.selectedDate = format(new Date(fecha), 'MMMM, do, EEE');

    console.log(`Eventos filtrados para la fecha ${fecha}:`, filtrados);
    this.changeDetector.detectChanges();
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
    eventDidMount: this.eventDidMount.bind(this),
    locale: esLocale,
  });

  // Metodo para añadir el dot
  eventDidMount(info: any) {
    const dateStr = info.event.startStr.split('T')[0];
    const dayCell = document.querySelector(`[data-date="${dateStr}"]`);

    if (dayCell && !dayCell.classList.contains('has-event-dot')) {
      dayCell.classList.add('has-event-dot');
    }
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.clickedDate = selectInfo.startStr.split('T')[0];
    this.filtrarEventosPorFecha(this.clickedDate);
    this.changeDetector.detectChanges();
  }

  private mapActivitiesToEvents(activities: IActivity[]): EventInput[] {
    return activities.map((activity) => ({
      id: String(activity.id),
      title: activity.titulo,
      start: format(new Date(activity.fecha_realizacion), 'yyyy-MM-dd'), // asegúrate que `fecha` sea en formato ISO o YYYY-MM-DD
      allDay: true,
      color: activity.color ?? undefined,
      actividadInfo: activity, 
    }));
  }

  actividadTipo: 'evento' | 'objetivo' | 'rutina' | null = "evento"; // Por defecto, el tipo de actividad es 'evento'
  abrirActivityModal(actividad: IActivity | null = null) {
    this.actividadInfo = actividad || null;
    this.actividadTipo = actividad ? actividad.tipo?.toLowerCase() as 'evento' | 'objetivo' | 'rutina' : 'evento';
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

          this.allEvents.push(actividadCreada);
          this.initEventosCalendario(this.allEvents);
        });
    } catch (error) {
      console.error('Error al crear la actividad:', error);
    } finally {
      this.cerrarActivityModal();
    }
  }

  initEventosCalendario(activities: IActivity[]) {
    this.allEvents = activities;
    console.log(this.allEvents);
    const eventInputs = this.mapActivitiesToEvents(activities);
    this.currentEvents = eventInputs;

    // Actualizar el calendario con los nuevos eventos
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents(); // Limpia los eventos anteriores

    console.log('Eventos antes de añadir:', eventInputs);
    calendarApi.addEventSource(eventInputs);
    calendarApi.render(); // Renderiza el calendario con los nuevos eventos

    this.filtrarEventosPorFecha(this.clickedDate);
  }

  onCheckedChange(event: EventInput) {
    this.editarActividad(event['actividadInfo']);
  }

  editarActividad(actividad: Partial<IActivity>) {
    console.log('Editar actividad con ID:', actividad);
    this.activityService
      .updateActivity(actividad as IActivity)
      .then((actividadActualizada) => {
        console.log('Actividad actualizada:', actividadActualizada);

        // Actualizar el evento en el calendario
        this.allEvents = this.allEvents.map((event) =>
          event.id === actividad.id
            ? {
                ...event,
                ...actividadActualizada,
                titulo: actividad.titulo ?? event.titulo,
                descripcion: actividad.descripcion ?? event.descripcion,
                hora_inicio: actividad.hora_inicio ?? event.hora_inicio,
                hora_fin: actividad.hora_fin ?? event.hora_fin,
                color: actividad.color ?? event.color,
                usuario_responsable:
                  actividad.usuario_responsable ?? event.usuario_responsable,
                ubicacion: actividad.ubicacion ?? event.ubicacion,
                fecha_realizacion: actividad.fecha_realizacion
                  ? new Date(actividad.fecha_realizacion)
                  : event.fecha_realizacion,
              }
            : event
        );
        this.initEventosCalendario(this.allEvents);
      });
    this.cerrarActivityModal();
  }

  deleteActivity(actividad: IActivity) {
    console.log('Borrar actividad con ID:', actividad.id);
    this.activityService
      .deleteActivity(actividad.id, actividad.ninos_id)
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
