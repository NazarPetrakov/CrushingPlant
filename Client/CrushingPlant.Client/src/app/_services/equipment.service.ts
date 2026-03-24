import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Equipment } from '../_models/equipment';
import { repeat, Subscription } from 'rxjs';
import {
  BunkerMetrics,
  ConveyorMetrics,
  CrusherMetrics,
} from '../_models/metrics';
import { AnimationMode } from '../_models/animationMode';
import { FlowStep } from '../_models/flowStep';
import { INITIAL_EQUIPMENT_MAP } from '../Helpers/equipmentMap';
import { FLOW_STEPS } from '../Helpers/flowSteps';

const STEP_TICK_MS = 100;
const STEP_INCREMENT = 0.05;
const FETCH_INTERVAL_MS = 5000;

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5000';

  private _mode = signal<AnimationMode>('RANDOM');
  readonly mode = this._mode.asReadonly();

  private _visualState = signal<Record<string, 'ACTIVE'>>({});
  readonly visualState = this._visualState.asReadonly();

  private _equipmentsMap = signal<Record<string, Equipment>>(
    structuredClone(INITIAL_EQUIPMENT_MAP),
  );
  readonly equipmentsMap = this._equipmentsMap.asReadonly();

  private _flow = signal<{ step: FlowStep; progress: number } | null>(null);
  readonly flow = this._flow.asReadonly();

  private fetchSubscription: Subscription | undefined;
  private readonly apiToSvgId = this.buildApiToSvgIdMap();

  startRandomMode() {
    this.stopAll();
    this._mode.set('RANDOM');
    this.startFetchingEquipments();
    console.log('RANDOM mode started');
  }
  startStepMode() {
    this.stopAll();
    this.turnAllOff();
    this._mode.set('STEP');

    this.runStepSequence(FLOW_STEPS);

    console.log('STEP mode started');
  }

  getCrusherMetrics(id: string) {
    return this.http.get<CrusherMetrics>(
      `${this.baseUrl}/equipments/${id}/crusher-metrics`,
    );
  }
  getConveyorMetrics(id: string) {
    return this.http.get<ConveyorMetrics>(
      `${this.baseUrl}/equipments/${id}/conveyor-metrics`,
    );
  }
  getBunkerMetrics(id: string) {
    return this.http.get<BunkerMetrics>(
      `${this.baseUrl}/equipments/${id}/bunker-metrics`,
    );
  }

  private runStepSequence(steps: FlowStep[], index = 0): void {
    if (index >= steps.length) return;

    const step = steps[index];

    this.setEquipmentStatus(step.from, 'RUN');
    this._visualState.set(
      Object.fromEntries(
        (step.highlight ?? []).map((id) => [id, 'ACTIVE' as const]),
      ),
    );

    let progress = 0;

    const interval = setInterval(() => {
      progress += STEP_INCREMENT;
      this._flow.set({ step, progress });

      if (progress < 1) return;

      clearInterval(interval);
      this._visualState.set({});
      this.setEquipmentStatus(step.to, 'RUN');
      this.runStepSequence(steps, index + 1);
    }, STEP_TICK_MS);
  }

  private setEquipmentStatus(ids: string[], status: Equipment['status']): void {
    this._equipmentsMap.update((map) => {
      const updated = { ...map };
      for (const id of ids) {
        const eq = updated[id];
        if (eq)
          updated[id] = new Equipment(
            eq.id,
            eq.name,
            status,
            eq.type,
            new Date(),
          );
      }
      return updated;
    });
  }

  private startFetchingEquipments() {
    if (this.fetchSubscription) return;

    this.fetchSubscription = this.http
      .get<Equipment[]>(`${this.baseUrl}/equipment`)
      .pipe(repeat({ delay: FETCH_INTERVAL_MS }))
      .subscribe((equipments) => {
        this.mergeEquipments(equipments);
      });

    console.log('Fetching equipments started.');
  }

  private stopAll() {
    this.fetchSubscription?.unsubscribe();
    this.fetchSubscription = undefined;
  }

  private turnAllOff(): void {
    this._equipmentsMap.update((map) =>
      Object.fromEntries(
        Object.entries(map).map(([svgId, eq]) => [
          svgId,
          new Equipment(eq.id, eq.name, 'OFF', eq.type, eq.updatedAt),
        ]),
      ),
    );
  }

  private mergeEquipments(equipments: Equipment[]) {
    this._equipmentsMap.update((records) => {
      const updated = { ...records };
      for (const equipment of equipments) {
        const svgId = this.apiToSvgId[equipment.id];
        if (svgId && updated[svgId]) {
          updated[svgId] = new Equipment(
            equipment.id,
            equipment.name,
            equipment.status,
            equipment.type,
            new Date(equipment.updatedAt),
          );
        }
      }
      return updated;
    });
  }

  private buildApiToSvgIdMap(): Record<string, string> {
    return Object.entries(INITIAL_EQUIPMENT_MAP).reduce(
      (acc, [svgId, eq]) => {
        acc[eq.id] = svgId;
        return acc;
      },
      {} as Record<string, string>,
    );
  }
}
