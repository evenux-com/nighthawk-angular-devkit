import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NighthawkFormControlDirective } from '../../directives/form-control.directive';
import { NighthawkDropdownComponent } from '../dropdown/dropdown.component';
import { NighthawkControlledDropdownTriggerDirective } from '../../directives/controlled-dropdown-trigger-for.directive';
import { NighthawkCalendarComponent } from '../calendar/calendar.component';
import { NighthawkSelectComponent } from '../select/select.component';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NighthawkButtonDirective } from '../../directives/button.directive';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'nighthawk-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
  imports: [FormsModule, CommonModule, NighthawkFormControlDirective, NighthawkButtonDirective, NighthawkControlledDropdownTriggerDirective, NighthawkSelectComponent, NighthawkCalendarComponent, NighthawkDropdownComponent],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NighthawkDateSelector),
    multi: true
  }]
})
export class NighthawkDateSelector implements ControlValueAccessor {
  @Input() color: 'primary' | 'secondary' | 'white' | 'black' | 'transparent' = 'transparent';
  @Input() size: 'large' | 'medium' | 'small' = 'medium';
  @Input() centered: boolean = false;
  @Input() border: boolean = false;
  @Input() rounded: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() showMonths: boolean = false;
  @Input() showYears: boolean = false;
  @Input() selectedDate!: Date;
  @Input() selectedMonth: number = 1;
  @Input() selectedYear: number = 2024;
  @Input() monthOptions: any[] = [];
  @Input() yearOptions: any[] = [];
  @Input() closeOnSelectDate: boolean = true;
  @Input() buttonClasses: string = '';
  @Input() buttonSelectDateText: string = 'Select a date';
  @Input() buttonCloseText: string = 'Close';
  @Input() buttonSelectMonthText: string = 'Select month';
  @Input() buttonSelectYearText: string = 'Select year';
  @Input() dateFormatExpression: string = 'dd.MM.yyyy';

  @Output() dateSelected: EventEmitter<Date> = new EventEmitter<Date>();

  constructor() {
    this.monthOptions = [
      {name: 'January', value: 1},
      {name: 'February', value: 2},
      {name: 'March', value: 3},
      {name: 'April', value: 4},
      {name: 'May', value: 5},
      {name: 'June', value: 6},
      {name: 'July', value: 7},
      {name: 'August', value: 8},
      {name: 'September', value: 9},
      {name: 'October', value: 10},
      {name: 'November', value: 11},
      {name: 'December', value: 12},
    ];

    this.yearOptions = [
      {name: '2020', value: 2020},
      {name: '2021', value: 2021},
      {name: '2022', value: 2022},
      {name: '2023', value: 2023},
      {name: '2024', value: 2024},
    ];
  }

  public showCalendarDropdown: boolean = false;

  public onSelectDay(date: any): any {
    if (this.closeOnSelectDate) {
      this.showCalendarDropdown = false;
    }

    this.selectedDate = new Date(date.year, date.month - 1, date.day);
    this.onChange(this.selectedDate);
    this.dateSelected.emit(this.selectedDate);
  }

  public close(): void {
    this.showCalendarDropdown = false;
  }

  private onChange = (date: Date) => {};
  private onTouched = () => {};

  writeValue(date: Date): void {
    this.selectedDate = date;
  }

  registerOnChange(fn: (date: Date) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}