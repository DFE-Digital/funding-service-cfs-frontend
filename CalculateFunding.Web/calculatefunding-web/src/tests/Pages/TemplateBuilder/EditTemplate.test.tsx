import "@testing-library/jest-dom";
import { fireEvent, render, waitFor, screen, act } from "@testing-library/react";
import React from "react";
import * as redux from "react-redux";
import { MemoryRouter } from "react-router";

import { ConfirmationModal } from "../../../components/ConfirmationModal";
import * as hooks from "../../../hooks/TemplateBuilder/useTemplateUndo";
import { FundingStreamPermissions } from "../../../types/FundingStreamPermissions";
import { TemplateResponse } from "../../../types/TemplateBuilderDefinitions";
import { buildPermissions } from "../../fakes/testFactories";

jest.useFakeTimers();

const useSelectorSpy = jest.spyOn(redux, "useSelector");

jest.spyOn(hooks, "useTemplateUndo").mockImplementation(() => ({
  initialiseState: jest.fn(),
  updatePresentState: jest.fn(),
  undo: jest.fn(),
  redo: jest.fn(),
  clearPresentState: jest.fn(),
  clearUndoState: jest.fn(),
  clearRedoState: jest.fn(),
  undoCount: jest.fn(),
  redoCount: jest.fn(),
}));

const noPermissionsState: FundingStreamPermissions[] = [buildPermissions({ fundingStreamId: "DSG" })];

const permissionsState: FundingStreamPermissions[] = [
  buildPermissions({ fundingStreamId: "DSG", setAllPermsEnabled: true }),
];

const mockTemplate: TemplateResponse = {
  templateId: "12352346",
  name: "template name",
  description: "lorem ipsum",
  fundingStreamId: "DSG",
  fundingStreamName: "DSG",
  fundingPeriodId: "2021",
  fundingPeriodName: "2021",
  majorVersion: 0,
  minorVersion: 2,
  version: 2,
  isCurrentVersion: true,
  status: "Draft",
  schemaVersion: "1.1",
  templateJson: "{}",
  authorId: "",
  authorName: "",
  lastModificationDate: new Date(),
  comments: "",
};

const renderEditTemplatePage = async () => {
  const { EditTemplate } = require("../../../pages/Templates/EditTemplate");
  await waitFor(() => {
    render(
      <MemoryRouter
        getUserConfirmation={(message, callback) => {
          ConfirmationModal(message, callback);
        }}
      >
        <EditTemplate />
      </MemoryRouter>
    );
  });
};

beforeAll(() => {
  function mockFunctions(mockData: TemplateResponse) {
    const originalService = jest.requireActual("../../../services/templateBuilderDatasourceService");
    return {
      ...originalService,
      getTemplateById: jest.fn(() =>
        Promise.resolve({
          data: mockData,
        })
      ),
    };
  }

  jest.mock("../../../services/templateBuilderDatasourceService", () => mockFunctions(mockTemplate));
});

describe("EditTemplate Page tests", () => {
  describe("Template Builder when I have no permissions ", () => {
    beforeEach(() => {
      useSelectorSpy.mockClear();
      useSelectorSpy.mockReturnValue(noPermissionsState);
    });

    it("fetches template data getTemplateById", async () => {
      const { getTemplateById } = require("../../../services/templateBuilderDatasourceService");
      await renderEditTemplatePage();
      await waitFor(() => expect(getTemplateById).toBeCalled());
    });

    it("renders a permission status warning", async () => {
      await renderEditTemplatePage();
      await waitFor(() => {
        expect(screen.getByTestId("permission-alert-message")).toBeInTheDocument();
      });
    });

    it("does not render a publish button", async () => {
      await renderEditTemplatePage();
      await waitFor(() => {
        expect(screen.queryByTestId("publish-button")).toBeNull();
      });
    });

    it("does not render Add Funding Line button", async () => {
      await renderEditTemplatePage();
      await waitFor(() => {
        expect(screen.queryByTestId("add-funding-line")).toBeNull();
      });
    });
  });

  describe("Template Builder when I request current version and have edit permissions ", () => {
    beforeEach(() => {
      useSelectorSpy.mockClear();
      useSelectorSpy.mockReturnValue(permissionsState);
    });

    it("fetches template data getTemplateById", async () => {
      const { getTemplateById } = require("../../../services/templateBuilderDatasourceService");
      await renderEditTemplatePage();
      await waitFor(() => expect(getTemplateById).toBeCalled());
    });

    it("does render a save button", async () => {
      await renderEditTemplatePage();
      await waitFor(() => {
        expect(screen.getByTestId("save-button")).toBeInTheDocument();
      });
    });

    it("does not render a permission status warning", async () => {
      await renderEditTemplatePage();
      await waitFor(() => {
        expect(document.querySelector("#permission-alert-message")).not.toBeInTheDocument();
      });
    });

    it("funding line displays add buttons", async () => {
      await renderEditTemplatePage();
      await waitFor(() => {
        expect(screen.getByTestId("add-funding-line")).toBeInTheDocument();
      });

      act(() => {
        fireEvent.click(screen.getByTestId("add-funding-line"));
      });

      await waitFor(() => {
        expect(screen.getByTestId("n0-add-line")).toBeInTheDocument();
        expect(screen.getByTestId("n0-add-calc")).toBeInTheDocument();
      });
    });

    it("adds new funding line to page when button clicked", async () => {
      await renderEditTemplatePage();
      await waitFor(() => {
        expect(screen.getByTestId("add-funding-line")).toBeInTheDocument();
      });

      act(() => {
        fireEvent.click(screen.getByTestId("add-funding-line"));
      });

      await waitFor(() => {
        expect(screen.getByTestId("node-n0")).toBeInTheDocument();
      });
    });

    it("displays edit funding line sidebar when clicking on funding line", async () => {
      await renderEditTemplatePage();
      await waitFor(() => {
        expect(screen.getByTestId("add-funding-line")).toBeInTheDocument();
      });
      act(() => {
        fireEvent.click(screen.getByTestId("add-funding-line"));
      });
      await waitFor(() => {
        expect(screen.getByTestId("node-n0")).toBeInTheDocument();
      });

      // click on funding line
      act(() => {
        fireEvent.click(screen.getByTestId("node-n0"));
      });

      await waitFor(() => {
        expect(screen.getByTestId("sidebar-fundingline")).toBeInTheDocument();
      });
    });

    it("displays confirmation when deleting a funding line", async () => {
      await renderEditTemplatePage();
      await waitFor(() => {
        expect(screen.getByTestId("add-funding-line")).toBeInTheDocument();
      });
      act(() => {
        fireEvent.click(screen.getByTestId("add-funding-line"));
      });
      await waitFor(() => {
        expect(screen.getByTestId("node-n0")).toBeInTheDocument();
      });
      act(() => {
        fireEvent.click(screen.getByTestId("node-n0"));
      });
      await waitFor(() => {
        expect(screen.getByTestId("node-n0-delete")).toBeInTheDocument();
      });

      // delete the node
      act(() => {
        fireEvent.click(screen.getByTestId("node-n0-delete"));
      });

      // await waitFor(() => {
      //   expect(getByTestId("node-n0-confirm-delete")).toBeInTheDocument();
      // });

      await waitFor(() => {
        expect(screen.getByTestId("node-n0-confirm-delete")).toBeInTheDocument();
      });
    });

    it("renders a publish button", async () => {
      const { EditTemplate } = require("../../../pages/Templates/EditTemplate");
      await waitFor(() => {
        render(
          <MemoryRouter>
            <EditTemplate />
          </MemoryRouter>
        );
      });
      await waitFor(() => {
        expect(screen.getByTestId("publish-button")).toBeInTheDocument();
      });
    });

    it("renders an export button", async () => {
      await renderEditTemplatePage();
      await waitFor(() => {
        expect(screen.getByTestId("export-button")).toBeInTheDocument();
        expect(screen.getByTestId("export-button")).toHaveAttribute(
          "href",
          expect.stringContaining(
            "/api/templates/build/" + mockTemplate.templateId + "/export?version=" + mockTemplate.version
         

          )
        );
      });
    });
  });
});
