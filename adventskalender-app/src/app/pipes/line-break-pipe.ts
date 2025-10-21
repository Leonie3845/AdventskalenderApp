import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'lineBreak'
})
export class LineBreakPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    // Replace \n with <br> tags
    return value.replace(/\n/g, '<br>');
  }

}
