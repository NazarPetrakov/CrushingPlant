import { Component, inject, OnInit, signal } from '@angular/core';
import { SchemaComponent } from './schema/schema.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { AnimationMode } from './_models/animationMode';
import { EquipmentService } from './_services/equipment.service';
@Component({
  selector: 'app-root',
  imports: [SchemaComponent, MatButtonToggleModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit {
  service = inject(EquipmentService);

  ngOnInit(): void {
    this.service.startRandomMode();
  }

  changeMode(value: AnimationMode) {
    if (value === 'RANDOM') {
      this.service.startRandomMode();
    } else {
      this.service.startStepMode();
    }
  }
}
