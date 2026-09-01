import { Component, computed, input, output } from '@angular/core';

export type IconButtonVariant = 'dark' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'ghost-dark';
export type IconButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  host: {
    '[class.block]': 'fullWidth()',
    '[class.w-full]': 'fullWidth()',
  },
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      [class]="classes()"
      (click)="onClick.emit($event)"
    >
      <ng-content />
    </button>
  `,
})
export class IconButton {
  variant = input<IconButtonVariant>('dark');
  size = input<IconButtonSize>('md');
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  ariaLabel = input<string>('');

  /** Set true to make the button span the full width of its container
   *  (useful when it holds an icon + label, e.g. a full-width "Add item" action) */
  fullWidth = input<boolean>(false);

  /** Escape hatch: pass any extra Tailwind classes from the template */
  extraClass = input<string>('');

  onClick = output<MouseEvent>();

  classes = computed(() => {
    const base =
      'inline-flex items-center justify-center rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

    const sizes: Record<IconButtonSize, string> = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-11 h-11 text-base',
      lg: 'w-14 h-14 text-lg',
    };

    const variants: Record<IconButtonVariant, string> = {
      dark: 'bg-primary-900 text-white hover:bg-primary-800',
      secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
      outline: 'bg-tertiary-900 text-white hover:bg-tertiary-800',
      danger: 'bg-error-500 text-white hover:bg-red-700',
      ghost: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
      'ghost-dark': 'bg-transparent text-neutral-300 hover:bg-white/10 hover:text-white',
    };

    const width = this.fullWidth() ? 'w-full' : '';

    return `${base} ${sizes[this.size()]} ${variants[this.variant()]} ${width} ${this.extraClass()}`;
  });
}