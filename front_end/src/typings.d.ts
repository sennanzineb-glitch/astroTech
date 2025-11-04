declare module 'bootstrap' {
  export class Modal {
    constructor(element: HTMLElement, options?: any);
    show(): void;
    hide(): void;
    toggle(): void;
    static getInstance(element: HTMLElement): Modal | null;
  }
}