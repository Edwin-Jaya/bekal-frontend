// morphing-3d.component.ts
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  afterNextRender,
  inject,
  signal,
  PLATFORM_ID,
  NgZone,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

type ShapeName = 'Sphere' | 'Home' | 'Car' | 'Wallet';

interface ShapeTransform {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  color: [number, number, number];
}

interface MultiBoxSpec {
  house: ShapeTransform;
  car: ShapeTransform;
  wallet: ShapeTransform;
  subdiv?: number;
}

@Component({
  selector: 'app-morphing-object',
  standalone: true,
  host: {
    class: 'block w-full h-full',
  },
  template: `
    <div class="relative flex flex-col items-center justify-between w-full h-full">
      <!-- 3D Canvas Area -->
      <div class="relative w-full flex-1 min-h-[250px]">
        <canvas #canvasRef class="absolute inset-0 h-full w-full"></canvas>
      </div>

      <!-- Label Directly Below Object -->
      <div
        class="pointer-events-none mt-2 pb-2 text-center text-sm font-semibold tracking-[0.3em] uppercase text-gray-700 transition-opacity duration-500 z-10"
        [class.opacity-0]="isTransitioning() || currentLabel() === 'Sphere'"
        [class.opacity-100]="!isTransitioning() && currentLabel() !== 'Sphere'"
      >
        {{ currentLabel() }}
      </div>
    </div>
  `,
})
export class MorphingObject implements OnInit, OnDestroy {
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private blob!: THREE.Mesh;
  private animationFrameId!: number;
  private clock = new THREE.Clock();

  private pmremGenerator!: THREE.PMREMGenerator;
  private envTexture!: THREE.Texture;
  private keyLight!: THREE.DirectionalLight;
  private fillLight!: THREE.DirectionalLight;

  private resizeObserver?: ResizeObserver;
  private resizeRaf = 0;
  private sceneRadius = 1.85;

  private startTime = Date.now();
  private shapePositions: Float32Array[] = [];
  private shapeColors: Float32Array[] = [];
  private readonly shapeNames: ShapeName[] = ['Sphere', 'Home', 'Car', 'Wallet'];

  private currentIndex = 0;
  private nextIndex = 1;
  private segmentStart = 0;

  private readonly HOLD_DURATION = 2.4;
  private readonly MORPH_DURATION = 2.0;
  private readonly SEGMENT_DURATION = this.HOLD_DURATION + this.MORPH_DURATION;

  currentLabel = signal<ShapeName>(this.shapeNames[0]);
  isTransitioning = signal(false);

  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);

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
    const { width, height } = this.readSize(canvas);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.envTexture = this.pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = this.envTexture;

    this.keyLight = new THREE.DirectionalLight(0xfff5e6, 2.6);
    this.keyLight.position.set(4, 5, 4);
    this.scene.add(this.keyLight);

    this.fillLight = new THREE.DirectionalLight(0x88adff, 1.4);
    this.fillLight.position.set(-4, -2, -3);
    this.scene.add(this.fillLight);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.45));

    const { spherePositions, housePositions, carPositions, walletPositions, sphereColors, houseColors, carColors, walletColors } =
      this.buildProceduralModels();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(spherePositions), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(sphereColors), 3));

    const material = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.22,
      metalness: 0.05,
      clearcoat: 0.85,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.3,
      side: THREE.DoubleSide,
    });

    this.blob = new THREE.Mesh(geometry, material);
    this.blob.rotation.x = 0.1;
    this.scene.add(this.blob);

    this.shapePositions = [spherePositions, housePositions, carPositions, walletPositions];
    this.shapeColors = [sphereColors, houseColors, carColors, walletColors];

    this.updateCameraForSize(width, height);
    this.setupResizeObserver(canvas);

    this.clock.start();
    this.segmentStart = (Date.now() - this.startTime) / 1000;
  }

  private readSize(canvas: HTMLCanvasElement): { width: number; height: number } {
    const parent = canvas.parentElement;
    const width = parent?.clientWidth || canvas.clientWidth || window.innerWidth;
    const height = parent?.clientHeight || canvas.clientHeight || window.innerHeight;
    return { width: Math.max(1, width), height: Math.max(1, height) };
  }

  private updateCameraForSize(width: number, height: number): void {
    const aspect = width / height;
    this.camera.aspect = aspect;

    const margin = 1.45;
    const vFov = (this.camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const limitingFov = Math.min(vFov, hFov);

    const distance = (this.sceneRadius * margin) / Math.sin(limitingFov / 2);
    this.camera.position.set(0, 0.12, distance);
    this.camera.lookAt(0, -0.05, 0);
    this.camera.updateProjectionMatrix();
  }

  private setupResizeObserver(canvas: HTMLCanvasElement): void {
    if (typeof ResizeObserver === 'undefined') return;
    this.resizeObserver = new ResizeObserver(() => this.scheduleResize());
    const target = canvas.parentElement ?? canvas;
    this.resizeObserver.observe(target);
  }

  private scheduleResize(): void {
    if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf);
    this.resizeRaf = requestAnimationFrame(() => this.applyResize());
  }

  private applyResize(): void {
    if (!this.renderer || !this.camera || !isPlatformBrowser(this.platformId)) return;
    const canvas = this.canvasRef.nativeElement;
    const { width, height } = this.readSize(canvas);
    this.renderer.setSize(width, height);
    this.updateCameraForSize(width, height);
  }

  // ---------------------------------------------------------------------
  // Synchronized Geometry Builder & Perfect Ball Calculations
  // ---------------------------------------------------------------------

  private buildProceduralModels(): {
    spherePositions: Float32Array;
    housePositions: Float32Array;
    carPositions: Float32Array;
    walletPositions: Float32Array;
    sphereColors: Float32Array;
    houseColors: Float32Array;
    carColors: Float32Array;
    walletColors: Float32Array;
  } {
    const hPos: number[] = [], cPos: number[] = [], wPos: number[] = [];
    const hCols: number[] = [], cCols: number[] = [], wCols: number[] = [], sCols: number[] = [];

    const COLOR_SPHERE: [number, number, number] = [0.62, 0.55, 0.92];

    const addQuadPair = (
      hP: [[number, number, number], [number, number, number], [number, number, number], [number, number, number]],
      cP: [[number, number, number], [number, number, number], [number, number, number], [number, number, number]],
      wP: [[number, number, number], [number, number, number], [number, number, number], [number, number, number]],
      hColor: [number, number, number],
      cColor: [number, number, number],
      wColor: [number, number, number],
      subdiv = 7
    ) => {
      for (let i = 0; i < subdiv; i++) {
        const u0 = i / subdiv;
        const u1 = (i + 1) / subdiv;
        for (let j = 0; j < subdiv; j++) {
          const v0 = j / subdiv;
          const v1 = (j + 1) / subdiv;

          const lerpQuad = (
            p: [[number, number, number], [number, number, number], [number, number, number], [number, number, number]],
            u: number,
            v: number
          ): [number, number, number] => [
            (1 - u) * (1 - v) * p[0][0] + u * (1 - v) * p[1][0] + u * v * p[2][0] + (1 - u) * v * p[3][0],
            (1 - u) * (1 - v) * p[0][1] + u * (1 - v) * p[1][1] + u * v * p[2][1] + (1 - u) * v * p[3][1],
            (1 - u) * (1 - v) * p[0][2] + u * (1 - v) * p[1][2] + u * v * p[2][2] + (1 - u) * v * p[3][2],
          ];

          const hq00 = lerpQuad(hP, u0, v0), hq10 = lerpQuad(hP, u1, v0), hq11 = lerpQuad(hP, u1, v1), hq01 = lerpQuad(hP, u0, v1);
          const cq00 = lerpQuad(cP, u0, v0), cq10 = lerpQuad(cP, u1, v0), cq11 = lerpQuad(cP, u1, v1), cq01 = lerpQuad(cP, u0, v1);
          const wq00 = lerpQuad(wP, u0, v0), wq10 = lerpQuad(wP, u1, v0), wq11 = lerpQuad(wP, u1, v1), wq01 = lerpQuad(wP, u0, v1);

          hPos.push(...hq00, ...hq10, ...hq11, ...hq00, ...hq11, ...hq01);
          cPos.push(...cq00, ...cq10, ...cq11, ...cq00, ...cq11, ...cq01);
          wPos.push(...wq00, ...wq10, ...wq11, ...wq00, ...wq11, ...wq01);

          for (let k = 0; k < 6; k++) {
            hCols.push(...hColor);
            cCols.push(...cColor);
            wCols.push(...wColor);
            sCols.push(...COLOR_SPHERE);
          }
        }
      }
    };

    const addBoxMulti = (spec: MultiBoxSpec) => {
      const subdiv = spec.subdiv ?? 7;
      const { house: h, car: c, wallet: w } = spec;

      const hx0 = h.x - h.w / 2, hx1 = h.x + h.w / 2, hy0 = h.y - h.h / 2, hy1 = h.y + h.h / 2, hz0 = h.z - h.d / 2, hz1 = h.z + h.d / 2;
      const cx0 = c.x - c.w / 2, cx1 = c.x + c.w / 2, cy0 = c.y - c.h / 2, cy1 = c.y + c.h / 2, cz0 = c.z - c.d / 2, cz1 = c.z + c.d / 2;
      const wx0 = w.x - w.w / 2, wx1 = w.x + w.w / 2, wy0 = w.y - w.h / 2, wy1 = w.y + w.h / 2, wz0 = w.z - w.d / 2, wz1 = w.z + w.d / 2;

      addQuadPair([[hx0, hy0, hz1], [hx1, hy0, hz1], [hx1, hy1, hz1], [hx0, hy1, hz1]], [[cx0, cy0, cz1], [cx1, cy0, cz1], [cx1, cy1, cz1], [cx0, cy1, cz1]], [[wx0, wy0, wz1], [wx1, wy0, wz1], [wx1, wy1, wz1], [wx0, wy1, wz1]], h.color, c.color, w.color, subdiv);
      addQuadPair([[hx1, hy0, hz0], [hx0, hy0, hz0], [hx0, hy1, hz0], [hx1, hy1, hz0]], [[cx1, cy0, cz0], [cx0, cy0, cz0], [cx0, cy1, cz0], [cx1, cy1, cz0]], [[wx1, wy0, wz0], [wx0, wy0, wz0], [wx0, wy1, wz0], [wx1, wy1, wz0]], h.color, c.color, w.color, subdiv);
      addQuadPair([[hx0, hy1, hz1], [hx1, hy1, hz1], [hx1, hy1, hz0], [hx0, hy1, hz0]], [[cx0, cy1, cz1], [cx1, cy1, cz1], [cx1, cy1, cz0], [cx0, cy1, cz0]], [[wx0, wy1, wz1], [wx1, wy1, wz1], [wx1, wy1, wz0], [wx0, wy1, wz0]], h.color, c.color, w.color, subdiv);
      addQuadPair([[hx0, hy0, hz0], [hx1, hy0, hz0], [hx1, hy0, hz1], [hx0, hy0, hz1]], [[cx0, cy0, cz0], [cx1, cy0, cz0], [cx1, cy0, cz1], [cx0, cy0, cz1]], [[wx0, wy0, wz0], [wx1, wy0, wz0], [wx1, wy0, wz1], [wx0, wy0, wz1]], h.color, c.color, w.color, subdiv);
      addQuadPair([[hx1, hy0, hz1], [hx1, hy0, hz0], [hx1, hy1, hz0], [hx1, hy1, hz1]], [[cx1, cy0, cz1], [cx1, cy0, cz0], [cx1, cy1, cz0], [cx1, cy1, cz1]], [[wx1, wy0, wz1], [wx1, wy0, wz0], [wx1, wy1, wz0], [wx1, wy1, wz1]], h.color, c.color, w.color, subdiv);
      addQuadPair([[hx0, hy0, hz0], [hx0, hy0, hz1], [hx0, hy1, hz1], [hx0, hy1, hz0]], [[cx0, cy0, cz0], [cx0, cy0, cz1], [cx0, cy1, cz1], [cx0, cy1, cz0]], [[wx0, wy0, wz0], [wx0, wy0, wz1], [wx0, wy1, wz1], [wx0, wy1, wz0]], h.color, c.color, w.color, subdiv);
    };

    const H_FOUNDATION: [number, number, number] = [0.3, 0.32, 0.38];
    const H_WALL: [number, number, number] = [0.94, 0.92, 0.86];
    const H_ROOF: [number, number, number] = [0.8, 0.25, 0.18];
    const H_CHIMNEY: [number, number, number] = [0.55, 0.2, 0.15];
    const H_DOOR_FRAME: [number, number, number] = [0.25, 0.25, 0.28];
    const H_DOOR: [number, number, number] = [0.42, 0.22, 0.12];
    const H_KNOB: [number, number, number] = [0.95, 0.78, 0.2];
    const H_FRAME: [number, number, number] = [0.95, 0.95, 0.95];
    const H_GLASS: [number, number, number] = [0.4, 0.8, 0.95];

    const C_BODY: [number, number, number] = [0.88, 0.32, 0.32];
    const C_GLASS: [number, number, number] = [0.62, 0.85, 0.98];
    const C_LIGHTS: [number, number, number] = [0.98, 0.82, 0.15];
    const C_BUMPER: [number, number, number] = [0.22, 0.22, 0.25];
    const C_PLATE: [number, number, number] = [0.88, 0.88, 0.88];
    const C_TIRE: [number, number, number] = [0.2, 0.2, 0.22];
    const C_RIM: [number, number, number] = [0.48, 0.48, 0.52];

    const W_PURPLE: [number, number, number] = [0.52, 0.42, 0.95];
    const W_PURPLE_DARK: [number, number, number] = [0.42, 0.32, 0.85];
    const W_GREEN: [number, number, number] = [0.12, 0.82, 0.58];
    const W_WHITE: [number, number, number] = [0.94, 0.95, 0.96];

    addBoxMulti({
      house: { x: 0, y: -0.75, z: 0, w: 1.45, h: 0.15, d: 1.25, color: H_FOUNDATION },
      car: { x: 0, y: -0.18, z: 0, w: 1.15, h: 0.28, d: 2.1, color: C_BODY },
      wallet: { x: -0.05, y: -0.18, z: 0.08, w: 1.48, h: 1.05, d: 0.22, color: W_PURPLE },
      subdiv: 6,
    });

    addBoxMulti({
      house: { x: 0, y: -0.25, z: 0, w: 1.4, h: 0.85, d: 1.2, color: H_WALL },
      car: { x: 0, y: -0.12, z: 0.55, w: 1.1, h: 0.2, d: 0.85, color: C_BODY },
      wallet: { x: -0.05, y: -0.12, z: -0.08, w: 1.48, h: 1.15, d: 0.16, color: W_PURPLE_DARK },
      subdiv: 6,
    });

    addBoxMulti({
      house: { x: 0, y: 0.45, z: 0, w: 1.5, h: 0.55, d: 1.3, color: H_ROOF },
      car: { x: 0, y: 0.18, z: -0.12, w: 0.92, h: 0.38, d: 0.98, color: C_GLASS },
      wallet: { x: 0.52, y: -0.08, z: 0.12, w: 0.38, h: 0.32, d: 0.18, color: W_PURPLE },
      subdiv: 6,
    });

    addBoxMulti({
      house: { x: 0.4, y: 0.6, z: -0.2, w: 0.22, h: 0.5, d: 0.22, color: H_CHIMNEY },
      car: { x: 0, y: -0.1, z: -0.78, w: 1.1, h: 0.22, d: 0.52, color: C_BODY },
      wallet: { x: 0.56, y: -0.08, z: 0.21, w: 0.14, h: 0.14, d: 0.05, color: W_WHITE },
      subdiv: 5,
    });

    addBoxMulti({
      house: { x: 0, y: -0.42, z: 0.605, w: 0.36, h: 0.52, d: 0.02, color: H_DOOR_FRAME },
      car: { x: 0, y: -0.28, z: 1.02, w: 1.18, h: 0.12, d: 0.1, color: C_BUMPER },
      wallet: { x: -0.38, y: 0.52, z: -0.02, w: 0.62, h: 0.58, d: 0.03, color: W_GREEN },
      subdiv: 5,
    });

    addBoxMulti({
      house: { x: 0, y: -0.43, z: 0.615, w: 0.3, h: 0.48, d: 0.02, color: H_DOOR },
      car: { x: 0, y: -0.28, z: 1.08, w: 0.38, h: 0.08, d: 0.02, color: C_PLATE },
      wallet: { x: -0.38, y: 0.52, z: 0.0, w: 0.46, h: 0.42, d: 0.02, color: W_WHITE },
      subdiv: 4,
    });

    addBoxMulti({
      house: { x: 0.1, y: -0.45, z: 0.63, w: 0.04, h: 0.05, d: 0.02, color: H_KNOB },
      car: { x: -0.42, y: -0.12, z: 0.98, w: 0.12, h: 0.12, d: 0.04, color: C_LIGHTS },
      wallet: { x: -0.38, y: 0.45, z: 0.015, w: 0.2, h: 0.2, d: 0.02, color: W_GREEN },
      subdiv: 4,
    });

    addBoxMulti({
      house: { x: -0.4, y: -0.1, z: 0.605, w: 0.34, h: 0.34, d: 0.02, color: H_FRAME },
      car: { x: -0.28, y: -0.15, z: 0.98, w: 0.09, h: 0.09, d: 0.04, color: C_LIGHTS },
      wallet: { x: 0.08, y: 0.58, z: -0.05, w: 0.58, h: 0.58, d: 0.03, color: W_GREEN },
      subdiv: 4,
    });

    addBoxMulti({
      house: { x: -0.4, y: -0.1, z: 0.615, w: 0.28, h: 0.28, d: 0.02, color: H_GLASS },
      car: { x: 0.28, y: -0.15, z: 0.98, w: 0.09, h: 0.09, d: 0.04, color: C_LIGHTS },
      wallet: { x: 0.08, y: 0.58, z: -0.03, w: 0.42, h: 0.42, d: 0.02, color: W_WHITE },
      subdiv: 4,
    });

    addBoxMulti({
      house: { x: 0.4, y: -0.1, z: 0.605, w: 0.34, h: 0.34, d: 0.02, color: H_FRAME },
      car: { x: 0.42, y: -0.12, z: 0.98, w: 0.12, h: 0.12, d: 0.04, color: C_LIGHTS },
      wallet: { x: 0.45, y: 0.48, z: 0.0, w: 0.58, h: 0.52, d: 0.03, color: W_GREEN },
      subdiv: 4,
    });

    addBoxMulti({
      house: { x: 0.4, y: -0.1, z: 0.615, w: 0.28, h: 0.28, d: 0.02, color: H_GLASS },
      car: { x: -0.52, y: 0.08, z: 0.3, w: 0.1, h: 0.06, d: 0.08, color: C_BODY },
      wallet: { x: 0.45, y: 0.48, z: 0.02, w: 0.42, h: 0.38, d: 0.02, color: W_WHITE },
      subdiv: 4,
    });

    addBoxMulti({
      house: { x: 0, y: 0.18, z: 0.62, w: 0.3, h: 0.05, d: 0.02, color: H_FRAME },
      car: { x: 0.52, y: 0.08, z: 0.3, w: 0.1, h: 0.06, d: 0.08, color: C_BODY },
      wallet: { x: -0.05, y: -0.62, z: 0.12, w: 1.38, h: 0.06, d: 0.08, color: W_PURPLE_DARK },
      subdiv: 4,
    });

    const wheelPositions = [
      { x: -0.58, z: 0.52 },
      { x: 0.58, z: 0.52 },
      { x: -0.58, z: -0.58 },
      { x: 0.58, z: -0.58 },
    ];

    wheelPositions.forEach((pos, idx) => {
      addBoxMulti({
        house: { x: -0.6 + idx * 0.4, y: -0.82, z: 0.55, w: 0.18, h: 0.08, d: 0.18, color: H_FOUNDATION },
        car: { x: pos.x, y: -0.28, z: pos.z, w: 0.16, h: 0.32, d: 0.32, color: C_TIRE },
        wallet: { x: -0.65 + idx * 0.42, y: -0.18, z: 0.02, w: 0.14, h: 0.88, d: 0.14, color: W_PURPLE_DARK },
        subdiv: 5,
      });
      addBoxMulti({
        house: { x: -0.6 + idx * 0.4, y: -0.82, z: 0.57, w: 0.12, h: 0.08, d: 0.12, color: H_FRAME },
        car: { x: pos.x > 0 ? pos.x + 0.02 : pos.x - 0.02, y: -0.28, z: pos.z, w: 0.14, h: 0.2, d: 0.2, color: C_RIM },
        wallet: { x: -0.65 + idx * 0.42, y: 0.25, z: -0.02, w: 0.1, h: 0.1, d: 0.02, color: W_GREEN },
        subdiv: 4,
      });
    });

    const housePositions = new Float32Array(hPos);
    const carPositions = new Float32Array(cPos);
    const walletPositions = new Float32Array(wPos);

    const houseColors = new Float32Array(hCols);
    const carColors = new Float32Array(cCols);
    const walletColors = new Float32Array(wCols);
    const sphereColors = new Float32Array(sCols);

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    for (let i = 0; i < wPos.length; i += 3) {
      minX = Math.min(minX, wPos[i]);   maxX = Math.max(maxX, wPos[i]);
      minY = Math.min(minY, wPos[i+1]); maxY = Math.max(maxY, wPos[i+1]);
      minZ = Math.min(minZ, wPos[i+2]); maxZ = Math.max(maxZ, wPos[i+2]);
    }

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;

    const spherePositions = new Float32Array(wPos.length);
    const ballRadius = 1.15;

    for (let i = 0; i < wPos.length; i += 3) {
      const dx = wPos[i] - centerX;
      const dy = wPos[i + 1] - centerY;
      const dz = wPos[i + 2] - centerZ;

      const length = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

      spherePositions[i] = (dx / length) * ballRadius;
      spherePositions[i + 1] = (dy / length) * ballRadius;
      spherePositions[i + 2] = (dz / length) * ballRadius;
    }

    return {
      spherePositions,
      housePositions,
      carPositions,
      walletPositions,
      sphereColors,
      houseColors,
      carColors,
      walletColors,
    };
  }

  // ---------------------------------------------------------------------
  // Fluid Animation Loop
  // ---------------------------------------------------------------------

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const t = (Date.now() - this.startTime) / 1000;
    const elapsedInSegment = t - this.segmentStart;

    let morphFactor = 0;
    const wasTransitioning = this.isTransitioning();

    if (elapsedInSegment < this.HOLD_DURATION) {
      morphFactor = 0;
    } else {
      const raw = (elapsedInSegment - this.HOLD_DURATION) / this.MORPH_DURATION;
      morphFactor = this.smootherstep(Math.min(1, raw));
    }

    const nowTransitioning = morphFactor > 0;
    if (nowTransitioning !== wasTransitioning) {
      this.ngZone.run(() => this.isTransitioning.set(nowTransitioning));
    }

    if (elapsedInSegment >= this.SEGMENT_DURATION) {
      this.segmentStart = t;
      this.currentIndex = this.nextIndex;
      this.nextIndex = (this.nextIndex + 1) % this.shapePositions.length;
      this.ngZone.run(() => {
        this.currentLabel.set(this.shapeNames[this.currentIndex]);
        this.isTransitioning.set(false);
      });
      morphFactor = 0;
    }

    const fromPos = this.shapePositions[this.currentIndex];
    const toPos = this.shapePositions[this.nextIndex];
    const fromCol = this.shapeColors[this.currentIndex];
    const toCol = this.shapeColors[this.nextIndex];

    const positionAttr = this.blob.geometry.attributes['position'] as THREE.BufferAttribute;
    const colorAttr = this.blob.geometry.attributes['color'] as THREE.BufferAttribute;
    const posArray = positionAttr.array as Float32Array;
    const colArray = colorAttr.array as Float32Array;

    const organicWave = Math.sin(morphFactor * Math.PI) * 0.008;

    for (let i = 0; i < positionAttr.count; i++) {
      const i3 = i * 3;
      const bx = fromPos[i3] + (toPos[i3] - fromPos[i3]) * morphFactor;
      const by = fromPos[i3 + 1] + (toPos[i3 + 1] - fromPos[i3 + 1]) * morphFactor;
      const bz = fromPos[i3 + 2] + (toPos[i3 + 2] - fromPos[i3 + 2]) * morphFactor;

      const ripple = Math.sin(bx * 2.5 + t * 2) * organicWave;

      posArray[i3] = bx + ripple;
      posArray[i3 + 1] = by + ripple;
      posArray[i3 + 2] = bz + ripple;

      colArray[i3] = fromCol[i3] + (toCol[i3] - fromCol[i3]) * morphFactor;
      colArray[i3 + 1] = fromCol[i3 + 1] + (toCol[i3 + 1] - fromCol[i3 + 1]) * morphFactor;
      colArray[i3 + 2] = fromCol[i3 + 2] + (toCol[i3 + 2] - fromCol[i3 + 2]) * morphFactor;
    }

    positionAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    this.blob.geometry.computeVertexNormals();

    this.blob.rotation.y += 0.0035;

    this.renderer.render(this.scene, this.camera);
  };

  private smootherstep(x: number): number {
    const t = Math.max(0, Math.min(1, x));
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.scheduleResize();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf);
    this.resizeObserver?.disconnect();

    if (this.blob) {
      this.blob.geometry.dispose();
      (this.blob.material as THREE.Material).dispose();
    }
    if (this.envTexture) this.envTexture.dispose();
    if (this.pmremGenerator) this.pmremGenerator.dispose();
    if (this.renderer) this.renderer.dispose();
  }
}