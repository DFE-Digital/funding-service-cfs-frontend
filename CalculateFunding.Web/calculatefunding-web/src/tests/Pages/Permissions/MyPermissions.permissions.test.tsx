import { screen, within, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { buildPermissions } from "../../fakes/testFactories";
import * as MyPermissionsTests from "./MyPermissions.shared";

describe("when permissions defined and user has one permission enabled", () => {
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

  it("renders funding stream selections", async () => {
    const combobox = await screen.findByRole("combobox");
    expect(within(combobox).getByRole("option", { name: /Direct School Grant/ })).toBeInTheDocument();

    // Use act to wrap state-changing event
    await act(async () => {
      userEvent.selectOptions(combobox, "DSG");
    });

    expect(
        screen.getByRole("button", { name: /Continue/i })
      ).toBeInTheDocument();

    // Wait for the heading to appear after the selection change
    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /View your permissions/,
        })
      ).toBeInTheDocument();
    });
  });
});

//  it("admin username is not rendered", async () => {
//       const { getAdminUsersForFundingStream } = require("../../../services/userService");
//       const combobox = screen.getByRole("combobox", { name: /Select funding stream/i });
//       expect(within(combobox).getByRole("option", { name: /Direct School Grant/ })).toBeInTheDocument();

//       userEvent.selectOptions(combobox, "DSG");

//       expect(getAdminUsersForFundingStream).toBeCalled();

//       await waitFor(() => expect(screen.queryByText("Admin User")).not.toBeInTheDocument());
//     });