import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import * as redux from "react-redux";
import { Route, Switch } from "react-router";
import { MemoryRouter } from "react-router-dom";

import { FundingStreamPermissions } from "../../../types/FundingStreamPermissions";
import { TemplateResponse } from "../../../types/TemplateBuilderDefinitions";
import { buildPermissions } from "../../fakes/testFactories";
import userEvent from "@testing-library/user-event";

const fetchMock = new MockAdapter(axios);
const useSelectorSpy = jest.spyOn(redux, "useSelector");

const noPermissionsState: FundingStreamPermissions[] = [
  buildPermissions({ fundingStreamId: "MPG", setAllPermsEnabled: false }),
];
const permissionsState: FundingStreamPermissions[] = [
  buildPermissions({
    fundingStreamId: "MPG",
    actions: [
      (p) => (p.canCreateTemplates = true),
      (p) => (p.canEditTemplates = true),
      (p) => (p.canApproveTemplates = true),
    ],
  }),
];

const mockTemplateToCloneFrom: TemplateResponse = {
  templateId: "12352346",
  name: "template name",
  description: "lorem ipsum",
  fundingStreamId: "MPG",
  fundingStreamName: "Magic Potions Grant",
  fundingPeriodId: "2021",
  fundingPeriodName: "Period 2021",
  majorVersion: 3,
  minorVersion: 2,
  version: 12,
  isCurrentVersion: true,
  status: "Draft",
  schemaVersion: "1.1",
  templateJson: "{}",
  authorId: "",
  authorName: "",
  lastModificationDate: new Date(),
  comments: "",
};

beforeAll(() => {
  function mockFunctions(mockData: TemplateResponse) {
    const originalService = jest.requireActual("../../../services/templateBuilderDatasourceService");
    return {
      ...originalService,
      getTemplateVersion: jest.fn(() =>
        Promise.resolve({
          data: mockData,
          status: 200,
        })
      ),
    };
  }

  jest.mock("../../../services/templateBuilderDatasourceService", () =>
    mockFunctions(mockTemplateToCloneFrom)
  );
});

afterAll(() => {
  jest.clearAllMocks();
  fetchMock.reset();
});

const renderCloneTemplatePage = () => {
  const { CloneTemplate } = require("../../../pages/Templates/CloneTemplate");
  return render(
    <MemoryRouter
      initialEntries={[
        `/Templates/${mockTemplateToCloneFrom.templateId}/Clone/${mockTemplateToCloneFrom.version}`,
      ]}
    >
      <Switch>
        <Route path="/Templates/:templateId/Clone/:version" component={CloneTemplate} />
      </Switch>
    </MemoryRouter>
  );
};

describe("Clone Template page when I have no create permissions ", () => {
  beforeEach(() => {
    useSelectorSpy.mockClear();
    useSelectorSpy.mockReturnValue(noPermissionsState);
  });

  it("renders a permission status warning", async () => {
    renderCloneTemplatePage();
    await waitFor(() => expect(screen.getByTestId("permission-alert-message")).toBeInTheDocument());
  });
});

describe("Clone Template page when I have create permissions ", () => {
  beforeEach(() => {
    useSelectorSpy.mockClear();
    useSelectorSpy.mockReturnValue(permissionsState);

    fetchMock.onGet("/api/templates/build/available-stream-periods").reply(200, [
      {
        fundingStream: {
          id: "MPG",
          name: "Magic Potions Grant",
        },
        fundingPeriods: [
          {
            id: "MPG-2021",
            name: "Period 2021",
          },
        ],
      },
    ]);
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it("does not render a permission status warning", async () => {
    renderCloneTemplatePage();
    await waitFor(() => {
      expect(
        screen.queryByText("You do not have permissions to perform the following actions")
      ).not.toBeInTheDocument();
    });
  });

  it("does not render any errors", async () => {
    renderCloneTemplatePage();
    await waitFor(() => {
      expect(screen.queryByText("There is a problem")).not.toBeInTheDocument();
    });
  });

  it("does render funding period drop down list with correct options", async () => {
    renderCloneTemplatePage();
    await waitFor(() => {
      expect(screen.queryByText("Select a funding stream")).not.toBeInTheDocument();
      expect(screen.getByText("Select a funding period")).toBeInTheDocument();
      const autocompleteInput = screen.getByTestId("fundingPeriodId");
      expect(autocompleteInput).toBeInTheDocument();
      userEvent.click(autocompleteInput);
      const options = screen.getAllByRole("option");
      expect(options[0]).toHaveTextContent("Period 2021");
    });
  });
});

describe("Clone Template page when no funding streams exist", () => {
  beforeEach(() => {
    useSelectorSpy.mockClear();
    useSelectorSpy.mockReturnValue(permissionsState);
    fetchMock.onGet("/api/templates/build/available-stream-periods").reply(200, []);
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it("renders an error message", async () => {
    renderCloneTemplatePage();
    await waitFor(() => {
      expect(screen.getByText("There is a problem")).toBeInTheDocument();
      expect(screen.queryByTestId("fundingStreamId")).not.toBeInTheDocument();
      expect(screen.queryByTestId("fundingPeriodId")).not.toBeInTheDocument();
      expect(document.querySelector("option")).not.toBeInTheDocument();
    });
  });
});

describe("Clone Template page when a funding stream exists but I don't have permissions for it", () => {
  beforeEach(() => {
    useSelectorSpy.mockClear();
    useSelectorSpy.mockReturnValue(permissionsState);
    fetchMock.onGet("/api/templates/build/available-stream-periods").reply(200, [
      {
        fundingStream: {
          id: "DAG",
          name: "Dark Arts Grant",
        },
        fundingPeriods: [
          {
            id: "DAG-2021",
            name: "Period 2021",
          },
        ],
      },
    ]);
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it("renders an error message", async () => {
    renderCloneTemplatePage();
    await waitFor(() => {
      expect(screen.getByText("There is a problem")).toBeInTheDocument();
      expect(screen.queryByTestId("fundingStreamId")).not.toBeInTheDocument();
      expect(screen.queryByTestId("fundingPeriodId")).not.toBeInTheDocument();
      expect(document.querySelector("option")).not.toBeInTheDocument();
    });
  });
});

describe("Character limit and Counter of the description textarea", () => {
it("renders description textarea with 200 character limit", async () => {
  renderCloneTemplatePage();

  const textarea = await screen.findByRole("textbox");
  expect(textarea).toHaveAttribute("maxLength", "200");
  expect(screen.getByText("You have 200 characters remaining")).toBeInTheDocument();
});

it("updates remaining character count as user types", async () => {
  renderCloneTemplatePage();

  const textarea = await screen.findByRole("textbox");
  userEvent.type(textarea, "hello");

  await waitFor(() => {
    expect(screen.getByText("You have 195 characters remaining")).toBeInTheDocument();
  });
});

it("does not allow more than 200 characters in the description", async () => {
  renderCloneTemplatePage();

  const textarea = (await screen.findByRole("textbox")) as HTMLTextAreaElement;
  const longText = "a".repeat(250);

  userEvent.type(textarea, longText);

  await waitFor(() => {
    expect(textarea.value.length).toBe(200);
    expect(screen.getByText("You have 0 characters remaining")).toBeInTheDocument();
  });
});
});
