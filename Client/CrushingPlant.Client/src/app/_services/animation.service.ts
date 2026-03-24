import { ElementRef } from '@angular/core';
import { FlowStep } from '../_models/flowStep';

interface FlowPayload {
  step: FlowStep;
  progress: number;
}

export class AnimationService {
  private get nativeSvg(): SVGSVGElement {
    return this.containerRef.nativeElement.querySelector('svg');
  }

  constructor(private containerRef: ElementRef) {}

  animate(flow: FlowPayload): void {
    switch (flow.step.animation) {
      case 'VIBRATE':
        this.animateVibration(flow);
        break;
      case 'SPLIT':
        this.animateSplit(flow);
        break;
      case 'FLOW':
        this.animateFlow(flow);
        break;
    }
  }

  private animateVibration({ step, progress }: FlowPayload): void {
    const intensity = Math.sin(progress * 20) * 15;

    for (const id of step.from) {
      const el = this.findEl(id);
      if (!el) continue;

      el.style.transform = `translate(${intensity}px, 0)`;
      el.style.opacity = '0.7';
    }
  }

  private animateSplit({ step, progress }: FlowPayload): void {
    const bunkerEl = this.findEl(step.from[0]);
    if (!bunkerEl) return;

    for (let i = 0; i < 3; i++) {
      this.spawnBunkerParticle(bunkerEl, progress, 'left');
      this.spawnBunkerParticle(bunkerEl, progress, 'right');
    }
  }

  private animateFlow({ step, progress }: FlowPayload): void {
    const conveyorEl = this.findEl(step.from[0]);
    if (!conveyorEl) return;

    const OFFSET = 0.15;
    const localProgress = (progress + OFFSET) % 1;

    this.spawnConveyorParticle(conveyorEl, localProgress);
  }

  private spawnBunkerParticle(
    el: Element,
    progress: number,
    direction: 'left' | 'right',
  ): void {
    const box = this.getRelativeBox(el);
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    const offset = (box.width / 2 - 75) * progress;

    const x = direction === 'left' ? centerX - offset : centerX + offset;

    this.spawnParticle(x, centerY, 7, 'red');
  }

  private spawnConveyorParticle(el: Element, progress: number): void {
    const box = this.getRelativeBox(el);
    const x = box.x + box.width * progress;
    const y = box.y + box.height / 2;

    this.spawnParticle(x, y, 11, 'red');
  }

  private spawnParticle(
    cx: number,
    cy: number,
    r: number,
    fill: string,
    lifetime = 400,
  ): void {
    const particle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle',
    );

    particle.setAttribute('cx', cx.toString());
    particle.setAttribute('cy', cy.toString());
    particle.setAttribute('r', r.toString());
    particle.setAttribute('fill', fill);

    this.nativeSvg.appendChild(particle);
    setTimeout(() => particle.remove(), lifetime);
  }

  private toSvgPoint(x: number, y: number): DOMPoint {
    const point = this.nativeSvg.createSVGPoint();
    point.x = x;
    point.y = y;
    return point.matrixTransform(this.nativeSvg.getScreenCTM()!.inverse());
  }

  private getRelativeBox(
    el: Element,
  ): DOMRect & { x: number; y: number; width: number; height: number } {
    const rect = el.getBoundingClientRect();
    const topLeft = this.toSvgPoint(rect.left, rect.top);
    const bottomRight = this.toSvgPoint(rect.right, rect.bottom);

    return {
      x: topLeft.x,
      y: topLeft.y,
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y,
    } as any;
  }

  private findEl(id: string): HTMLElement | null {
    return this.containerRef.nativeElement.querySelector(`[id="${id}"]`);
  }
}
