import {
  Component,
  forwardRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import * as L from 'leaflet';

// Define the IUbicacion interface if not imported from elsewhere
export interface IUbicacion {
  address?: string;
  lat?: number;
  lon?: number;
}


@Component({
  selector: 'app-ubicacion',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UbicacionComponent),
      multi: true,
    },
  ],
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.css'],
})
export class UbicacionComponent
  implements ControlValueAccessor, AfterViewInit
{
  @ViewChild('map') mapRef!: ElementRef;
  @ViewChild('search') searchInput!: ElementRef;

  @Input() ubicacion: IUbicacion | null = null;

  map!: L.Map;
  marker!: L.Marker;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  address: string = this.ubicacion?.address || '';

  ngAfterViewInit() {
  const initialLat = this.ubicacion?.lat || 40.4168;
  const initialLon = this.ubicacion?.lon || -3.7038;

  this.map = L.map(this.mapRef.nativeElement).setView([initialLat, initialLon], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  }).addTo(this.map);

  // Crear icono personalizado
  const customIcon = L.icon({
    iconUrl: '/map-marker-icon.png', // Asegúrate de que este path sea accesible desde el navegador
    iconSize: [30, 40], // tamaño del icono
    iconAnchor: [15, 40], // punto del icono que se ancla en la coordenada
    popupAnchor: [0, -40], // punto desde el que se abre el popup
    shadowUrl: '', // opcional
  });

  this.marker = L.marker([initialLat, initialLon], {
    draggable: true,
    icon: customIcon,
  }).addTo(this.map);

  // Mover el marcador al hacer clic en el mapa
  this.map.on('click', (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    this.marker.setLatLng([lat, lng]);
    this.getAddressFromCoords(lat, lng);
  });

  this.marker.on('dragend', () => {
    const pos = this.marker.getLatLng();
    this.getAddressFromCoords(pos.lat, pos.lng);
  });
}


  async buscarDireccion() {
    const query = this.searchInput.nativeElement.value;
    if (!query) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.length > 0) {
      const place = data[0];
      const lat = parseFloat(place.lat);
      const lon = parseFloat(place.lon);

      this.map.setView([lat, lon], 15);
      this.marker.setLatLng([lat, lon]);
      this.address = place.display_name;
      this.onChange({ address: this.address, lat, lon });
    }
  }

  async getAddressFromCoords(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url);
    const data = await res.json();
    this.address = data.display_name;
    this.onChange({ address: this.address, lat, lon });
  }

  writeValue(obj: any): void {
    if (obj && obj.lat && obj.lon) {
      this.address = obj.address || '';
      if (this.marker && this.map) {
        this.marker.setLatLng([obj.lat, obj.lon]);
        this.map.setView([obj.lat, obj.lon], 13);
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
