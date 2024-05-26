import { Pipe } from '@angular/core';

@Pipe({
  name: 'firstKey',
  standalone: true,
})
export class FirstKeyPipe {
  transform(obj: any) {
    const keys = Object.keys(obj);
    if (keys && keys.length > 0) {
      return keys[0];
    }

    return null;
  }
}
