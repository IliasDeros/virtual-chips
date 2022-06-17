import { Chip } from "./Chip";
import { render } from "@testing-library/react";

it("Renders default chip", () => {
  const { container } = render(<Chip />);
  expect(container.firstChild).toMatchSnapshot();
});

it("Renders chip with custom value", () => {
  const { container } = render(<Chip value="5" />);
  expect(container.firstChild).toMatchSnapshot();
});

it("Renders stacked chip", () => {
  const { container } = render(<Chip stack />);
  expect(container.firstChild).toMatchSnapshot();
});

it("Renders horizontally stacked chip", () => {
  const { container } = render(<Chip stackHorizontal />);
  expect(container.firstChild).toMatchSnapshot();
});

it("Renders vertically stacked chip", () => {
  const { container } = render(<Chip stackVertical />);
  expect(container.firstChild).toMatchSnapshot();
});

it("Renders custom class", () => {
  const { container } = render(<Chip className="custom-class" />);
  expect(container.firstChild).toMatchSnapshot();
});
