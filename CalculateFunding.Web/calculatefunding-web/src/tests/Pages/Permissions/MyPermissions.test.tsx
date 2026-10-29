import { screen, waitFor, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PermissionsCategories } from "../../../types/Permission";
import { buildPermissions } from "../../fakes/testFactories";
import * as MyPermissionsTests from "./MyPermissions.shared";

describe("<MyPermissions/>", () => {
  describe("given there is an admin user for the selected funding stream", () => {
    beforeEach(() => {
      MyPermissionsTests.hasAdminUser();
      const permissions = [
        buildPermissions({
          fundingStreamId: "DSG",
          fundingStreamName: "Direct School Grant",
          setAllPermsEnabled: false,
          actions: [(p) => (p.canCreateSpecification = true)],
        }),
      ];
      MyPermissionsTests.useSelectorSpy.mockReturnValue(permissions);
      MyPermissionsTests.renderPage();
    });

    afterAll(() => {
      MyPermissionsTests.useSelectorSpy.mockClear();
    });

  });

  describe("given there is no admin user for the selected funding stream", () => {
    beforeEach(() => {
      MyPermissionsTests.hasNoAdminUsers();
      const permissions = [
        buildPermissions({
          fundingStreamId: "DSG",
          fundingStreamName: "Direct School Grant",
          setAllPermsEnabled: false,
          actions: [(p) => (p.canCreateSpecification = true)],
        }),
      ];
      MyPermissionsTests.useSelectorSpy.mockReturnValue(permissions);
      MyPermissionsTests.renderPage();
    });

    afterAll(() => {
      MyPermissionsTests.useSelectorSpy.mockClear();
    });
    });
  });

  describe("when no permissions defined at all", () => {
    beforeEach(() => {
      MyPermissionsTests.useSelectorSpy.mockReturnValue([]);
      MyPermissionsTests.renderPage();
    });

    afterAll(() => {
      MyPermissionsTests.useSelectorSpy.mockClear();
    });

    it("renders default warning", async () => {
      await waitFor(() => {
        expect(screen.getByText(/You have read only access for all funding streams/)).toBeInTheDocument();
      });
    });
  });

  describe("when permissions defined but all disabled", () => {
    beforeEach(() => {
      const permissions = [
        buildPermissions({
          fundingStreamId: "DSG",
          fundingStreamName: "Direct School Grant",
          setAllPermsEnabled: false,
        }),
      ];
      MyPermissionsTests.useSelectorSpy.mockReturnValue(permissions);
      MyPermissionsTests.renderPage();
    });

    afterAll(() => {
      MyPermissionsTests.useSelectorSpy.mockClear();
    });

    it("does not render default warning", async () => {
      await waitFor(() => {
        expect(screen.queryByText(/You have read only access for all funding streams/)).not.toBeInTheDocument();
      });
    });

    it("renders funding stream selections correctly", async () => {
      const combobox = screen.getByRole("combobox");
      expect(within(combobox).getByRole("option", { name: /Direct School Grant/ })).toBeInTheDocument();

      await act(async () => {
        userEvent.selectOptions(combobox, "DSG");
      });

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /Continue/i })
        ).toBeInTheDocument();
      });

      expect(
        screen.getByRole("heading", {
          name: /View your permissions/,
        })
      ).toBeInTheDocument();
    });
  });

