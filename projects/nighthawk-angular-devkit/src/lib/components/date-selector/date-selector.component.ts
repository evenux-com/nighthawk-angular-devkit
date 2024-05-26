import { Component, Input } from '@angular/core';
import { NighthawkFormControlDirective } from '../../directives/form-control.directive';
import { NighthawkDropdownComponent } from '../dropdown/dropdown.component';
import { NighthawkControlledDropdownTriggerDirective } from '../../directives/controlled-dropdown-trigger-for.directive';
import { NighthawkCalendarComponent } from '../calendar/calendar.component';
import { NighthawkSelectComponent } from '../select/select.component';
import { FormsModule } from '@angular/forms';
import { NighthawkButtonDirective } from '../../directives/button.directive';
  
@Component({
  standalone: true,
  selector: 'nighthawk-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
  imports: [FormsModule, NighthawkFormControlDirective, NighthawkButtonDirective, NighthawkControlledDropdownTriggerDirective, NighthawkSelectComponent, NighthawkCalendarComponent, NighthawkDropdownComponent]
})
export class NighthawkDateSelector{
  @Input() color: 'primary' | 'secondary' | 'white' | 'black' | 'transparent' = 'transparent';
  @Input() size: 'large' | 'medium' | 'small' = 'medium';
  @Input() centered: boolean = false;
  @Input() border: boolean = false;
  @Input() rounded: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() showMonths: boolean = false;
  @Input() showYears: boolean = false;
  @Input() selectedMonth: number = 1;
  @Input() selectedYear: number = 2024;
  @Input() monthOptions: any[] = [];
  @Input() yearOptions: any[] = [];
  @Input() closeOnSelectDate: boolean = true;

  constructor() {
    this.monthOptions = [
      {name: 'Jaanuar', value: 1},
      {name: 'Veebruar', value: 2},
      {name: 'Märts', value: 3},
      {name: 'Aprill', value: 4},
      {name: 'Mai', value: 5},
      {name: 'Juuni', value: 6},
      {name: 'Juuli', value: 7},
      {name: 'August', value: 8},
      {name: 'September', value: 9},
      {name: 'Oktoober', value: 10},
      {name: 'November', value: 11},
      {name: 'Detsember', value: 12},
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
  }

  public close(): void {
    this.showCalendarDropdown = false;
  }
}
