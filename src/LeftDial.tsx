import React from "react";
import { LeftDialProps, PopupState, Point } from "./defines";
//require("./index.css");
//import "./index.css";

export default class LeftDial extends React.Component<
  LeftDialProps,
  PopupState
> {
  private elementRefs: Array<HTMLDivElement | null> = new Array<HTMLDivElement | null>();

  constructor(props: LeftDialProps) {
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
      this.elementRefs.push(element);
    }
  }

  private renderItems() {
    var { open, items, radius } = this.props;
    var elements = new Array<JSX.Element>();
    var animationDuration = this.duration();

    radius = open ? radius : 0;

    var bin = 180 / items.length;
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];

      let angle = bin * (i + 1) - bin / 2;
      angle *= Math.PI / 180;

      let point = new Point(radius * Math.sin(angle), radius * Math.cos(angle));
      point.y += window.innerHeight / 2;
      elements.push(
        <div
          style={{
            position: "fixed",
            left: point.x,
            top: point.y,
            transition: `all ${animationDuration}s ease-in-out`,
            transform: "translate(-50%, -50%)",
            opacity: open ? 1 : 0
          }}
          ref={e => this.addRef(e)}
        >
          {item}
        </div>
      );
    }

    return elements;
  }

  public render(): JSX.Element {
    return <div>{this.renderItems()}</div>;
  }
}
