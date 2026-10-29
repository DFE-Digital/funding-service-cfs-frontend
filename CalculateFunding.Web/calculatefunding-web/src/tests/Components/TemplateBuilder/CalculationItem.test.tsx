import { render, fireEvent, screen, waitFor } from "@testing-library/react";
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

const pupilNumberCalc: Calculation = {
    id: "a1",
    name: "Adjustment Calc",
    templateCalculationId: 1,
    kind: NodeType.Calculation,
    type: CalculationType.PupilNumber,
    aggregationType: AggregrationType.None,
    formulaText: "123",
    valueFormat: ValueFormatType.Number,
};

const allCalcs: CalculationDictionaryItem[] = [
    { id: "n1", templateCalculationId: 1, name: "My Calc 1", aggregationType: AggregrationType.None },
    { id: "n2", templateCalculationId: 2, name: "My Calc 2", aggregationType: AggregrationType.Sum },
    { id: "n3", templateCalculationId: 3, name: "My Calc 3", aggregationType: AggregrationType.None },
    { id: "n4", templateCalculationId: 4, name: "My Calc 4", aggregationType: AggregrationType.Average },
    { id: "n5", templateCalculationId: 5, name: "My Calc 5", aggregationType: AggregrationType.Sum },
];

const defaultProps = {
  node: cashCalc,
  calcs: allCalcs,
  isEditMode: true,
  updateNode: jest.fn(),
  openSideBar: jest.fn(),
  refreshNextId: jest.fn(),
  deleteNode: jest.fn(),
  cloneCalculation: jest.fn(),
  allowDelete: true,
};

const renderComponent = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };
  render(<CalculationItem {...mergedProps} />);
  return mergedProps; // useful if you want access to mocks
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("<CalculationItem />", () => {

    it("renders external calculation name input with default value", () => {
    renderComponent({
        node: {
        ...cashCalc,
        externalCalculationName: "Initial External Name",
        },
    });

    const input = screen.getByLabelText(/external calculation name/i);
    expect(input).toHaveValue("Initial External Name");
    });

    it("allows user to change external calculation name", () => {
        renderComponent();

        const input = screen.getByLabelText(/external calculation name/i);

        fireEvent.change(input, { target: { value: "New External Name" } });

        expect(input).toHaveValue("New External Name");
    });

    it("saves external calculation name when clicking save", () => {
        const mockUpdate = jest.fn();

        renderComponent({ updateNode: mockUpdate });

        const input = screen.getByLabelText(/external calculation name/i);

        fireEvent.change(input, { target: { value: "Saved External Name" } });

        fireEvent.click(screen.getByRole("button", { name: /save and continue/i }));

        expect(mockUpdate).toHaveBeenCalled();

        const payload = mockUpdate.mock.calls[0][0];
        expect(payload.externalCalculationName).toBe("Saved External Name");
    });

    it("allows external calculation name to be empty", () => {
        const mockUpdate = jest.fn();

        renderComponent({ updateNode: mockUpdate });

        const input = screen.getByLabelText(/external calculation name/i);

        fireEvent.change(input, { target: { value: "" } });

        fireEvent.click(screen.getByRole("button", { name: /save and continue/i }));

        expect(mockUpdate).toHaveBeenCalled();

        const payload = mockUpdate.mock.calls[0][0];
        expect(payload.externalCalculationName).toBe(undefined);
    });

    it("does not show error when external name is empty", () => {
        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /save and continue/i }));

        expect(
            screen.queryByText(/external name must not be blank/i)
        ).not.toBeInTheDocument();
    });

    it("renders aggregationType of None and valueFormat of String when type Enum selected", () => {
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
        expect(screen.queryByTestId("calculation-allowed-enum-values")).not.toBeInTheDocument();
        fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: "Enum" } });
        waitFor(() => {
            expect(screen.getByLabelText("Value Format")).toHaveValue("Enum");
            expect(screen.getByLabelText("Aggregation Type")).toHaveValue("None");
            expect(screen.getByLabelText("Aggregation Type").children).toHaveLength(1);
            expect(screen.getByLabelText("Value Format")).toHaveValue("String");
            expect(screen.getByLabelText("Value Format").children).toHaveLength(1);
        });
    });

//     it("renders allowedEnumTypeValues field when type Enum selected", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );
//     expect(wrapper.find("#add-tag")).toHaveLength(0);
//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Enum" } });
//     expect(wrapper.find("#add-tag")).toHaveLength(1);
//   });
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
        fireEvent.change(screen.getByRole('combobox', { name: /type/i }), {
            target: { value: "Enum" }
        });
        waitFor(() => {
            expect(screen.getByLabelText("Value Format")).toHaveValue("Enum");
        });
        expect(screen.getByRole('option', { name: /enum/i })).toBeInTheDocument();
    });

//      it("shows error when click save and allowedEnumTypeValues field is empty", async () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );
//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Enum" } });
//     wrapper.find("#save-button").simulate("click");
//     await waitFor(() => {
//       expect(wrapper.find(".govuk-error-message")).toHaveLength(1);
//     });
//   });
    it("shows error when click save and allowedEnumTypeValues field is empty", async () => {
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
        fireEvent.change(screen.getByRole("combobox", { name: /type/i }), { target: { value: "Enum" } });
        fireEvent.click(screen.getByRole('button', {name: /save and continue/i}));
        expect(screen.getByText(/be careful\. this will delete all child nodes and clones\./i)).toBeInTheDocument();
    });

//     it("shows error when allowedEnumTypeValues field contains non-unique options", async () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );
//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Enum" } });
//     wrapper.find("#add-tag").simulate("change", { target: { value: "Option1" } });
//     wrapper.find("[data-testid='add-tag-button']").simulate("click");
//     wrapper.find("#add-tag").simulate("change", { target: { value: "Option1" } });
//     wrapper.find("[data-testid='add-tag-button']").simulate("click");
//     await waitFor(() => {
//       expect(wrapper.find(".govuk-error-message")).toHaveLength(1);
//     });
//   });

// it("does not show error when allowedEnumTypeValues field contains valid options", async () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );
//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Enum" } });
//     wrapper.find("#add-tag").simulate("change", { target: { value: "Option1" } });
//     wrapper.find("[data-testid='add-tag-button']").simulate("click");
//     wrapper.find("#save-button").simulate("click");
//     await waitFor(() => {
//       expect(wrapper.find(".govuk-error-message")).toHaveLength(0);
//     });
//   });

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
        fireEvent.change(screen.getByRole('combobox', { name: /type/i }), {
            target: { value: "Boolean" }
        });
        waitFor(() => {
            expect(screen.getByLabelText("Value Format")).toHaveValue("Boolean");
        });
        expect(screen.getByLabelText("Value Format").children).toHaveLength(1);
    });


//      it("renders numerator and denominator fields when aggregationType is GroupRate", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );
//     expect(wrapper.find("#group-rate-numerator")).toHaveLength(0);
//     expect(wrapper.find("#group-rate-denominator")).toHaveLength(0);
//     wrapper.find("#calculation-aggregation-type").simulate("change", { target: { value: "GroupRate" } });
//     expect(wrapper.find("#group-rate-numerator")).toHaveLength(1);
//     expect(wrapper.find("#group-rate-denominator")).toHaveLength(1);
//   });
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

//     it("renders correct calculations for numerator and denominator drop-downs", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );
//     wrapper.find("#calculation-aggregation-type").simulate("change", { target: { value: "GroupRate" } });
//     // Initially numerator and denominator has values 0, 2 and 5
//     expect(wrapper.find("#group-rate-numerator").children()).toHaveLength(3);
//     expect(wrapper.find("#group-rate-denominator").children()).toHaveLength(3);
//     // Select 2 for numerator
//     wrapper.find("#group-rate-numerator").simulate("change", { target: { value: 2 } });
//     // Now denominator has 0 and 5
//     expect(wrapper.find("#group-rate-denominator").children()).toHaveLength(2);
//   });
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
        screen.logTestingPlaygroundURL();
        fireEvent.change(screen.getByLabelText("Aggregation Type"), { target: { value: "GroupRate" } });
        expect(screen.getByLabelText("Numerator").children).toHaveLength(3);
        expect(screen.getByLabelText("Denominator").children).toHaveLength(3);
        fireEvent.change(screen.getByLabelText("Numerator"), { target: { value: "2" } });
        expect(screen.getByLabelText("Denominator").children).toHaveLength(2);
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
        fireEvent.change(screen.getByLabelText("Aggregation Type"), { target: { value: "PercentageChangeBetweenAandB" } });
        expect(screen.getByText(/calculation id/i)).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /calculation id/i })).toBeInTheDocument();
    });

    //  it("renders correct calculations for calculation A and calculation B drop-downs", () => {
    // const wrapper = mount(
    //   <CalculationItem
    //     node={cashCalc}
    //     calcs={allCalcs}
    //     isEditMode={true}
    //     updateNode={jest.fn()}
    //     openSideBar={jest.fn()}
    //     deleteNode={jest.fn()}
    //     cloneCalculation={jest.fn()}
    //     refreshNextId={jest.fn()}
    //     allowDelete={true}
    //   />
    // );
//     wrapper
//       .find("#calculation-aggregation-type")
//       .simulate("change", { target: { value: "PercentageChangeBetweenAandB" } });
//     // Initially calculationA and calculationB has values 0, 2, 3, 4 and 5
//     expect(wrapper.find("#percentage-change-calculation-a").children()).toHaveLength(5);
//     expect(wrapper.find("#percentage-change-calculation-b").children()).toHaveLength(5);
//     // Select 2 for calculationA
//     wrapper.find("#percentage-change-calculation-a").simulate("change", { target: { value: 2 } });
//     // Now calculationB has 0, 3, 4 and 5
//     expect(wrapper.find("#percentage-change-calculation-b").children()).toHaveLength(4);
//   });
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

// import { waitFor } from "@testing-library/react";
// import { mount } from "enzyme";
// import React from "react";

// import { CalculationItem } from "../../../components/TemplateBuilder/CalculationItem";
// import {
//   AggregrationType,
//   Calculation,
//   CalculationDictionaryItem,
//   CalculationType,
//   NodeType,
//   ValueFormatType,
// } from "../../../types/TemplateBuilderDefinitions";

// const cashCalc: Calculation = {
//   id: "n1",
//   name: "My Calc1",
//   templateCalculationId: 1,
//   kind: NodeType.Calculation,
//   type: CalculationType.Cash,
//   aggregationType: AggregrationType.None,
//   formulaText: "123",
//   valueFormat: ValueFormatType.Currency,
// };

// const pupilNumberCalc: Calculation = {
//   id: "a1",
//   name: "Adjustment Calc",
//   templateCalculationId: 1,
//   kind: NodeType.Calculation,
//   type: CalculationType.PupilNumber,
//   aggregationType: AggregrationType.None,
//   formulaText: "123",
//   valueFormat: ValueFormatType.Number,
// };

// const allCalcs: CalculationDictionaryItem[] = [
//   { id: "n1", templateCalculationId: 1, name: "My Calc 1", aggregationType: AggregrationType.None },
//   { id: "n2", templateCalculationId: 2, name: "My Calc 2", aggregationType: AggregrationType.Sum },
//   { id: "n3", templateCalculationId: 3, name: "My Calc 3", aggregationType: AggregrationType.None },
//   { id: "n4", templateCalculationId: 4, name: "My Calc 4", aggregationType: AggregrationType.Average },
//   { id: "n5", templateCalculationId: 5, name: "My Calc 5", aggregationType: AggregrationType.Sum },
// ];

// describe("<CalculationItem />", () => {
//   it("renders aggregationType of None and valueFormat of String when type Enum selected", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     expect(wrapper.find("#calculation-allowed-enum-values")).toHaveLength(0);

//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Enum" } });

//     expect(wrapper.find("#calculation-aggregation-type").props().value).toBe("None");
//     expect(wrapper.find("#calculation-aggregation-type").children().length).toBe(1);
//     expect(wrapper.find("#calculation-value-format").props().value).toBe("String");
//     expect(wrapper.find("#calculation-value-format").children().length).toBe(1);
//     expect(wrapper.find("#add-tag")).toHaveLength(1);
//   });

//   it("renders allowedEnumTypeValues field when type Enum selected", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     expect(wrapper.find("#add-tag")).toHaveLength(0);

//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Enum" } });

//     expect(wrapper.find("#add-tag")).toHaveLength(1);
//   });

//   it("shows error when click save and allowedEnumTypeValues field is empty", async () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Enum" } });
//     wrapper.find("#save-button").simulate("click");

//     await waitFor(() => {
//       expect(wrapper.find(".govuk-error-message")).toHaveLength(1);
//     });
//   });

//   it("shows error when allowedEnumTypeValues field contains non-unique options", async () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Enum" } });
//     wrapper.find("#add-tag").simulate("change", { target: { value: "Option1" } });
//     wrapper.find("[data-testid='add-tag-button']").simulate("click");
//     wrapper.find("#add-tag").simulate("change", { target: { value: "Option1" } });
//     wrapper.find("[data-testid='add-tag-button']").simulate("click");

//     await waitFor(() => {
//       expect(wrapper.find(".govuk-error-message")).toHaveLength(1);
//     });
//   });

//   it("does not show error when allowedEnumTypeValues field contains valid options", async () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Enum" } });
//     wrapper.find("#add-tag").simulate("change", { target: { value: "Option1" } });
//     wrapper.find("[data-testid='add-tag-button']").simulate("click");
//     wrapper.find("#save-button").simulate("click");

//     await waitFor(() => {
//       expect(wrapper.find(".govuk-error-message")).toHaveLength(0);
//     });
//   });

//   it("renders valueFormat of Boolean when type Boolean selected", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Boolean" } });

//     expect(wrapper.find("#calculation-value-format").props().value).toBe("Boolean");
//     expect(wrapper.find("#calculation-value-format").children().length).toBe(1);
//   });

//   it("renders numerator and denominator fields when aggregationType is GroupRate", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     expect(wrapper.find("#group-rate-numerator")).toHaveLength(0);
//     expect(wrapper.find("#group-rate-denominator")).toHaveLength(0);

//     wrapper.find("#calculation-aggregation-type").simulate("change", { target: { value: "GroupRate" } });

//     expect(wrapper.find("#group-rate-numerator")).toHaveLength(1);
//     expect(wrapper.find("#group-rate-denominator")).toHaveLength(1);
//   });

//   it("renders correct calculations for numerator and denominator drop-downs", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-aggregation-type").simulate("change", { target: { value: "GroupRate" } });

//     // Initially numerator and denominator has values 0, 2 and 5
//     expect(wrapper.find("#group-rate-numerator").children()).toHaveLength(3);
//     expect(wrapper.find("#group-rate-denominator").children()).toHaveLength(3);

//     // Select 2 for numerator
//     wrapper.find("#group-rate-numerator").simulate("change", { target: { value: 2 } });

//     // Now denominator has 0 and 5
//     expect(wrapper.find("#group-rate-denominator").children()).toHaveLength(2);
//   });

//   it("renders calculationA and calculationB fields when aggregationType is PercentageChangeBetweenAandB", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     expect(wrapper.find("#percentage-change-calculation-a")).toHaveLength(0);
//     expect(wrapper.find("#percentage-change-calculation-b")).toHaveLength(0);

//     wrapper
//       .find("#calculation-aggregation-type")
//       .simulate("change", { target: { value: "PercentageChangeBetweenAandB" } });

//     expect(wrapper.find("#percentage-change-calculation-a")).toHaveLength(1);
//     expect(wrapper.find("#percentage-change-calculation-b")).toHaveLength(1);
//   });

//   it("renders correct calculations for calculation A and calculation B drop-downs", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     wrapper
//       .find("#calculation-aggregation-type")
//       .simulate("change", { target: { value: "PercentageChangeBetweenAandB" } });

//     // Initially calculationA and calculationB has values 0, 2, 3, 4 and 5
//     expect(wrapper.find("#percentage-change-calculation-a").children()).toHaveLength(5);
//     expect(wrapper.find("#percentage-change-calculation-b").children()).toHaveLength(5);

//     // Select 2 for calculationA
//     wrapper.find("#percentage-change-calculation-a").simulate("change", { target: { value: 2 } });

//     // Now calculationB has 0, 3, 4 and 5
//     expect(wrapper.find("#percentage-change-calculation-b").children()).toHaveLength(4);
//   });

//   it("shows error if editing template calculation id and already in use", async () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-id").simulate("change", { target: { value: "2" } });
//     wrapper.find("#save-button").simulate("click");

//     await waitFor(() => {
//       expect(wrapper.find(".govuk-error-message")).toHaveLength(1);
//     });
//   });

//   it("shows error if saving empty template calculation id", async () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-id").simulate("change", { target: { value: "" } });
//     wrapper.find("#save-button").simulate("click");

//     await waitFor(() => {
//       expect(wrapper.find(".govuk-error-message")).toHaveLength(1);
//     });
//   });

//   it("shows error if editing template calculation id and value is already taken", async () => {
//     const refreshNextIdMock = jest.fn();

//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={refreshNextIdMock}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-id").simulate("change", { target: { value: "2" } });
//     wrapper.find("#save-button").simulate("click");

//     await waitFor(() => {
//       expect(wrapper.find(".govuk-error-message")).toHaveLength(1);
//       expect(wrapper.find(".govuk-error-message").text()).toBe(
//         "Error: This calculation ID is already in use."
//       );
//     });
//   });

//   it("does not show error if editing template calculation id and value is valid", async () => {
//     const refreshNextIdMock = jest.fn();

//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={refreshNextIdMock}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-id").simulate("change", { target: { value: "99" } });
//     wrapper.find("#save-button").simulate("click");

//     await waitFor(() => {
//       expect(wrapper.find(".govuk-error-message")).toHaveLength(0);
//     });
//   });

//   it("renders delete button if allowDelete is true", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     expect(wrapper.find('[data-testid="delete-button"]')).toHaveLength(1);
//   });

//   it("does not render delete button if allowDelete is false", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={false}
//       />
//     );

//     expect(wrapper.find('[data-testid="delete-button"]')).toHaveLength(0);
//   });

//   it("renders valueFormat of String when type Enum selected", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Enum" } });

//     expect(wrapper.find("#calculation-value-format").props().value).toBe("String");
//     expect(wrapper.find("#calculation-value-format").children().length).toBe(1);
//   });

//   it("renders valueFormat of Currency when type Cash selected", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={pupilNumberCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Adjustment" } });

//     expect(wrapper.find("#calculation-value-format").props().value).toBe("Currency");
//     expect(wrapper.find("#calculation-value-format").children().length).toBe(1);
//   });

//   it("renders valueFormat of Currency when type Adjustment selected", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={pupilNumberCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Cash" } });

//     expect(wrapper.find("#calculation-value-format").props().value).toBe("Currency");
//     expect(wrapper.find("#calculation-value-format").children().length).toBe(1);
//   });

//   it("restricts valueFormats when type Rate selected", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Rate" } });

//     expect(wrapper.find("#calculation-value-format").props().value).toBeUndefined();
//     expect(wrapper.find("#calculation-value-format").children().length).toBe(3);
//     expect(wrapper.find("#calculation-value-format").childAt(0).text()).toBe("Please select");
//     expect(wrapper.find("#calculation-value-format").childAt(1).text()).toBe("Percentage");
//     expect(wrapper.find("#calculation-value-format").childAt(2).text()).toBe("Currency");
//   });

//   it("restricts valueFormats when type Number selected", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Number" } });
    
//     expect(wrapper.find("#calculation-value-format").children().length).toBe(3);
//     expect(wrapper.find("#calculation-value-format").childAt(0).text()).toBe("Please select");
//     expect(wrapper.find("#calculation-value-format").childAt(1).text()).toBe("Number");
//     expect(wrapper.find("#calculation-value-format").childAt(2).text()).toBe("Currency");
//   });

//   it("restricts valueFormats when type PupilNumber selected", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-type").simulate("change", { target: { value: "PupilNumber" } });

//     expect(wrapper.find("#calculation-value-format").props().value).toBe("Number");
//     expect(wrapper.find("#calculation-value-format").children().length).toBe(1);
//   });

//   it("restricts valueFormats when type Weighting selected", () => {
//     const wrapper = mount(
//       <CalculationItem
//         node={cashCalc}
//         calcs={allCalcs}
//         isEditMode={true}
//         updateNode={jest.fn()}
//         openSideBar={jest.fn()}
//         deleteNode={jest.fn()}
//         cloneCalculation={jest.fn()}
//         refreshNextId={jest.fn()}
//         allowDelete={true}
//       />
//     );

//     wrapper.find("#calculation-type").simulate("change", { target: { value: "Weighting" } });

//     expect(wrapper.find("#calculation-value-format").props().value).toBeUndefined();
//     expect(wrapper.find("#calculation-value-format").children().length).toBe(3);
//     expect(wrapper.find("#calculation-value-format").childAt(0).text()).toBe("Please select");
//     expect(wrapper.find("#calculation-value-format").childAt(1).text()).toBe("Number");
//     expect(wrapper.find("#calculation-value-format").childAt(2).text()).toBe("Percentage");
//   });
// });
