/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  Output,
  TemplateRef,
  ViewChild,
  EventEmitter,
  Input,
} from '@angular/core';
import { DropdownPanel } from '../../interfaces/dropdown-panel.interface';

@Component({
  standalone: true,
  selector: 'nighthawk-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class NighthawkDropdownComponent implements DropdownPanel {
  @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;
  @Output() closed = new EventEmitter<void>();
  @Input() closeOnClickInside: boolean = false;
  @Input() offset: number = 0;

  public handleClick(): void {
    if (this.closeOnClickInside) {
      this.closed.emit();
    }
  }
}
