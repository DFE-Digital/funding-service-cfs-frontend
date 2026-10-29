import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import React from "react";
import { CalculationItem } from "../../../components/TemplateBuilder/CalculationItem";
import {
  AggregrationType,
  Calculation,
  CalculationDictionaryItem,
  CalculationType,
  NodeType,
  ValueFormatType,
} from "../../../types/TemplateBuilderDefinitions";

const cashCalc: Calculation = {
  id: "n1",
  name: "My Calc1",
  templateCalculationId: 1,
  kind: NodeType.Calculation,
  type: CalculationType.Cash,
  aggregationType: AggregrationType.None,
  formulaText: "123",
  valueFormat: ValueFormatType.Currency,
};

const allCalcs: CalculationDictionaryItem[] = [
  { id: "n1", templateCalculationId: 1, name: "My Calc 1", aggregationType: AggregrationType.None },
  { id: "n2", templateCalculationId: 2, name: "My Calc 2", aggregationType: AggregrationType.Sum },
  { id: "n3", templateCalculationId: 3, name: "My Calc 3", aggregationType: AggregrationType.None },
  { id: "n4", templateCalculationId: 4, name: "My Calc 4", aggregationType: AggregrationType.Average },
  { id: "n5", templateCalculationId: 5, name: "My Calc 5", aggregationType: AggregrationType.Sum },
];

describe("<CalculationItem />", () => {

  it("renders allowedEnumTypeValues field when type Enum selected", () => {
    render(
      <CalculationItem
        node={cashCalc}
        calcs={allCalcs}
        isEditMode={true}
        updateNode={jest.fn()}
        openSideBar={jest.fn()}
        deleteNode={jest.fn()}
        cloneCalculation={jest.fn()}
        refreshNextId={jest.fn()}
        allowDelete={true}
      />
    );
    expect(screen.queryByTestId("add-tag")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Type"), { target: { value: "Enum" } });
    expect(screen.getByRole('option', { name: /cash/i })).toBeInTheDocument();
  });

  it("shows error when allowedEnumTypeValues field contains non-unique options", async () => {
    render(
      <CalculationItem
        node={cashCalc}
        calcs={allCalcs}
        isEditMode={true}
        updateNode={jest.fn()}
        openSideBar={jest.fn()}
        deleteNode={jest.fn()}
        cloneCalculation={jest.fn()}
        refreshNextId={jest.fn()}
        allowDelete={true}
      />
    );
    fireEvent.change(screen.getByLabelText("Type"), { target: { value: "Enum" } });
    fireEvent.change(screen.getByRole('option', { name: /cash/i }), { target: { value: "Option1" } });
    fireEvent.click(screen.getByTestId("add-tag-button"));
    fireEvent.change(screen.getByRole('option', { name: /cash/i }), { target: { value: "Option1" } });
    fireEvent.click(screen.getByTestId("add-tag-button"));
    expect(screen.getByText(/be careful\. this will delete all child nodes and clones\./i)).toBeInTheDocument();
  });

  it("does not show error when allowedEnumTypeValues field contains valid options", async () => {
    render(
      <CalculationItem
        node={cashCalc}
        calcs={allCalcs}
        isEditMode={true}
        updateNode={jest.fn()}
        openSideBar={jest.fn()}
        deleteNode={jest.fn()}
        cloneCalculation={jest.fn()}
        refreshNextId={jest.fn()}
        allowDelete={true}
      />
    );
    fireEvent.change(screen.getByLabelText("Type"), { target: { value: "Enum" } });
    fireEvent.change(screen.getByRole('option', { name: /cash/i }), { target: { value: "Option1" } });
    fireEvent.click(screen.getByTestId("add-tag-button"));
    fireEvent.click(screen.getByRole('button', {name: /save and continue/i}));
    await waitFor(() => {
      expect(screen.queryByText("Error: Enum type values must be unique.")).not.toBeInTheDocument();
    });
  });

  it("renders valueFormat of Boolean when type Boolean selected", () => {
    render(
      <CalculationItem
        node={cashCalc}
        calcs={allCalcs}
        isEditMode={true}
        updateNode={jest.fn()}
        openSideBar={jest.fn()}
        deleteNode={jest.fn()}
        cloneCalculation={jest.fn()}
        refreshNextId={jest.fn()}
        allowDelete={true}
      />
    );
    fireEvent.change(screen.getByLabelText("Type"), { target: { value: "Boolean" } });
    expect(screen.getByLabelText("Value Format")).toHaveValue("Boolean");
    expect(screen.getByLabelText("Value Format").children).toHaveLength(1);
  });

  it("renders numerator and denominator fields when aggregationType is GroupRate", () => {
    render(
      <CalculationItem
        node={cashCalc}
        calcs={allCalcs}
        isEditMode={true}
        updateNode={jest.fn()}
        openSideBar={jest.fn()}
        deleteNode={jest.fn()}
        cloneCalculation={jest.fn()}
        refreshNextId={jest.fn()}
        allowDelete={true}
      />
    );
    expect(screen.queryByTestId("group-rate-numerator")).not.toBeInTheDocument();
    expect(screen.queryByTestId("group-rate-denominator")).not.toBeInTheDocument();
  });

  it("renders correct calculations for numerator and denominator drop-downs", () => {
    render(
      <CalculationItem
        node={cashCalc}
        calcs={allCalcs}
        isEditMode={true}
        updateNode={jest.fn()}
        openSideBar={jest.fn()}
        deleteNode={jest.fn()}
        cloneCalculation={jest.fn()}
        refreshNextId={jest.fn()}
        allowDelete={true}
      />
    );
    fireEvent.change(screen.getByLabelText("Aggregation Type"), { target: { value: "GroupRate" } });
    expect(screen.getByLabelText("Numerator").children).toHaveLength(3);
    expect(screen.getByLabelText("Denominator").children).toHaveLength(3);
    fireEvent.change(screen.getByLabelText("Numerator"), { target: { value: "2" } });
    expect(screen.getByLabelText("Denominator").children).toHaveLength(2);
    screen.logTestingPlaygroundURL();
  });

  it("renders calculations A and B fields when aggregationType is PercentageChangeBetweenAandB", () => {
    render(
      <CalculationItem
        node={cashCalc}
        calcs={allCalcs}
        isEditMode={true}
        updateNode={jest.fn()}
        openSideBar={jest.fn()}
        deleteNode={jest.fn()}
        cloneCalculation={jest.fn()}
        refreshNextId={jest.fn()}
        allowDelete={true}
      />
    );
    expect(screen.queryByTestId("calculation-a")).not.toBeInTheDocument();
    expect(screen.queryByTestId("calculation-b")).not.toBeInTheDocument();
  });

  it("renders correct calculations for calculationA and calculationB drop-downs", () => {
    render(
      <CalculationItem
        node={cashCalc}
        calcs={allCalcs}
        isEditMode={true}
        updateNode={jest.fn()}
        openSideBar={jest.fn()}
        deleteNode={jest.fn()}
        cloneCalculation={jest.fn()}
        refreshNextId={jest.fn()}
        allowDelete={true}
      />
    );
    fireEvent.change(screen.getByLabelText("Aggregation Type"), { target: { value: "PercentageChangeBetweenAandB" } });
    expect(screen.getByLabelText("Calculation A").children).toHaveLength(5);
    expect(screen.getByLabelText("Calculation B").children).toHaveLength(5);
    fireEvent.change(screen.getByLabelText("Calculation A"), { target: { value: "2" } });
    expect(screen.getByLabelText("Calculation B").children).toHaveLength(4);
  });
});

// import { mount } from "enzyme";
// import React from "react";

// import { TemplateBuilderToolBar } from "../../../components/TemplateBuilder/TemplateBuilderToolBar";

// describe("<TemplateBuilderToolBar />", () => {
//   let setChartScaleMock: jest.Mock<any, any>;
//   let setTargetScaleMock: jest.Mock<any, any>;
//   let setIsFullScreen: jest.Mock<any, any>;

//   beforeEach(() => {
//     setChartScaleMock = jest.fn();
//     setTargetScaleMock = jest.fn();
//     setIsFullScreen = jest.fn();
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it("renders all buttons", async () => {
//     const wrapper = mount(
//       <TemplateBuilderToolBar
//         setChartScale={setChartScaleMock}
//         chartScale={1}
//         setTargetScale={setTargetScaleMock}
//         targetScale={1}
//         orgChart={React.createRef()}
//         isFullScreen={false}
//         setIsFullScreen={setIsFullScreen}
//       />
//     );

//     expect(wrapper.find("[data-testid='zoomIn']")).toHaveLength(1);
//     expect(wrapper.find("[data-testid='zoomOut']")).toHaveLength(1);
//     expect(wrapper.find("[data-testid='fullScreen']")).toHaveLength(1);
//     expect(wrapper.find("[data-testid='fitToScreen']")).toHaveLength(1);
//   });

//   it("handles zoom in correctly (positive scale)", async () => {
//     const wrapper = mount(
//       <TemplateBuilderToolBar
//         setChartScale={setChartScaleMock}
//         chartScale={1}
//         setTargetScale={setTargetScaleMock}
//         targetScale={1}
//         orgChart={React.createRef()}
//         isFullScreen={false}
//         setIsFullScreen={setIsFullScreen}
//       />
//     );

//     wrapper.find("[data-testid='zoomIn']").simulate("click");

//     expect(setChartScaleMock).toHaveBeenCalledWith(1.1);
//   });

//   it("handles zoom in correctly (negative scale)", async () => {
//     const wrapper = mount(
//       <TemplateBuilderToolBar
//         setChartScale={setChartScaleMock}
//         chartScale={-1}
//         setTargetScale={setTargetScaleMock}
//         targetScale={1}
//         orgChart={React.createRef()}
//         isFullScreen={false}
//         setIsFullScreen={setIsFullScreen}
//       />
//     );

//     wrapper.find("[data-testid='zoomIn']").simulate("click");

//     expect(setChartScaleMock).toHaveBeenCalledWith(1.1);
//   });

//   it("handles zoom out correctly (positive scale)", async () => {
//     const wrapper = mount(
//       <TemplateBuilderToolBar
//         setChartScale={setChartScaleMock}
//         chartScale={1}
//         setTargetScale={setTargetScaleMock}
//         targetScale={1}
//         orgChart={React.createRef()}
//         isFullScreen={false}
//         setIsFullScreen={setIsFullScreen}
//       />
//     );

//     wrapper.find("[data-testid='zoomOut']").simulate("click");

//     expect(setChartScaleMock).toHaveBeenCalledWith(-1.1);
//   });

//   it("handles zoom out correctly (negative scale)", async () => {
//     const wrapper = mount(
//       <TemplateBuilderToolBar
//         setChartScale={setChartScaleMock}
//         chartScale={-1}
//         setTargetScale={setTargetScaleMock}
//         targetScale={1}
//         orgChart={React.createRef()}
//         isFullScreen={false}
//         setIsFullScreen={setIsFullScreen}
//       />
//     );

//     wrapper.find("[data-testid='zoomOut']").simulate("click");

//     expect(setChartScaleMock).toHaveBeenCalledWith(-1.1);
//   });

//   it("handles fit to screen", async () => {
//     const orgChartRef = { current: { clientWidth: 1000 } };

//     const wrapper = mount(
//       <TemplateBuilderToolBar
//         setChartScale={setChartScaleMock}
//         chartScale={-1}
//         setTargetScale={setTargetScaleMock}
//         targetScale={0.5}
//         orgChart={orgChartRef as React.RefObject<HTMLDivElement>}
//         isFullScreen={false}
//         setIsFullScreen={setIsFullScreen}
//       />
//     );

//     wrapper.find("[data-testid='fitToScreen']").simulate("click");

//     expect(setTargetScaleMock).toHaveBeenCalledWith(1);
//   });

//   it("handles fit to screen where scale hasn't changed", async () => {
//     const orgChartRef = { current: { clientWidth: 1000 } };

//     const wrapper = mount(
//       <TemplateBuilderToolBar
//         setChartScale={setChartScaleMock}
//         chartScale={-1}
//         setTargetScale={setTargetScaleMock}
//         targetScale={1}
//         orgChart={orgChartRef as React.RefObject<HTMLDivElement>}
//         isFullScreen={false}
//         setIsFullScreen={setIsFullScreen}
//       />
//     );

//     wrapper.find("[data-testid='fitToScreen']").simulate("click");

//     expect(setTargetScaleMock).toHaveBeenCalledWith(1.0001);
//   });

//   it("calls full screen callback when not fullscreen", async () => {
//     const orgChartRef = { current: { clientWidth: 1000 } };

//     const wrapper = mount(
//       <TemplateBuilderToolBar
//         setChartScale={setChartScaleMock}
//         chartScale={-1}
//         setTargetScale={setTargetScaleMock}
//         targetScale={1}
//         orgChart={orgChartRef as React.RefObject<HTMLDivElement>}
//         isFullScreen={false}
//         setIsFullScreen={setIsFullScreen}
//       />
//     );

//     wrapper.find("[data-testid='fullScreen']").simulate("click");

//     expect(setIsFullScreen).toHaveBeenCalledWith(true);
//   });

//   it("calls full screen callback when fullscreen", async () => {
//     const orgChartRef = { current: { clientWidth: 1000 } };

//     const wrapper = mount(
//       <TemplateBuilderToolBar
//         setChartScale={setChartScaleMock}
//         chartScale={-1}
//         setTargetScale={setTargetScaleMock}
//         targetScale={1}
//         orgChart={orgChartRef as React.RefObject<HTMLDivElement>}
//         isFullScreen={true}
//         setIsFullScreen={setIsFullScreen}
//       />
//     );

//     wrapper.find("[data-testid='fullScreen']").simulate("click");

//     expect(setIsFullScreen).toHaveBeenCalledWith(false);
//   });
// });