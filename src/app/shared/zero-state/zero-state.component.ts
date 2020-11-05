import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'zero-state',
  templateUrl: './zero-state.component.html',
  styleUrls: ['./zero-state.component.scss']
})
export class ZeroStateComponent implements OnInit {

  @Input() image = '../../../assets/images/pngs/expenses.png';
  @Input() message = 'Looks like you dont have anything here';
  @Input() link: string = null;
  @Output() linkClick = new EventEmitter();

  onLinkClick() {
    this.linkClick.emit(this.link);
  }

  constructor() { }

  ngOnInit() {
  }
}
