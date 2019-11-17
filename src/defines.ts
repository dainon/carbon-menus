export class Point {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export interface BottomPopupProps {
  open: boolean;
  gutter: number;
  items: Array<JSX.Element>;
  animationDuration?: number;
}

export interface PopupState {
  mounted: boolean;
  toggle: boolean;
}

export interface LeftDialProps {
  open: boolean;
  items: Array<JSX.Element>;
  radius: number;
  animationDuration?: number;
}
