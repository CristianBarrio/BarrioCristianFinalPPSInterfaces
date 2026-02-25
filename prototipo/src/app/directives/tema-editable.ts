import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appTemaEditable]'
  , standalone: true
})
export class TemaEditable {

  @Input() temaEditable = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (!this.temaEditable) return;

    this.el.nativeElement.style.position = 'relative';

    const btn = document.createElement('button');
    btn.innerText = '🎨';
    btn.style.position = 'absolute';
    btn.style.left = '-28px';
    btn.style.top = '50%';
    btn.style.transform = 'translateY(-50%)';

    this.el.nativeElement.appendChild(btn);
  }
}
