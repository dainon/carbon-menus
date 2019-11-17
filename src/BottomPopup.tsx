import React, { CSSProperties } from "react";
import { Point, BottomPopupProps, PopupState } from "./defines";
//require("./index.css");
//import "./index.css";

class BottomPopup extends React.Component<BottomPopupProps, PopupState> {
  private positions: Array<Point> = new Array<Point>();
  private elementRefs: Array<HTMLDivElement | null> = new Array<HTMLDivElement | null>();
  private maxHeight: number = 0;

  constructor(props: BottomPopupProps) {
    super(props);

    this.state = {
      mounted: false,
      toggle: false
    };
  }

  private duration() {
    return this.props.animationDuration ? this.props.animationDuration : 0.2;
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  private addRef(element: HTMLDivElement | null) {
    if (this.state.mounted) return;

    if (element) {
      console.log("element width", element.clientWidth);
      this.elementRefs.push(element);
      this.positions.push(new Point(window.innerWidth / 2, 0));
    }
  }

  private alignItems() {
    var { gutter, open } = this.props;
    var { elementRefs } = this;

    if (open) {
      var fullWidth = 0;
      var heightMax = 0;
      for (var i = 0; i < elementRefs.length; ++i) {
        let item: HTMLDivElement | null = elementRefs[i];

        if (item) {
          fullWidth += item.clientWidth;

          if (heightMax < item.clientHeight) {
            heightMax = item.clientHeight;
          }

          if (i != elementRefs.length - 1) {
            fullWidth += gutter;
          }
        }
      }
      this.maxHeight = heightMax;

      let pageWidth = window.innerWidth;

      let point = new Point(pageWidth / 2 - fullWidth / 2, this.maxHeight);
      for (var i = 0; i < elementRefs.length; ++i) {
        let item: HTMLDivElement | null = elementRefs[i];
        if (item) {
          this.positions[i] = new Point(point.x, 0);
          point.x += item.clientWidth + gutter;
        }
      }
    } else {
      for (var i = 0; i < this.positions.length; ++i) {
        let point = this.positions[i];
        point.y = 0;
        point.x = window.innerWidth / 2;
      }
    }
  }

  private renderButtons = () => {
    var { items } = this.props;

    var animationDuration = this.duration();
    if (items == null) return null;

    var out = Array<JSX.Element>();
    for (var i = 0; i < items.length; ++i) {
      let item = items[i];
      let point = this.positions[i];

      if (point == undefined) {
        point = new Point(0, 0);
      }

      var style = {
        position: "absolute",
        left: point.x,
        top: point.y,
        transition: `all ${animationDuration}s ease-in-out`
      } as CSSProperties;

      out.push(
        <div key={i} ref={e => this.addRef(e)} style={style}>
          {item}
        </div>
      );
    }

    return out;
  };

  public render(): JSX.Element {
    var { open } = this.props;

    var animationDuration = this.duration();
    this.alignItems();

    const style = {
      position: "fixed",
      display: "flex",
      flexDirection: "row",
      justifyContent: "baseline",
      width: document.body.clientWidth,
      top: open
        ? window.innerHeight - this.maxHeight - 20
        : window.innerHeight + 20,
      height: this.maxHeight,
      transition: `all ${animationDuration}s ease-in-out`,
      opacity: open ? 1 : 0
    } as React.CSSProperties;

    return <div style={style}>{this.renderButtons()}</div>;
  }
}

export default BottomPopup;
