import * as React from "react";
import BottomPopup from "../BottomPopup";
const ReactTestRenderer = require("react-test-renderer");

test("Component should show 'red' text 'Hello World'", () => {
  const component = ReactTestRenderer.create(
    <BottomPopup gutter={10} items={new Array<JSX.Element>()} open={false} />
  );
  //const testInstance = component.root;

  //expect(testInstance.findByType(BottomPopup).props.text).toBe("World");

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
