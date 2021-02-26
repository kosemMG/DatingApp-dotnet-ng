import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../_models/user';
import { AdminService } from '../../_services/admin.service';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  public users: Partial<User[]>;

  constructor(private adminService: AdminService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  public openRolesModal(user: User): void {
    const modalRef = this.modalService.open(RolesModalComponent);
    modalRef.componentInstance.user = user;
    modalRef.componentInstance.roles = this.getRoles(user);
    modalRef.componentInstance.updateSelectedRoles.subscribe(roles => {
      const rolesToUpdate = {
        roles: [...roles.filter(role => role.checked).map(role => role.name)]
      };
      if (rolesToUpdate) {
        this.adminService.updateRoles(user.username, rolesToUpdate.roles)
          .subscribe(() => user.roles = [...rolesToUpdate.roles]);
      }
    })
  }

  private getRoles(user: User): any[] {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Moderator', value: 'Moderator' },
      { name: 'Member', value: 'Member' }
    ];

    availableRoles.forEach(role => {
      let isMatch = false;
      for (const userRole of user.roles) {
        if (role.name === userRole) {
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }
      if (!isMatch) {
        role.checked = false;
        roles.push(role);
      }
    });
    return roles;
  }

  private getUsersWithRoles(): void {
    this.adminService.getUsersWithRoles().subscribe(users => this.users = users);
  }
}
