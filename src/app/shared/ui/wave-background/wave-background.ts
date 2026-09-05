import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  afterNextRender,
  inject,
  NgZone,
  HostListener,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-wave-background',
  standalone: true,
  host: {
    class: 'absolute inset-0 pointer-events-none overflow-hidden block z-0',
  },
  template: `<canvas #canvasRef class="h-full w-full block"></canvas>`,
})
export class WaveBackground implements OnInit, OnDestroy {
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private particles!: THREE.Points;
  private animFrameId!: number;
  private clock = new THREE.Clock();

  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);

  // Minimalist & sparse grid dimensions
  private readonly numX = 100;
  private readonly numZ = 40;
  private readonly separation = 1.1;

  constructor() {
    afterNextRender(() => {
      this.initScene();
      this.ngZone.runOutsideAngular(() => this.animate());
    });
  }

  ngOnInit(): void {}

  private initScene(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = this.canvasRef.nativeElement;
    const width = canvas.parentElement?.clientWidth || window.innerWidth;
    const height = canvas.parentElement?.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    
    // Angled perspective for horizontal sweeping visibility
    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    this.camera.position.set(0, 8, 30);
    this.camera.lookAt(0, -2, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const numParticles = this.numX * this.numZ;
    const positions = new Float32Array(numParticles * 3);

    let i = 0;
    for (let ix = 0; ix < this.numX; ix++) {
      for (let iz = 0; iz < this.numZ; iz++) {
        positions[i] = (ix - this.numX / 2) * this.separation;
        positions[i + 1] = 0;
        positions[i + 2] = (iz - this.numZ / 2) * this.separation;
        i += 3;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Soft, minimal glow texture
    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = 16;
    dotCanvas.height = 16;
    const ctx = dotCanvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.4, 'rgba(129, 140, 248, 0.4)');
    grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(8, 8, 8, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(dotCanvas);

    // Ultra-subtle point material settings
    const material = new THREE.PointsMaterial({
      size: 0.38,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.22, // Toned down transparency
    });

    this.particles = new THREE.Points(geometry, material);
    
    // Tilt grid slightly to align with screen layout
    this.particles.rotation.z = -0.05;
    this.scene.add(this.particles);
  }

private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);

    // Reduced clock multiplier (1.2 -> 0.4) for a slow, fluid pace
    const time = this.clock.getElapsedTime() * 1.2;
    const posAttr = this.particles.geometry.attributes['position'] as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    let i = 0;
    for (let ix = 0; ix < this.numX; ix++) {
      for (let iz = 0; iz < this.numZ; iz++) {
        // Widened wave frequency (0.12 -> 0.08) and slowed travel speed (1.8 -> 0.6)
        const waveX = ix * 0.08 - time * 0.6;
        const depthFactor = Math.sin(iz * 0.12 + time * 0.3);

        // Gentler, smooth height displacement (~0.35 max height)
        posArray[i + 1] = Math.sin(waveX) * 0.35 + depthFactor * 0.15;

        i += 3;
      }
    }

    posAttr.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
  };

  @HostListener('window:resize')
  onResize(): void {
    if (!this.renderer || !this.camera) return;
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.parentElement?.clientWidth || window.innerWidth;
    const height = canvas.parentElement?.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  ngOnDestroy(): void {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.particles) {
      this.particles.geometry.dispose();
      (this.particles.material as THREE.Material).dispose();
    }
    if (this.renderer) this.renderer.dispose();
  }
}