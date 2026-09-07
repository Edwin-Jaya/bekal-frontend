import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-process-steps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './process-steps.html'
})
export class ProcessStepsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sectionRef', { static: true }) sectionRef!: ElementRef<HTMLElement>;

  isVisible = signal(false);
  private observer?: IntersectionObserver;

  steps = [
    {
      number: '01',
      badge: 'eKTP',
      title: '01. Isi Formulir',
      description:
        'Lengkapi data diri dan scan e-KTP secara digital melalui smartphone atau laptop. Anda hanya butuh 3 menit.',
      icon: 'card'
    },
    {
      number: '02',
      badge: 'AI',
      title: '02. Verifikasi',
      description:
        'Verifikasi instan dan validasi data cerdas otomatis oleh sistem AI tanpa survei lapangan yang mengganggu.',
      icon: 'check'
    },
    {
      number: '03',
      badge: 'IDR',
      title: '03. Pencairan Dana',
      description:
        'Setelah konfirmasi digital ditandatangani, dana langsung ditransfer ke rekening bank Anda dalam 10 menit.',
      icon: 'phone'
    }
  ];

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible.set(true);
          this.observer?.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    this.observer.observe(this.sectionRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}