import {
  Component,
  computed,
  inject,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { EquipmentService } from '../../_services/equipment.service';
import { Equipment } from '../../_models/equipment';
import {
  BunkerMetrics,
  ConveyorMetrics,
  CrusherMetrics,
} from '../../_models/metrics';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-equipment-info-dialog',
  imports: [
    DatePipe,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
  ],
  templateUrl: './equipment-info-dialog.component.html',
})
export class EquipmentInfoDialog {
  private service = inject(EquipmentService);

  private metrics = signal<
    CrusherMetrics | BunkerMetrics | ConveyorMetrics | null
  >(null);

  readonly dialogRef = inject(MatDialogRef<EquipmentInfoDialog>);
  readonly data = inject<EquipmentInfoDialogData>(MAT_DIALOG_DATA);

  equipment = signal<Equipment | null>(null);

  crusherMetrics = computed<CrusherMetrics | null>(() =>
    this.equipment()?.type === 'crusher'
      ? (this.metrics() as CrusherMetrics)
      : null,
  );

  conveyorMetrics = computed<ConveyorMetrics | null>(() =>
    this.equipment()?.type === 'conveyor'
      ? (this.metrics() as ConveyorMetrics)
      : null,
  );

  bunkerMetrics = computed<BunkerMetrics | null>(() =>
    this.equipment()?.type === 'bunker'
      ? (this.metrics() as BunkerMetrics)
      : null,
  );

  ngOnInit(): void {
    const map = this.service.equipmentsMap();
    const eq = map[this.data.svgObjectId];
    this.equipment.set(eq);

    if (!eq) return;

    switch (eq.type) {
      case 'crusher':
        this.service.getCrusherMetrics(eq.id).subscribe((m) =>
          this.metrics.set({
            ...m,
            metricsUpdatedAt: m.metricsUpdatedAt
              ? new Date(m.metricsUpdatedAt)
              : null,
          }),
        );
        break;

      case 'conveyor':
        this.service.getConveyorMetrics(eq.id).subscribe((m) =>
          this.metrics.set({
            ...m,
            metricsUpdatedAt: m.metricsUpdatedAt
              ? new Date(m.metricsUpdatedAt)
              : null,
          }),
        );
        break;

      case 'bunker':
        this.service.getBunkerMetrics(eq.id).subscribe((m) =>
          this.metrics.set({
            ...m,
            metricsUpdatedAt: m.metricsUpdatedAt
              ? new Date(m.metricsUpdatedAt)
              : null,
          }),
        );
        break;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
export interface EquipmentInfoDialogData {
  svgObjectId: string;
}
