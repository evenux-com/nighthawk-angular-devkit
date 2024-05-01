/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ComponentRef,
  Injectable,
  ViewContainerRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { BehaviorSubject, fromEvent, take } from 'rxjs';
import { NighthawkLoaderComponent } from '../../public-api';
import { isPlatformBrowser } from '@angular/common';
import { NavigationStart, Router } from '@angular/router';
import { ApplicationConfig } from '../interfaces/application-config.interface';

@Injectable({
  providedIn: 'root',
})
export class NighthawkBootstrapService {
  public isLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private loaderRef!: ComponentRef<NighthawkLoaderComponent>;
  private isFontsLoaded = false;
  private isImagesLoaded = false;
  private fonts = ['a-12', 'swiper-icons'];

  public minimumPageLoadingTime = 500;
  public minimumRouteSwitchLoadingTime = 1000;

  private isBrowser: boolean = false;

  constructor(
    private readonly vcr: ViewContainerRef,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const element = document.querySelector(':root') || false;
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        this.minimumRouteSwitchLoadingTime = +computedStyle.getPropertyValue(
          '--minimum-route-switch-loading-time'
        );
        this.minimumPageLoadingTime = +computedStyle.getPropertyValue(
          '--minimum-page-loading-time'
        );
      }

      router.events.subscribe(async (event) => {
        if (
          this.isBrowser &&
          event instanceof NavigationStart &&
          event.navigationTrigger !== 'popstate' &&
          this.isLoaded.value &&
          this.minimumRouteSwitchLoadingTime >= 1000
        ) {
          this.isImagesLoaded = false;
          this.isFontsLoaded = false;

          this.placeFontsHook();
          this.placeImageLoaderHook();

          const startTime = Date.now();
          await this.loadRouteChangeBackground(startTime);
          this.initializeRouteLoader();
        }
      });
    }
  }

  public async loadApplication(config: ApplicationConfig): Promise<void> {
    this.fonts.push(...config.fonts);

    if (this.isBrowser && this.minimumPageLoadingTime >= 500) {
      setTimeout(async () => {
        this.placeImageLoaderHook();
        this.placeFontsHook();
        this.initializePageLoader();
        const startTime = Date.now();
        await this.loadBackground(startTime);
      });
    } else if (this.isBrowser) {
      const mainElement = document.querySelector('main');
      if (mainElement) mainElement.classList.add('is-loaded');
    }
  }

  private initializePageLoader(): void {
    const mainElement = document.querySelector('main');
    if (mainElement) mainElement.classList.add('disable-interact');

    this.loaderRef = this.vcr.createComponent(NighthawkLoaderComponent);
    this.loaderRef.setInput('isPageLoader', true);
    this.loaderRef.setInput('size', 42);
    this.loaderRef.setInput('ready', true);
  }

  private initializeRouteLoader(): void {
    const mainElement = document.querySelector('main');
    if (mainElement) mainElement.classList.add('disable-interact');

    this.loaderRef = this.vcr.createComponent(NighthawkLoaderComponent);
    this.loaderRef.setInput('isPageLoader', true);
    this.loaderRef.setInput('size', 42);
    this.loaderRef.setInput('isHidden', true);

    setTimeout(() => {
      this.loaderRef.setInput('ready', true);

      setTimeout(() => {
        this.loaderRef.setInput('isHidden', false);
      }, 100);
    }, 650);
  }

  private async loadBackground(
    startTime: number,
    isRetry?: boolean
  ): Promise<void> {
    if (this.isBrowser) {
      const finalize = () => {
        const mainElement = document.querySelector('main');
        mainElement?.classList.add('is-loaded');
        this.loaderRef.setInput('isHidden', true);

        setTimeout(() => {
          this.loaderRef.destroy();
          this.isLoaded.next(true);
          mainElement?.classList.remove('disable-interact');
        }, 650);
      };

      const element = document.querySelector(':root');

      if (element) {
        if (isRetry) {
          const timeItTookToLoad = Date.now() - startTime;
          const isPastMinimumTime =
            timeItTookToLoad >= this.minimumPageLoadingTime;

          if (isPastMinimumTime && this.isImagesLoaded && this.isFontsLoaded) {
            finalize();
            return;
          } else {
            setTimeout(async () => {
              await this.loadBackground(startTime, true);
            }, 100);

            return;
          }
        }

        const backgroundVarValue =
          getComputedStyle(element).getPropertyValue('--background-image');
        const urlRegex = /\((.*?)\)/g;
        const images = Array.from(
          backgroundVarValue.matchAll(urlRegex),
          (m) => m[1]
        );

        const responses = await Promise.all(
          images.map((image) =>
            fetch(new URL(image, window.location.href).toString())
          )
        );
        const validUrls = images.filter((_, i) => responses[i].status !== 404);

        const observables = validUrls.map(() =>
          fromEvent(new Image(), 'load').pipe(take(1))
        );

        await Promise.all(observables).then(() => {
          const endTime = Date.now();
          const timeItTookToLoad = endTime - startTime;
          const isPastMinimumTime =
            timeItTookToLoad >= this.minimumPageLoadingTime;

          if (isPastMinimumTime && this.isImagesLoaded && this.isFontsLoaded) {
            finalize();
            return;
          } else {
            setTimeout(async () => {
              await this.loadBackground(startTime, true);
            }, 100);
          }
        });
      }
    }
  }

  private async loadRouteChangeBackground(
    startTime: number,
    isRetry?: boolean
  ): Promise<void> {
    const finalize = () => {
      const mainElement = document.querySelector('main');
      mainElement?.classList.add('is-loaded');
      this.loaderRef.instance.isHidden = true;

      setTimeout(() => {
        this.loaderRef.destroy();
        mainElement?.classList.remove('disable-interact');
      }, 650);

      return;
    };

    if (isRetry) {
      const timeItTookToLoad = Date.now() - startTime;
      const isPastMinimumTime =
        timeItTookToLoad >= this.minimumRouteSwitchLoadingTime;

      if (isPastMinimumTime && this.isImagesLoaded && this.isFontsLoaded) {
        finalize();
      } else {
        setTimeout(async () => {
          await this.loadRouteChangeBackground(startTime, true);
        }, 100);
      }

      return;
    }

    if (this.isBrowser) {
      const mainElement = document.querySelector('main');
      mainElement?.classList.remove('is-loaded');

      setTimeout(() => {
        const endTime = Date.now();
        const timeItTookToLoad = endTime - startTime;
        const isPastMinimumTime =
          timeItTookToLoad >= this.minimumRouteSwitchLoadingTime;

        if (isPastMinimumTime && this.isImagesLoaded && this.isFontsLoaded) {
          finalize();
        } else {
          setTimeout(async () => {
            await this.loadRouteChangeBackground(startTime, true);
          }, 100);
        }
      });
    }
  }

  private placeImageLoaderHook(): void {
    if (this.isBrowser) {
      const images = Array.from(document.querySelectorAll('img'));

      const checkImageLoad = () => {
        const allLoaded = images.every((img) => img.complete);
        if (allLoaded) {
          this.isImagesLoaded = true;
        } else {
          setTimeout(checkImageLoad, 100);
        }
      };

      checkImageLoad();
    }
  }

  private placeFontsHook(): void {
    const fontFamilies = this.fonts;
    if (!fontFamilies.length) {
      this.isFontsLoaded = true;
      return;
    }

    if (this.isBrowser) {
      const checkFonts = () => {
        for (const fontFamily of fontFamilies) {
          let fontLoaded = false;
          document.fonts.ready.then(() => {
            document.fonts.forEach((fontFace) => {
              if (
                fontFace.family === fontFamily &&
                fontFace.status === 'loaded'
              ) {
                fontLoaded = true;
              }
            });

            if (!fontLoaded) {
              return false;
            }

            return true;
          });
        }

        return true;
      };

      const interval = setInterval(() => {
        if (checkFonts()) {
          clearInterval(interval);
          this.isFontsLoaded = true;
        }
      }, 100);
    }
  }
}
