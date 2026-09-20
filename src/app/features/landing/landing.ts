import {
  Component,
  OnDestroy,
  AfterViewInit,
  HostListener,
  ElementRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

export interface LoanTier {
  label: string;
  tier: string;
  amount: string;
  subtitle: string;
  features: string[];
  progress: number;
  progressLabel: string;
  featured: boolean;
}

export interface Testimonial {
  initial: string;
  name: string;
  role: string;
  stars: number;
  text: string;
  avatarGradient: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

export interface MarqueeItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css'],
})
export class Landing implements AfterViewInit, OnDestroy {
  // ─── External links ────────────────────────────────────────────────────
  readonly playStoreLink =
    'https://play.google.com/store/apps/details?id=com.bekal.app';
  readonly employeeLoginLink = '/login';

  // ─── Nav state ─────────────────────────────────────────────────────────
  isScrolled = false;
  isMobileMenuOpen = false;

  // ─── 3D card tilt RAF handle ───────────────────────────────────────────
  private raf = 0;

  // ─── Scroll-reveal observer ────────────────────────────────────────────
  private revealObserver!: IntersectionObserver;

  // ─── Data ──────────────────────────────────────────────────────────────
  readonly marqueeItems: MarqueeItem[] = [
    { value: '+12.000', label: 'pengguna aktif' },
    { value: '24 bulan', label: 'tenor maksimal' },
    { value: 'Rp 50 Juta', label: 'plafond tertinggi' },
    { value: '1×24 jam', label: 'proses cair' },
    { value: 'OJK', label: 'terdaftar & diawasi' },
    { value: 'tanpa', label: 'jaminan aset' },
  ];

  readonly loanTiers: LoanTier[] = [
    {
      label: 'Tier 1 · Mulai',
      tier: 'Tier 1',
      amount: 'Rp 20 Jt',
      subtitle: 'Untuk yang baru memulai',
      features: [
        // 'Hanya KTP & slip gaji',
        // 'Tenor fleksibel s.d. 24 bulan',
        // 'Verifikasi 1×24 jam',
      ],
      progress: 33,
      progressLabel: 'Tier 1 / 3',
      featured: false,
    },
    {
      label: 'Tier 2 · Berkembang',
      tier: 'Tier 2',
      amount: 'Rp 35 Jt',
      subtitle: 'Naik otomatis setelah 3 cicilan on-time',
      features: [
        // 'Semua benefit Tier 1',
        // 'Bunga lebih ringan',
        // 'Prioritas pencairan dana',
      ],
      progress: 66,
      progressLabel: 'Tier 2 / 3',
      featured: true,
    },
    {
      label: 'Tier 3 · Puncak',
      tier: 'Tier 3',
      amount: 'Rp 50 Jt',
      subtitle: 'Untuk yang sudah terbukti loyal',
      features: [
        // 'Semua benefit Tier 1 & 2',
        // 'Bunga terendah tersedia',
        // 'CS dedikasi personal',
      ],
      progress: 100,
      progressLabel: 'Tier 3 / 3',
      featured: false,
    },
  ];

  readonly testimonials: Testimonial[] = [
    {
      initial: 'R',
      name: 'Rizky A.',
      role: 'Staf Administrasi, Jakarta',
      stars: 5,
      text: 'Prosesnya beneran cepat. Saya apply Senin pagi, dana cair Selasa siang. Tim CS-nya ramah banget, nggak kayak pinjaman online lain yang ribet.',
      avatarGradient: 'linear-gradient(135deg,#7e22ce,#9333ea)',
    },
    {
      initial: 'S',
      name: 'Sari W.',
      role: 'Marketing Officer, Surabaya',
      stars: 5,
      text: 'Yang bikin saya loyal ke Bekal itu sistemnya — bayar tepat waktu, limit naik sendiri. Sekarang saya sudah di Tier 2 dan berencana ke Tier 3.',
      avatarGradient: 'linear-gradient(135deg,#1e40af,#3b82f6)',
    },
    {
      initial: 'D',
      name: 'Dimas P.',
      role: 'Teknisi, Bandung',
      stars: 4,
      text: 'Syaratnya simpel — KTP sama slip gaji. Saya pikir bakalan ada tambahan dokumen, ternyata nggak ada. Langsung diproses dan approved.',
      avatarGradient: 'linear-gradient(135deg,#065f46,#10b981)',
    },
    {
      initial: 'N',
      name: 'Nina K.',
      role: 'Akuntan, Medan',
      stars: 5,
      text: 'Bunganya transparan, tidak ada biaya tersembunyi. Sebagai akuntan saya sangat menghargai itu. Simulasi angsurannya langsung kelihatan di aplikasi.',
      avatarGradient: 'linear-gradient(135deg,#92400e,#f59e0b)',
    },
  ];

  faqs: FaqItem[] = [
    {
      question: 'Siapa yang bisa mengajukan pinjaman Bekal?',
      answer:
        'Karyawan tetap atau kontrak yang bekerja minimal 6 bulan di perusahaan mitra Bekal. Cukup tunjukkan KTP aktif dan slip gaji 3 bulan terakhir.',
      open: false,
    },
    {
      question: 'Berapa lama proses persetujuan?',
      answer:
        'Rata-rata 1×24 jam hari kerja setelah dokumen lengkap dan verifikasi selesai. Dalam kondisi tertentu bisa lebih cepat.',
      open: false,
    },
    {
      question: 'Bagaimana cara limit saya bisa naik tier?',
      answer:
        'Bayar cicilan tepat waktu secara konsisten. Sistem kami otomatis mengevaluasi kelayakan kenaikan tier setiap 3 cicilan berturut-turut tanpa telat.',
      open: false,
    },
    {
      question: 'Apakah ada denda pelunasan lebih awal?',
      answer:
        'Tidak ada. Kami justru mendorong pelunasan lebih awal. Tidak ada penalti, tidak ada biaya tersembunyi untuk ini.',
      open: false,
    },
    {
      question: 'Apakah data saya aman?',
      answer:
        'Ya. Semua data dienkripsi end-to-end dan disimpan di server bersertifikat ISO 27001. Bekal tidak pernah menjual atau berbagi data kamu ke pihak ketiga.',
      open: false,
    },
  ];

  // ─── Star helpers ──────────────────────────────────────────────────────
  /** Returns [1,2,3,4,5] — used for *ngFor in the template */
  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  isFilledStar(index: number, count: number): boolean {
    return index <= count;
  }

  // ─── Constructor ───────────────────────────────────────────────────────
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly elRef: ElementRef<HTMLElement>,
  ) {}

  // ─── Lifecycle ─────────────────────────────────────────────────────────
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initScrollReveal();
    this.initCardTilt();
    this.initReducedMotion();
  }

  ngOnDestroy(): void {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }
    this.revealObserver?.disconnect();
  }

  // ─── Navbar scroll ─────────────────────────────────────────────────────
  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 40;
  }

  // ─── Mobile menu ───────────────────────────────────────────────────────
  openMobileMenu(): void {
    this.isMobileMenuOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  // ─── FAQ accordion ─────────────────────────────────────────────────────
  toggleFaq(index: number): void {
    const wasOpen = this.faqs[index].open;
    this.faqs.forEach((f) => (f.open = false));
    if (!wasOpen) {
      this.faqs[index].open = true;
    }
  }

  // ─── Scroll reveal ─────────────────────────────────────────────────────
  private initScrollReveal(): void {
    const els =
      this.elRef.nativeElement.querySelectorAll<HTMLElement>('.reveal');

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('visible');
            this.revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    els.forEach((el) => this.revealObserver.observe(el));
  }

  // ─── 3D card tilt ──────────────────────────────────────────────────────
  private initCardTilt(): void {
    const cardStack =
      this.elRef.nativeElement.querySelector<HTMLElement>('#card-stack');
    const heroVisual =
      this.elRef.nativeElement.querySelector<HTMLElement>('.hero-visual');

    if (!heroVisual || !cardStack) return;

    heroVisual.addEventListener('mousemove', (e: MouseEvent) => {
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(() => {
        const rect = heroVisual.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const rx = ((e.clientY - cy) / rect.height) * 14;
        const ry = -((e.clientX - cx) / rect.width) * 18;
        cardStack.style.transform = `rotateX(${8 + rx}deg) rotateY(${-16 + ry}deg) rotateZ(2deg)`;
        cardStack.style.transition = 'transform 0.1s ease-out';
      });
    });

    heroVisual.addEventListener('mouseleave', () => {
      cancelAnimationFrame(this.raf);
      cardStack.style.transition = 'transform 0.8s cubic-bezier(0.25,1,0.5,1)';
      cardStack.style.transform = '';
    });
  }

  // ─── Reduced motion ────────────────────────────────────────────────────
  private initReducedMotion(): void {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.elRef.nativeElement
      .querySelectorAll<HTMLElement>('*')
      .forEach((el) => {
        el.style.animationDuration = '0.001ms';
        el.style.transitionDuration = '0.001ms';
      });
  }
}
