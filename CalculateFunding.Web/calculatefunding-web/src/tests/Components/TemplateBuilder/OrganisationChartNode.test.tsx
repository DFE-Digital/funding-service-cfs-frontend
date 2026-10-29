import React from "react";
import { render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import OrganisationChartNode from "../../../components/TemplateBuilder/OrganisationChartNode";
import NodeTemplate from "../../../components/TemplateBuilder/TemplateBuilderNode";
import { sendDragInfo } from "../../../services/templateBuilderService";
import {
  Calculation,
  FundingLine,
  FundingLineOrCalculation,
  FundingLineOrCalculationSelectedItem,
  FundingLineType,
  NodeType,
} from "../../../types/TemplateBuilderDefinitions";

jest.mock("../../../services/templateBuilderService", () => {
  const { Subject } = require("rxjs");
  const subject1 = new Subject();
  const subject2 = new Subject();
  return {
    sendDragInfo: jest.fn((id, kind) => subject1.next({ draggedNodeId: id, draggedNodeKind: kind })),
    clearDragInfo: jest.fn(() => subject1.next()),
    getDragInfo: jest.fn(() => subject1.asObservable()),
    sendSelectedNodeInfo: jest.fn((id) => subject2.next({ selectedNodeId: id })),
    clearSelectedNodeInfo: jest.fn(() => subject2.next()),
    getSelectedNodeInfo: jest.fn(() => subject2.asObservable()),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Renders non-cloned nodes correctly", () => {
  const data: FundingLine = {
    id: "n0",
    dsKey: 0,
    templateLineId: 0,
    kind: NodeType.FundingLine,
    type: FundingLineType.Information,
    name: "My Funding Line 0",
    fundingLineCode: "Code 0",
  };

  it("sends drag event info to component", () => {
    const { getByTestId } = render(
      <OrganisationChartNode
        id="n0"
        datasource={data}
        NodeTemplate={NodeTemplate}
        changeHierarchy={jest.fn()}
        cloneNode={jest.fn()}
        onClickNode={jest.fn()}
        addNode={jest.fn()}
        openSideBar={jest.fn()}
        isEditMode={true}
        nextId={1}
        dsKey={0}
        addNodeToRefs={jest.fn()}
        expandAllChildren={true}
        hasCloneParent={false}
      />
    );
    const node = getByTestId("node-n0");
    fireEvent.dragStart(node, { dataTransfer: { setData: jest.fn() } });
    expect(sendDragInfo).toHaveBeenCalledTimes(1);
    expect(sendDragInfo).toHaveBeenCalledWith("n0", "FundingLine");
  });

  it("does not collapse a non-cloned node on initial render", () => {
    const { container } = render(
      <OrganisationChartNode
        id="n0"
        datasource={data}
        NodeTemplate={NodeTemplate}
        changeHierarchy={jest.fn()}
        cloneNode={jest.fn()}
        onClickNode={jest.fn()}
        addNode={jest.fn()}
        openSideBar={jest.fn()}
        isEditMode={true}
        nextId={1}
        dsKey={0}
        addNodeToRefs={jest.fn()}
        expandAllChildren={true}
        hasCloneParent={false}
      />
    );
    expect(container.querySelector(".isChildrenCollapsed")).toBeNull();
  });

  it("does collapse a non-cloned node on initial render if expandAllChildren is false", () => {
    const { container } = render(
      <OrganisationChartNode
        id="n0"
        datasource={data}
        NodeTemplate={NodeTemplate}
        changeHierarchy={jest.fn()}
        cloneNode={jest.fn()}
        onClickNode={jest.fn()}
        addNode={jest.fn()}
        openSideBar={jest.fn()}
        isEditMode={true}
        nextId={1}
        dsKey={0}
        addNodeToRefs={jest.fn()}
        expandAllChildren={false}
        hasCloneParent={false}
      />
    );
    expect(container.querySelector(".isChildrenCollapsed")).not.toBeNull();
  });
});

describe("Renders cloned nodes correctly", () => {
  const data: FundingLine = {
    id: "n0:12345",
    dsKey: 0,
    templateLineId: 0,
    kind: NodeType.FundingLine,
    type: FundingLineType.Information,
    name: "My Funding Line 0",
    fundingLineCode: "Code 0",
  };

  it("collapses a root cloned node on initial render even if expandAllChildren is true", () => {
    const { container } = render(
      <OrganisationChartNode
        id="n0:12345"
        datasource={data}
        NodeTemplate={NodeTemplate}
        changeHierarchy={jest.fn()}
        cloneNode={jest.fn()}
        onClickNode={jest.fn()}
        addNode={jest.fn()}
        openSideBar={jest.fn()}
        isEditMode={true}
        nextId={1}
        dsKey={0}
        addNodeToRefs={jest.fn()}
        expandAllChildren={true}
        hasCloneParent={false}
      />
    );
    expect(container.querySelector(".isChildrenCollapsed")).not.toBeNull();
  });

  it("collapses a root node on initial render if expandAllChildren is false", () => {
    const { container } = render(
      <OrganisationChartNode
        id="n0:12345"
        datasource={data}
        NodeTemplate={NodeTemplate}
        changeHierarchy={jest.fn()}
        cloneNode={jest.fn()}
        onClickNode={jest.fn()}
        addNode={jest.fn()}
        openSideBar={jest.fn()}
        isEditMode={true}
        nextId={1}
        dsKey={0}
        addNodeToRefs={jest.fn()}
        expandAllChildren={false}
        hasCloneParent={false}
      />
    );
    expect(container.querySelector(".isChildrenCollapsed")).not.toBeNull();
  });

  it("expands a clone node if parent is a clone and expandAllChildren is true", () => {
    const { container } = render(
      <OrganisationChartNode
        id="n0:12345"
        datasource={data}
        NodeTemplate={NodeTemplate}
        changeHierarchy={jest.fn()}
        cloneNode={jest.fn()}
        onClickNode={jest.fn()}
        addNode={jest.fn()}
        openSideBar={jest.fn()}
        isEditMode={true}
        nextId={1}
        dsKey={0}
        addNodeToRefs={jest.fn()}
        expandAllChildren={true}
        hasCloneParent={true}
      />
    );
    expect(container.querySelector(".isChildrenCollapsed")).toBeNull();
  });

  it("collapses a clone node if parent is a clone and expandAllChildren is false", () => {
    const { container } = render(
      <OrganisationChartNode
        id="n0:12345"
        datasource={data}
        NodeTemplate={NodeTemplate}
        changeHierarchy={jest.fn()}
        cloneNode={jest.fn()}
        onClickNode={jest.fn()}
        addNode={jest.fn()}
        openSideBar={jest.fn()}
        isEditMode={true}
        nextId={1}
        dsKey={0}
        addNodeToRefs={jest.fn()}
        expandAllChildren={false}
        hasCloneParent={true}
      />
    );
    expect(container.querySelector(".isChildrenCollapsed")).not.toBeNull();
  });
});
