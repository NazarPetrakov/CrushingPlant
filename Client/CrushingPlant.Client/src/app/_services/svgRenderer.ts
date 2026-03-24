import { ElementRef } from '@angular/core';
import { Equipment } from '../_models/equipment';

const STATUS_COLORS: Record<string, string> = {
  RUN: '#00c851',
  OFF: '#aaaaaa',
  ALARM: '#ff4444',
};

const VISUAL_RESET_STYLES = {
  fill: '#cccccc',
  fillOpacity: '1',
  stroke: '#666666',
  filter: '',
};

const VISUAL_ACTIVE_STYLES = {
  opacity: '1',
  fill: '#29913f',
  stroke: '#00c851',
  filter: 'drop-shadow(0 0 6px #00c851)',
};

export class SvgRenderer {
  private get container(): HTMLElement {
    return this.containerRef.nativeElement;
  }

  constructor(private containerRef: ElementRef) {}

  updateEquipmentStyles(map: Record<string, Equipment>): void {
    for (const [id, equipment] of Object.entries(map)) {
      const el = this.container.querySelector(`#${id}`) as HTMLElement | null;
      if (!el) continue;

      el.style.fill = STATUS_COLORS[equipment.status] ?? STATUS_COLORS['OFF'];
      el.style.opacity = '0.7';
    }
  }

  updateVisualStyles(map: Record<string, 'ACTIVE'>): void {
    this.resetVisualElements();

    for (const [id, state] of Object.entries(map)) {
      const el = this.container.querySelector(`#${id}`) as HTMLElement | null;
      if (!el || state !== 'ACTIVE') continue;

      Object.assign(el.style, VISUAL_ACTIVE_STYLES);
    }
  }

  private resetVisualElements(): void {
    this.container.querySelectorAll('[data-visual]').forEach((el) => {
      Object.assign((el as HTMLElement).style, VISUAL_RESET_STYLES);
    });
  }
}
