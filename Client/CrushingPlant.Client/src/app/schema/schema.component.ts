import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EquipmentService } from '../_services/equipment.service';
import { Equipment } from '../_models/equipment';
import { defer, delay, timer } from 'rxjs';

@Component({
  selector: 'app-schema',
  imports: [],
  templateUrl: './schema.component.html',
  styleUrl: './schema.component.scss',
  standalone: true,
})
export class SchemaComponent {
  private service = inject(EquipmentService);

  private selectedEquipment = signal<Equipment | null>(null);

  isAnimationStart = input.required<boolean>();

  svgContent: SafeHtml = '';

  @ViewChild('svgContainer') svgContainer!: ElementRef;

  private listenersAttached = false;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {
    effect(() => {
      if (this.isAnimationStart()) {
        this.service.startFetchingEquipments();
      } else {
        this.service.stopFetchingEquipments();
      }
    });

    effect(() => {
      const map = this.service.equipmentsMap();
      this.updateSvgStyles(map);
    });
  }

  private updateSvgStyles(map: Record<string, Equipment>) {
    if (!this.svgContainer) return;

    const container = this.svgContainer.nativeElement;

    for (const [id, equipment] of Object.entries(map)) {
      const el = container.querySelector(`#${id}`);
      if (!el) continue;

      this.applyStatusStyle(el, equipment.status);
    }
  }

  private applyStatusStyle(el: Element, status: Equipment['status']) {
    const colors: Record<string, string> = {
      RUN: '#00c851',
      OFF: '#aaaaaa',
      ALARM: '#ff4444',
    };
    (el as HTMLElement).style.fill = colors[status];
  }

  ngAfterViewInit() {
    this.loadSvg();
  }

  private loadSvg() {
    this.http.get('df.svg', { responseType: 'text' }).subscribe((svg) => {
      this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
      this.cdr.detectChanges();

      this.attachEventListenersOnce();
    });
  }

  private attachEventListenersOnce() {
    if (this.listenersAttached) return;

    const container = this.svgContainer.nativeElement;
    console.log('container HTML:', container.innerHTML);

    Object.entries(this.service.equipmentsMap()).forEach(([id, equipment]) => {
      console.log('ids:', id);
      const el = container.querySelector(`#${id}`);
      console.log('elements:', el);
      if (!el) return;

      el.style.cursor = 'pointer';

      el.addEventListener('click', () => this.onElementClick(equipment));

      el.addEventListener(
        'mouseenter',
        () => (el.style.filter = 'brightness(1.3)'),
      );

      el.addEventListener('mouseleave', () => {
        el.style.filter = '';
      });
    });

    this.listenersAttached = true;
  }

  onElementClick(equipment: Equipment) {
    this.selectedEquipment.set(equipment);
    console.log(equipment);
  }
}
