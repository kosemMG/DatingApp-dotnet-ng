import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../_models/user';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  @Input() updateSelectedRoles = new EventEmitter();
  @Input() user: User;
  @Input() roles: any[];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  public updateRoles(): void {
    this.updateSelectedRoles.emit(this.roles);
    this.activeModal.close();
  }
}
