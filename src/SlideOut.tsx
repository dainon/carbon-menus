import React, { Component, CSSProperties } from "react";

export class Point {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export interface Props {
  items: Array<JSX.Element>;
  gutter: number;
}

export interface State {
  mounted: boolean;
  open: boolean;
  hoverButton: boolean;
  hoverMenu: boolean;
}

export interface Rect extends Point {
  width: number;
  height: number;
}

export enum ItemNames {
  Button,
  Menu
}

export default class SlideOut extends Component<Props, State> {
  private buttonElement: any | null = null;
  private elementRefs: Array<any | null> = new Array<any | null>();

  constructor(props: Props) {
    super(props);

    this.state = {
      mounted: false,
      open: false,
      hoverButton: false,
      hoverMenu: false
    };
  }

  public componentDidMount() {
    this.setState({ mounted: true });
  }

  private addButtonRef(element: any | null) {
    if (this.state.mounted) return;

    if (this.buttonElement == null && element) {
      this.buttonElement = element;
    }
  }

  private addMenuRef(element: any | null) {
    if (this.state.mounted) return;

    if (element) {
      this.elementRefs.push(element);
    }
  }

  private calcWidth() {
    var { gutter } = this.props;

    var width = 0;
    for (var i = 0; i < this.elementRefs.length; ++i) {
      var element = this.elementRefs[i];
      width += element.clientWidth;
    }
    width += (this.elementRefs.length + 2) * gutter - 2;
    return width;
  }

  private calcHeight() {
    var height = 0;
    for (var i = 0; i < this.elementRefs.length; ++i) {
      var element = this.elementRefs[i];
      if (element.clientHeight > height) {
        height = element.clientHeight;
      }
    }
    return height;
  }

  private calcPosition(el) {
    var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  private onMouseEnter(itemName: ItemNames) {
    var { hoverButton } = this.state;
    switch (itemName) {
      case ItemNames.Button: {
        this.setState({ hoverButton: true, open: true });
        break;
      }
      case ItemNames.Menu: {
        if (hoverButton) {
          this.setState({ hoverMenu: true, open: true });
        }
        break;
      }
    }
  }

  private onMouseLeave(itemName: ItemNames) {
    var that = this;
    setTimeout(function() {
      that.closeMenu(itemName);
    }, 100);
  }

  private closeMenu(itemName: ItemNames) {
    var { hoverMenu, hoverButton } = this.state;
    switch (itemName) {
      case ItemNames.Button: {
        hoverButton = false;
        break;
      }
      case ItemNames.Menu: {
        hoverMenu = false;
        break;
      }
    }
    var open = true;
    if (hoverMenu === false && hoverButton === false) {
      open = false;
    }
    this.setState({
      hoverButton: hoverButton,
      hoverMenu: hoverMenu,
      open: open
    });
  }

  private renderButtons = () => {
    var { items } = this.props;
    var gutter = 12;

    var animationDuration = 0.2; //this.duration();
    if (items == null) return null;

    var open = this.state.open;
    var out = Array<JSX.Element>();
    let posX = this.buttonElement ? this.buttonElement.clientWidth + gutter : 0;
    let top = this.buttonElement
      ? this.calcPosition(this.buttonElement).top
      : 0;
    let width = open
      ? this.buttonElement
        ? this.buttonElement.clientWidth + gutter
        : 0
      : 0;
    for (var i = 0; i < items.length; ++i) {
      let item = items[i];

      let style = {
        position: "fixed",
        left: posX,
        top: top,
        transition: `all ${animationDuration}s ease-in-out`,
        opacity: open ? "1" : "0"
      } as CSSProperties;

      out.push(
        <div key={i} style={style} ref={el => this.addMenuRef(el)}>
          {item}
        </div>
      );
      posX += width;
    }

    return out;
  };

  public render(): JSX.Element {
    var left = this.buttonElement
      ? `${this.buttonElement.clientWidth}px`
      : "0px";
    var open = this.state.open;
    const style = {
      position: "fixed",
      display: "flex",
      flexDirection: "row",
      backgroundColor: "transparent",
      justifyContent: "baseline",
      width: open ? this.calcWidth() : "0px",
      left: left,
      height: this.calcHeight(),
      transition: `all 0.2s ease-in-out`,
      opacity: open ? 1 : 0,
      marginLeft: "2px"
    } as React.CSSProperties;

    return (
      <div>
        <div
          onMouseEnter={() => this.onMouseEnter(ItemNames.Menu)}
          onMouseLeave={() => this.onMouseLeave(ItemNames.Menu)}
          style={style}
        >
          {this.renderButtons()}
        </div>
        <div
          onMouseEnter={() => this.onMouseEnter(ItemNames.Button)}
          onMouseLeave={() => this.onMouseLeave(ItemNames.Button)}
          ref={el => this.addButtonRef(el)}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
