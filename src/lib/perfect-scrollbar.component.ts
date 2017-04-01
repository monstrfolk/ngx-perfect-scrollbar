import * as Ps from 'perfect-scrollbar';

import { Component, DoCheck, OnDestroy, OnChanges, Input, Output, EventEmitter, Optional, HostBinding, ElementRef, AfterViewInit, ViewEncapsulation, SimpleChanges, NgZone } from '@angular/core';

import { PerfectScrollbarConfig, PerfectScrollbarConfigInterface } from './perfect-scrollbar.interfaces';

@Component({
  selector: 'perfect-scrollbar',
  templateUrl: './perfect-scrollbar.component.html',
  styleUrls: ['./perfect-scrollbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PerfectScrollbarComponent implements DoCheck, OnDestroy, OnChanges, AfterViewInit {
  private width: number;
  private height: number;

  private contentWidth: number;
  private contentHeight: number;

  @HostBinding('hidden')
  @Input() hidden: boolean = false;

  @Input() runInsideAngular: boolean = false;

  @Input() config: PerfectScrollbarConfigInterface;

  @Output() onScrollX: EventEmitter<null>;

  @Output() onScrollY: EventEmitter<null>;

  @Output() onScrollUp: EventEmitter<null>;

  @Output() onScrollDown: EventEmitter<null>;

  @Output() onScrollLeft: EventEmitter<null>;

  @Output() onScrollRight: EventEmitter<null>;

  @Output() onYScrollReachStart: EventEmitter<null>;

  @Output() onYScrollReachEnd: EventEmitter<null>;

  @Output() onXScrollReachStart: EventEmitter<null>;

  @Output() onXScrollReachEnd: EventEmitter<null>;

  constructor( public elementRef: ElementRef, @Optional() private defaults: PerfectScrollbarConfig, private zone: NgZone ) {}

  ngDoCheck() {
    if (this.elementRef.nativeElement.children && this.elementRef.nativeElement.children.length) {
      let width = this.elementRef.nativeElement.offsetWidth;
      let height = this.elementRef.nativeElement.offsetHeight;

      let contentWidth = this.elementRef.nativeElement.children[0].offsetWidth;
      let contentHeight = this.elementRef.nativeElement.children[0].offsetHeight;

      if (width !== this.width || height !== this.height || contentWidth !== this.contentWidth || contentHeight !== this.contentHeight) {
        this.width = width;
        this.height = height;

        this.contentWidth = contentWidth;
        this.contentHeight = contentHeight;

        this.update();
      }
    }
  }

  ngOnDestroy() {
    if (this.runInsideAngular) {
      Ps.destroy(this.elementRef.nativeElement);
    } else {
      this.zone.runOutsideAngular(() => {
        Ps.destroy(this.elementRef.nativeElement);
      });
    }

    document.removeEventListener('ps-scroll-y');
    document.removeEventListener('ps-scroll-x');
    document.removeEventListener('ps-scroll-up');
    document.removeEventListener('ps-scroll-down');
    document.removeEventListener('ps-scroll-left');
    document.removeEventListener('ps-scroll-right');
    document.removeEventListener('ps-y-reach-start');
    document.removeEventListener('ps-y-reach-end');
    document.removeEventListener('ps-x-reach-start');
    document.removeEventListener('ps-x-reach-end');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hidden'] && !this.hidden) {
      this.update();
    }
  }

  ngAfterViewInit() {
    let config = new PerfectScrollbarConfig(this.defaults);

    config.assign(this.config);

    if (this.runInsideAngular) {
      Ps.initialize(this.elementRef.nativeElement, config);
    } else {
      this.zone.runOutsideAngular(() => {
        Ps.initialize(this.elementRef.nativeElement, config);
      });
    }

    this.updateEventEmitters();
  }

  update() {
    if (this.runInsideAngular) {
      Ps.update(this.elementRef.nativeElement);
    } else {
      this.zone.runOutsideAngular(() => {
        Ps.update(this.elementRef.nativeElement);
      });
    }
  }

  updateEventEmitters() {
    if (this.onScrollX.observers.length > 0) {
      this.onScrollX = new EventEmitter();
      document.addEventListener('ps-scroll-y', function () {
        this.onScrollX.emit();
      });
    }
    if (this.onScrollY.observers.length > 0) {
      this.onScrollY = new EventEmitter();
      document.addEventListener('ps-scroll-x', function () {
        this.onScrollY.emit();
      });
    }
    if (this.onScrollUp.observers.length > 0) {
      this.onScrollUp = new EventEmitter();
      document.addEventListener('ps-scroll-up', function () {
        this.onScrollUp.emit();
      });
    }
    if (this.onScrollDown.observers.length > 0) {
      this.onScrollDown = new EventEmitter();
      document.addEventListener('ps-scroll-down', function () {
        this.onScrollDown.emit();
      });
    }
    if (this.onScrollLeft.observers.length > 0) {
      this.onScrollLeft = new EventEmitter();
      document.addEventListener('ps-scroll-left', function () {
        this.onScrollLeft.emit();
      });
    }
    if (this.onScrollRight.observers.length > 0) {
      this.onScrollRight = new EventEmitter();
      document.addEventListener('ps-scroll-right', function () {
        this.onScrollRight.emit();
      });
    }
    if (this.onYScrollReachStart.observers.length > 0) {
      this.onYScrollReachStart = new EventEmitter();
      document.addEventListener('ps-y-reach-start', function () {
        this.onYScrollReachStart.emit();
      });
    }
    //if (this.onYScrollReachEnd.observers.length > 0) {
      console.log('starting');
      this.onYScrollReachEnd = new EventEmitter();
      document.addEventListener('ps-y-reach-end', function () {
        console.log('scroll end y');
        this.onYScrollReachEnd.emit();
      });
    //}
    if (this.onXScrollReachStart.observers.length > 0) {
      this.onXScrollReachStart = new EventEmitter();
      document.addEventListener('ps-x-reach-start', function () {
        this.onXScrollReachStart.emit();
      });
    }
    if (this.onXScrollReachEnd.observers.length > 0) {
      this.onXScrollReachEnd = new EventEmitter();
      document.addEventListener('ps-x-reach-end', function () {
        this.onXScrollReachEnd.emit();
      });
    }
  }

  scrollTo(x: number, y?: number) {
    if (y == null) {
      this.elementRef.nativeElement.scrollTop = x;
    } else {
      this.elementRef.nativeElement.scrollTop = y;

      this.elementRef.nativeElement.scrollLeft = x;
    }

    this.update();
  }

  scrollToTop(offset: number = 0) {
    this.elementRef.nativeElement.scrollTop = 0 + offset;

    this.update();
  }

  scrollToLeft(offset: number = 0) {
    this.elementRef.nativeElement.scrollLeft = 0 + offset;

    this.update();
  }

  scrollToRight(offset: number = 0) {
    let width = this.elementRef.nativeElement.scrollWidth;

    this.elementRef.nativeElement.scrollLeft = width - offset;

    this.update();
  }

  scrollToBottom(offset: number = 0) {
    let height = this.elementRef.nativeElement.scrollHeight;

    this.elementRef.nativeElement.scrollTop = height - offset;

    this.update();
  }
}

