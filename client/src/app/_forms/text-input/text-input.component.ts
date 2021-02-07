import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() type = 'text';

  constructor(@Self() public ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }

  public registerOnChange(fn: any): void {
  }

  public registerOnTouched(fn: any): void {
  }

  public writeValue(obj: any): void {
  }
}
