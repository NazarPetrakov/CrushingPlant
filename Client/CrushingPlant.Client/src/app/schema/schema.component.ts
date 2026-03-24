import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
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
import { MatDialog } from '@angular/material/dialog';
import {
  EquipmentInfoDialog,
  EquipmentInfoDialogData,
} from '../modals/equipment-info-dialog/equipment-info-dialog.component';
import { FlowStep } from '../_models/flowStep';
import { SvgRenderer } from '../_services/svgRenderer';
import { AnimationService } from '../_services/animation.service';

@Component({
  selector: 'app-schema',
  imports: [],
  templateUrl: './schema.component.html',
  styleUrl: './schema.component.scss',
  standalone: true,
})
export class SchemaComponent implements AfterViewInit {
  private service = inject(EquipmentService);
  private dialog = inject(MatDialog);

  svgContent: SafeHtml = '';

  @ViewChild('svgContainer') svgContainer!: ElementRef;

  private renderer!: SvgRenderer;
  private animator!: AnimationService;
  private listenersAttached = false;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {
    effect(() => {
      const visual = this.service.visualState();
      this.renderer?.updateVisualStyles(visual);
    });

    effect(() => {
      const map = this.service.equipmentsMap();
      this.renderer?.updateEquipmentStyles(map);
    });

    effect(() => {
      const flow = this.service.flow();
      if (!flow) return;
      this.animator?.animate(flow);
    });
  }

  ngAfterViewInit(): void {
    this.loadSvg();
  }

  private loadSvg(): void {
    this.http.get('df.svg', { responseType: 'text' }).subscribe((svg) => {
      this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);
      this.cdr.detectChanges();

      this.renderer = new SvgRenderer(this.svgContainer);
      this.animator = new AnimationService(this.svgContainer);

      this.attachEventListenersOnce();
    });
  }

  private attachEventListenersOnce(): void {
    if (this.listenersAttached) return;

    const container = this.svgContainer.nativeElement;

    for (const [id] of Object.entries(this.service.equipmentsMap())) {
      const el = container.querySelector(`#${id}`) as HTMLElement | null;
      if (!el) continue;

      el.style.cursor = 'pointer';
      el.addEventListener('click', () => this.onElementClick(id));
      el.addEventListener(
        'mouseenter',
        () => (el.style.filter = 'brightness(1.3)'),
      );
      el.addEventListener('mouseleave', () => (el.style.filter = ''));
    }

    this.listenersAttached = true;
  }

  private onElementClick(svgObjectId: string): void {
    const data: EquipmentInfoDialogData = { svgObjectId };
    this.dialog.open(EquipmentInfoDialog, { data });
  }
}
