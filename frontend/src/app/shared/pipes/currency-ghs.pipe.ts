import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyGhs',
  standalone: true
})
export class CurrencyGhsPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return 'GH₵ 0.00';
    }
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) {
      return 'GH₵ 0.00';
    }
    return `GH₵ ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
