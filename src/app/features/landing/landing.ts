import { Component } from '@angular/core';
import { MorphingObject } from '../../shared/ui/morphing-object/morphing-object';
import { WaveBackground } from '../../shared/ui/wave-background/wave-background';

@Component({
  selector: 'app-landing',
  imports: [MorphingObject,WaveBackground],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {

}
