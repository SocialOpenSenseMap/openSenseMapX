import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'osem-box-connect-btn',
  templateUrl: './box-connect-btn.component.html',
  styleUrls: ['./box-connect-btn.component.scss']
})
export class BoxConnectBtnComponent implements OnInit {

  @Input() text: string;
  @Input() color: string;
  @Output() btnClick = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    this.btnClick.emit();
  }

}
