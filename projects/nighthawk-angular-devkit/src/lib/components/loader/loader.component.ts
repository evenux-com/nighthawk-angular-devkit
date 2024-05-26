import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'nighthawk-loader',
  templateUrl: 'loader.component.html',
  styleUrl: 'loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NighthawkLoaderComponent {
  @Input() ready: boolean = false;
  @Input() size: number = 16;
  @Input() isHidden: boolean = false;
  @Input() isPageLoader: boolean = false;
}
