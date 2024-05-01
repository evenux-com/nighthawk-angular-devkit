import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
  OnInit,
  OnChanges,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NighthawkFormControlDirective } from '../../directives/form-control.directive';

@Component({
  standalone: true,
  selector: 'nighthawk-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  imports: [
    CommonModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    NighthawkFormControlDirective,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NighthawkSelectComponent),
      multi: true,
    },
  ],
})
export class NighthawkSelectComponent
  implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor
{
  @ViewChild('trigger', { static: true }) trigger!: ElementRef;

  @Input() selectedValue: string = '';
  @Input() hasSearch: boolean = false;
  @Input() placeholder: string = '';
  @Input() searchPlaceholder: string = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() options: any[] = [];
  @Input() nameField: string = '';
  @Input() valueField: string = '';
  @Input() color: 'primary' | 'secondary' | 'black' | 'white' | 'transparent' =
    'primary';
  @Input() size: 'large' | 'medium' | 'small' = 'medium';
  @Input() isDisabled!: boolean;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onOptionSelect = new EventEmitter<string>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public selectedOption: any = null;
  public showingOptions: boolean = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public filteredOptions: any[] = [];
  public parentWidth: number = 0;

  public onModelChange: (value: unknown) => void = () => {};

  private ignoreClose: boolean = false;
  private onTouched: () => void = () => {};

  private isBrowser: boolean = false;

  constructor(
    protected readonly viewportRuler: ViewportRuler,
    protected readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private readonly platformId: NonNullable<unknown>
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.viewportRuler
      .change()
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (this.showingOptions) {
          this.measureParentWidth();
        }
      });
  }

  public ngOnInit(): void {
    this.filteredOptions = this.options;
  }

  public ngAfterViewInit(): void {
    this.measureParentWidth();
  }

  public ngOnChanges(): void {
    this.filteredOptions = this.options;
    if (this.selectedOption) {
      const existing = this.filteredOptions.find((option) => {
        return option[this.valueField] === this.selectedOption[this.valueField];
      });

      this.selectedValue = existing ? existing[this.nameField] : '';
    }
  }

  public writeValue(value: unknown): void {
    if (value !== null && value !== undefined) {
      this.selectedOption =
        this.options.find((option) => option[this.valueField] === value) ||
        null;
      if (this.selectedOption)
        this.selectedValue = this.selectedOption[this.nameField];
    } else {
      this.selectedValue = '';
      this.selectedOption = null;
    }
  }

  public registerOnChange(fn: (value: unknown) => void): void {
    this.onModelChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public toggleDropdown(): void {
    if (!this.isDisabled) {
      if (!this.showingOptions) {
        this.showOptions();
      } else {
        this.hideOptions();
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onSearch(event: any): void {
    const searchString = event.target.value;
    this.filterOptions(searchString);
    if (!this.showingOptions) {
      this.showOptions();
    }
  }

  public showOptions(): void {
    this.showingOptions = true;
    this.measureParentWidth();
  }

  public onBlur(): void {
    this.ignoreClose = true;
    this.onTouched();
  }

  public hideOptions(force?: boolean): void {
    if (!this.ignoreClose || force) {
      this.showingOptions = false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public selectOption(option: any = null): void {
    if (option && option.disabled !== undefined && option.disabled) {
      return;
    }

    if (option) {
      this.selectedOption = option;
      this.selectedValue = '';

      setTimeout(() => {
        this.selectedValue = option[this.nameField];
        this.onModelChange(option[this.valueField]);
        this.onOptionSelect.emit(option[this.valueField]);
        this.filterOptions('');
      });
    } else {
      this.selectedOption = null;
      this.selectedValue = '';
      this.onModelChange(null);
      this.onOptionSelect.emit('');
    }

    this.ignoreClose = false;
    this.hideOptions();
    this.onTouched();
  }

  private filterOptions(value: string): void {
    this.filteredOptions = this.options.filter((option) =>
      option[this.nameField].toLowerCase().includes(value.toLowerCase())
    );
  }

  private measureParentWidth(): void {
    if (this.isBrowser && this.trigger) {
      const rect = this.trigger.nativeElement.getBoundingClientRect();
      this.parentWidth = rect.width;
      this.changeDetectorRef.markForCheck();
      this.changeDetectorRef.detectChanges(); // BUG HERE???
    }
  }
}
