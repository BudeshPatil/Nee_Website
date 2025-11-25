import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  OnInit
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})

export class LoadingComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() thumbnailClicked = new EventEmitter<void>();

  onThumbnailClick() {
    this.thumbnailClicked.emit();
  }
  @Output() videoEnded = new EventEmitter<void>();
  @ViewChild('desktopVideo') desktopVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('mobileVideo') mobileVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('thumbnail') thumbnail?: ElementRef<HTMLDivElement>;

  showLoader = true;
  isHiding = false;
  isLoading = true;   // Black screen visible
  showThumbnail = false; // Thumbnail shows after fade
  private hideTimeout: any;
  private videoReady = false;
  private websiteReady = false;

  imageURL: string = `${environment.url}/assets`;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      this.showLoader = false;
      return;
    }

    // Skip loader if already played
    const hasPlayed = sessionStorage.getItem('introPlayed');
    if (hasPlayed) {
      this.showLoader = false;
      this.isLoading = false;
      this.videoEnded.emit();
      return;
    }

    // Show thumbnail first
    this.isLoading = false;
    this.showThumbnail = true;
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId) || !this.showLoader) return;

    // Set up video elements
    const desktop = this.desktopVideo?.nativeElement;
    const mobile = this.mobileVideo?.nativeElement;

    [desktop, mobile].forEach(video => {
      if (video) {
        video.controls = false;
        video.muted = true;
        video.playsInline = true;
        video.setAttribute('webkit-playsinline', 'true');
        video.addEventListener('ended', () => this.onVideoEnded());
      }
    });

    // Set up thumbnail click handler
    if (this.thumbnail) {
      this.thumbnail.nativeElement.addEventListener('click', () => {
        const isMobile = window.innerWidth < 992; // Match Bootstrap's lg breakpoint
        this.playVideo(isMobile ? 'mobile' : 'desktop');
      });
    }

    // Fallback in case video doesn't load
    this.hideTimeout = setTimeout(() => {
      if (this.isLoading) {
        console.warn('Fallback: forcing black screen off');
        // this.hideBlackScreen();
      }
    }, 5000);
  }

  // private hideBlackScreen() {
  //   if (!this.isLoading) return;
  //   this.isLoading = false;

  //   // Instead of showing video, show thumbnail
  //   this.showThumbnail = true;

  //   const overlay = document.querySelector('.black-screen') as HTMLElement;
  //   if (overlay) overlay.classList.add('hidden');
  // }

  onVideoCanPlay() {
    this.videoReady = true;
    // this.checkReady();
  }

  // private checkReady() {
  //   if (this.videoReady && this.websiteReady) {
  //     setTimeout(() => this.hideBlackScreen(), 300);
  //   }
  // }

  playVideo(device: 'desktop' | 'mobile'): void {
    if (!this.desktopVideo?.nativeElement || !this.mobileVideo?.nativeElement) {
      console.error('Video element not found');
      this.onVideoEnded();
      return;
    }

    this.showThumbnail = false;
    const video = device === 'desktop' ? this.desktopVideo.nativeElement : this.mobileVideo.nativeElement;
    
    video.play().catch((error: Error) => {
      console.error('Error playing video:', error);
      // If video fails to play, continue to website
      this.onVideoEnded();
    });
  }

  onVideoEnded(): void {
    if (this.desktopVideo?.nativeElement) {
      this.desktopVideo.nativeElement.classList.add('fade-out');
    }
    if (this.mobileVideo?.nativeElement) {
      this.mobileVideo.nativeElement.classList.add('fade-out');
    }
  
    this.hideTimeout = setTimeout(() => {
      this.isHiding = true;
      this.videoEnded.emit(); 
      sessionStorage.setItem('introPlayed', 'true');
    }, 800);
  }
  

  ngOnDestroy() {
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
  }
}

