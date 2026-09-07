import { Component, signal } from '@angular/core';
import { MorphingObject } from '../../shared/ui/morphing-object/morphing-object';
import { WaveBackground } from '../../shared/ui/wave-background/wave-background';
import { NavbarComponent } from '../../shared/ui/navbar/navbar';
import { ProcessStepsComponent } from '../../shared/ui/process-steps/process-steps';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  imports: [MorphingObject, WaveBackground, NavbarComponent, CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  // Let native browser scrolling work automatically without event listeners
}