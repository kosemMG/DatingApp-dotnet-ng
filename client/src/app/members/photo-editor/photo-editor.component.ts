import { Component, Input, OnInit } from '@angular/core';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Member } from '../../_models/member';
import { Photo } from '../../_models/photo';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member;
  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;

  private baseUrl = environment.apiUrl;
  private user: User;

  constructor(private accountService: AccountService, private memberService: MembersService) {
    this.accountService.currentUser$.pipe(take(1))
      .subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.initialiseUploader();
  }

  public fileOverBase(event: boolean): void {
    this.hasBaseDropZoneOver = event;
  }

  private initialiseUploader(): void {
    console.log(this.user);
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = file => file.withCredentials = false;
    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      if (response) {
        const photo = JSON.parse(response) as Photo;
        this.member.photos.push(photo);
        if (photo.isMain) {
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    };
  }

  public setMainPhoto(photo: Photo): void {
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p => {
        if (p.isMain) {
          p.isMain = false;
        }
        if (p.id === photo.id) {
          p.isMain = true;
        }
      });
    });
  }

  public deletePhoto(photoId: number): void {
    this.memberService.deletePhoto(photoId)
      .subscribe(() => this.member.photos = this.member.photos.filter(photo => photo.id !== photoId));
  }
}
