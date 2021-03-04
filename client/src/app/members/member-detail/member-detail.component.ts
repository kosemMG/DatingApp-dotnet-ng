import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs/operators';
import { Member } from '../../_models/member';
import { Messages } from '../../_models/message';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { MessageService } from '../../_services/message.service';
import { PresenceService } from '../../_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  public activeTab: TabDirective;
  public member: Member;
  public messages: Messages = [];
  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[];

  private user: User;

  constructor(
    public presence: PresenceService,
    private messageService: MessageService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    accountService.currentUser$.pipe(take(1))
      .subscribe(user => this.user = user);
    router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  public ngOnInit(): void {
    this.route.data.subscribe(data => this.member = data.member);

    this.route.queryParams
      .subscribe(params => params.tab ? this.selectTab(params.tab) : this.selectTab(0));

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];

    this.galleryImages = this.getImages();
  }

  public ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  private getImages(): NgxGalleryImage[] {
    const imageUrls: NgxGalleryImage[] = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      });
    }

    return imageUrls;
  }

  public selectTab(tabId: number): void {
    this.memberTabs.tabs[tabId].active = true;
  }

  public onTabActivated(event: TabDirective): void {
    this.activeTab = event;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.messageService.createHubConnection(this.user, this.member.username);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  private loadMessages(): void {
    this.messageService.getMessageThread(this.member.username)
      .subscribe(messages => this.messages = messages);
  }
}
