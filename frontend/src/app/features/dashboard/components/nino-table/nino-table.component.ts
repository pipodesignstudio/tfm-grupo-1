import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { ChildService } from '../../../../shared/services';
import { IChild } from '../../../../shared/interfaces';
import { signal } from '@angular/core';
import { catchError, finalize, from, of, take } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-nino-table',
  imports: [SkeletonModule, AvatarModule, TagModule, CommonModule, TooltipModule],
  templateUrl: './nino-table.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NinoTableComponent {
  @Input({required: true}) nino_id!: number;

  private cs = inject(ChildService);
  private sanitizer = inject(DomSanitizer);

  public isLoading = signal<boolean>(true);

  public nino: IChild | null = null;
  public img_perfil: SafeUrl | null = null;

  ngOnInit(): void {
    from(this.cs.getNinoById(this.nino_id)).pipe(
      take(1),
      catchError((error) => {
        console.error(error);
        this.isLoading.set(false);
        return of(null);
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe(
      (nino) => {
        this.nino = nino;
        if (nino?.img_perfil) {
          this.processImageFromPrisma(nino.img_perfil);
        }
      },
    )
  }

  processImageFromPrisma(imgData: any): void {
    try {
      const keys = Object.keys(imgData)
        .filter(key => !isNaN(parseInt(key)))
        .map(key => parseInt(key))
        .sort((a, b) => a - b);
      
      const byteArray = keys.map(key => imgData[key]);
      
      let base64String = btoa(String.fromCharCode(...byteArray));
      
      const jpegStart = base64String.indexOf('/9j/');
      if (jpegStart > 0) {
        base64String = base64String.substring(jpegStart);
      }
      
      const imageUrl = `data:image/jpeg;base64,${base64String}`;
      
      this.img_perfil = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
      
    } catch (error) {
      console.error('Error procesando imagen:', error);
    }
  }

}