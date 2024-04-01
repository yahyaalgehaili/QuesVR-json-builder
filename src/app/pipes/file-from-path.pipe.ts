import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileFromPath',
  standalone: true
})
export class FileFromPathPipe implements PipeTransform {

  transform(value: string): string {
    const stringList:  string[] = value.split('/');
    return stringList[stringList.length - 1];
  }

}
