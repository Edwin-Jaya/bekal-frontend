import { Component, computed, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'inverted' | 'outlined';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  host: {
    // makes the host element a block so w-full on the inner button actually spans the row
    '[class.block]': 'fullWidth()',
    '[class.w-full]': 'fullWidth()',
  },
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="classes()"
      [style]="hostStyle()"
      (click)="onClick.emit($event)"
    >
      @if (iconLeft()) {
        <span class="inline-flex shrink-0" [innerHTML]="iconLeft()"></span>
      }
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  iconLeft = input<string | null>(null);

  /** Set true to make the button span the full width of its container */
  fullWidth = input<boolean>(false);

  /** Escape hatch: pass any extra Tailwind classes from the template */
  extraClass = input<string>('');

  /** Optional one-off color override (guaranteed to win, bypasses Tailwind specificity issues) */
  bgColor = input<string | null>(null);
  hoverColor = input<string | null>(null);

  onClick = output<MouseEvent>();

  classes = computed(() => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-btn font-semibold font-sans transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-primary-900 text-white hover:bg-primary-800',
      secondary: 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
      inverted: 'bg-tertiary-900 text-white hover:bg-tertiary-800',
      outlined:
        'bg-transparent border border-neutral-300 text-neutral-700 hover:bg-neutral-50',
    };

    const width = this.fullWidth() ? 'w-full' : '';

    // If a custom color override is passed, use CSS-variable-driven classes
    // instead of the variant's baked-in colors — this always wins since it's
    // resolved via inline style, not competing Tailwind utility order.
    const colorOverride =
      this.bgColor() || this.hoverColor()
        ? 'bg-[--btn-bg] hover:bg-[--btn-bg-hover]'
        : variants[this.variant()];

    return `${base} ${sizes[this.size()]} ${colorOverride} ${width} ${this.extraClass()}`;
  });

  /** Inline style binding that feeds the CSS variables used above */
  hostStyle = computed(() => {
    if (!this.bgColor() && !this.hoverColor()) return '';
    return `--btn-bg: ${this.bgColor() ?? ''}; --btn-bg-hover: ${this.hoverColor() ?? this.bgColor() ?? ''};`;
  });
}