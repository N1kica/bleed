import { isPlatformBrowser } from '@angular/common';
import { InjectionToken, PLATFORM_ID, inject } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'window local storage object',
  {
    providedIn: 'root',
    factory: () => {
      return isPlatformBrowser(inject(PLATFORM_ID))
        ? window.localStorage
        : ({} as Storage);
    },
  },
);
