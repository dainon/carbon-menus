/**
 * @class ExampleComponent
 */

export type Props = { text: string };

export { default as BottomPopup } from "./BottomPopup";
export { default as LeftDial } from "./LeftDial";
export { default as SlideOut } from "./SlideOut";

// export default class ExampleComponent extends React.Component<Props> {
//   render() {
//     const { text } = this.props;

//     return <div style={{ color: "blue" }}>Hello {text}</div>;
//   }
// }
