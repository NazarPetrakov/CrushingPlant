import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Equipment } from '../_models/equipment';
import { repeat, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private client = inject(HttpClient);
  private getEquipmentsSubscription: Subscription | undefined;

  private _equipmentsMap = signal<Record<string, Equipment>>({
    path7895: new Equipment('kkd-11', '', 'OFF', 'crusher', new Date()),
    path7072: new Equipment('bunk-1', '', 'OFF', 'bunker', new Date()),
    'path7895-4-7': new Equipment('krd-12', '', 'OFF', 'crusher', new Date()),
    'path7895-4-4': new Equipment('krd-13', '', 'OFF', 'crusher', new Date()),
    'path6910-8': new Equipment('bunk-2', '', 'OFF', 'bunker', new Date()),
    'K-2-1': new Equipment('conv-k-2', '', 'OFF', 'conveyor', new Date()),
    'K-1-1': new Equipment('conv-k-1', '', 'OFF', 'conveyor', new Date()),
    'M-2-1': new Equipment('conv-m-2', '', 'OFF', 'conveyor', new Date()),
    'M-1-1': new Equipment('conv-m-1', '', 'OFF', 'conveyor', new Date()),
    'path6910-8-6-6': new Equipment('bunk-3', '', 'OFF', 'bunker', new Date()),
    'path7054-0-9': new Equipment('ksd-3', '', 'OFF', 'crusher', new Date()),
    'path7054-0-9-23': new Equipment('kmd-3', '', 'OFF', 'crusher', new Date()),
    'path7054-0': new Equipment('ksd-4', '', 'OFF', 'crusher', new Date()),
    'path7054-0-9-64': new Equipment('kmd-4', '', 'OFF', 'crusher', new Date()),
    'path7054-0-9-6': new Equipment('ksd-5', '', 'OFF', 'crusher', new Date()),
    'path7054-0-9-7': new Equipment('kmd-5', '', 'OFF', 'crusher', new Date()),
    'path7054-0-9-8': new Equipment('ksd-6', '', 'OFF', 'crusher', new Date()),
    'path7054-0-9-38': new Equipment('kmd-6', '', 'OFF', 'crusher', new Date()),
    'M-15': new Equipment('conv-m-15', '', 'OFF', 'conveyor', new Date()),
  });

  readonly equipmentsMap = this._equipmentsMap.asReadonly();

  startFetchingEquipments() {
    if (this.getEquipmentsSubscription) return;

    this.getEquipmentsSubscription = this.client
      .get<Equipment[]>('https://localhost:7101/equipment')
      .pipe(repeat({ delay: 10000 }))
      .subscribe((equipments) => {
        this.updateMapEquipments(equipments);
      });

    console.log('Fetching equipments started.');
  }
  stopFetchingEquipments() {
    this.getEquipmentsSubscription?.unsubscribe();
    this.getEquipmentsSubscription = undefined;
    console.log('Fetching equipments stopped.');
  }
  private updateMapEquipments(equipments: Equipment[]) {
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

  private readonly apiToSvgId = Object.entries(this._equipmentsMap()).reduce(
    (acc, [svgId, eq]) => {
      acc[eq.id] = svgId;
      return acc;
    },
    {} as Record<string, string>,
  );
}
