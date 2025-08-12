import { trigger, transition, style, animate } from '@angular/animations';

export const slideInAnimation = trigger('slideIn', [
  transition(':enter', [
    style({ transform: 'translateX(-100px)', opacity: 0 }),
    animate(
      '200ms ease-out',
      style({ transform: 'translateX(0)', opacity: 1 })
    ),
  ]),
]);
