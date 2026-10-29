import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import React from "react";
import * as redux from "react-redux";
import { MemoryRouter } from "react-router-dom";

import { CreateTemplate } from "../../../pages/Templates/CreateTemplate";
import { FundingStreamPermissions } from "../../../types/FundingStreamPermissions";
import { buildPermissions } from "../../fakes/testFactories";

const fetchMock = new MockAdapter(axios);
const useSelectorSpy = jest.spyOn(redux, "useSelector");

const noPermissionsState: FundingStreamPermissions[] = [
  buildPermissions({ fundingStreamId: "DSG" }),
];

const enableTemplateActions: ((perms: FundingStreamPermissions) => void)[] = [
  (p) => (p.canCreateTemplates = true),
  (p) => (p.canEditTemplates = true),
  (p) => (p.canApproveTemplates = true),
];

const permissionsState: FundingStreamPermissions[] = [
  buildPermissions({
    fundingStreamId: "DSG",
    fundingStreamName: "Dedicated Schools Grant",
    setAllPermsEnabled: true,
    actions: enableTemplateActions,
  }),
  buildPermissions({
    fundingStreamId: "GAG",
    fundingStreamName: "Academies General Annual Grant",
    setAllPermsEnabled: true,
    actions: enableTemplateActions,
  }),
];

describe("CreateTemplate", () => {
  afterEach(() => {
    fetchMock.reset();
    jest.clearAllMocks();
  });

  describe("when user has no create permissions", () => {
    beforeEach(() => {
      useSelectorSpy.mockReturnValue(noPermissionsState);

      fetchMock.onGet("/api/templates/build/available-stream-periods").reply(200, [
        {
          fundingStream: {
            id: "DSG",
            name: "Dedicated Schools Grant",
          },
          fundingPeriods: [
            {
              id: "FY-1",
              name: "Financial Year 2021-22",
            },
          ],
        },
      ]);
    });

    it("renders permission warning", async () => {
      render(
        <MemoryRouter>
          <CreateTemplate />
        </MemoryRouter>
      );

      expect(
        await screen.findByTestId("permission-alert-message")
      ).toBeInTheDocument();
    });
  });

  describe("when user has create permissions", () => {
    beforeEach(() => {
      useSelectorSpy.mockReturnValue(permissionsState);

      fetchMock.onGet("/api/templates/build/available-stream-periods").reply(200, [
        {
          fundingStream: {
            id: "DSG",
            name: "Dedicated Schools Grant",
          },
          fundingPeriods: [
            {
              id: "FY-1",
              name: "Financial Year 2021-22",
            },
          ],
        },
        {
          fundingStream: {
            id: "GAG",
            name: "Academies General Annual Grant",
          },
          fundingPeriods: [
            {
              id: "FY-2",
              name: "Financial Year 2022-23",
            },
          ],
        },
      ]);
    });

    it("renders create template page", async () => {
      render(
        <MemoryRouter>
          <CreateTemplate />
        </MemoryRouter>
      );

      expect(
        await screen.findByRole("heading", { name: "Create a template" })
      ).toBeInTheDocument();

      expect(
        screen.getByText("Select a funding stream")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Select a funding period")
      ).toBeInTheDocument();
    });

    it("does not render permission warning", async () => {
      render(
        <MemoryRouter>
          <CreateTemplate />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.queryByTestId("permission-alert-message")
        ).not.toBeInTheDocument();
      });
    });

    it("renders description field with character count", async () => {
      render(
        <MemoryRouter>
          <CreateTemplate />
        </MemoryRouter>
      );

      expect(
        await screen.findByLabelText("Add a template description")
      ).toBeInTheDocument();

      expect(
        screen.getByText("You have 200 characters remaining")
      ).toBeInTheDocument();
    });

    it("renders save button", async () => {
      render(
        <MemoryRouter>
          <CreateTemplate />
        </MemoryRouter>
      );

      expect(await screen.findByTestId("save")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
    });
  });

  describe("when no funding streams exist", () => {
    beforeEach(() => {
      useSelectorSpy.mockReturnValue(permissionsState);

      fetchMock.onGet("/api/templates/build/available-stream-periods").reply(200, []);
    });

    it("renders error when no funding streams available", async () => {
      render(
        <MemoryRouter>
          <CreateTemplate />
        </MemoryRouter>
      );

      expect(
        await screen.findByText("There are no funding streams to display")
      ).toBeInTheDocument();
    });
  });

  describe("when funding streams exist but user has no permission for them", () => {
    beforeEach(() => {
      useSelectorSpy.mockReturnValue(permissionsState);

      fetchMock.onGet("/api/templates/build/available-stream-periods").reply(200, [
        {
          fundingStream: {
            id: "PSG",
            name: "PE & Sports Grant",
          },
          fundingPeriods: [
            {
              id: "FY-3",
              name: "Financial Year 2023-24",
            },
          ],
        },
      ]);
    });

    it("renders no available funding streams error", async () => {
      render(
        <MemoryRouter>
          <CreateTemplate />
        </MemoryRouter>
      );

      expect(
        await screen.findByText("There are no funding streams to display")
      ).toBeInTheDocument();
    });
  });
});