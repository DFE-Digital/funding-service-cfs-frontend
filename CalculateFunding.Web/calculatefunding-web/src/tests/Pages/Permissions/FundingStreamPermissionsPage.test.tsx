import React from "react";
import * as redux from "react-redux";
import { MemoryRouter, Route, Switch } from "react-router";
import { screen, within, waitFor, act, render } from "@testing-library/react";
import { buildPermissions } from "tests/fakes/testFactories";

const hasAdminUser = () => {
  jest.mock("../../../services/userService", () => {
    const service = jest.requireActual("../../../services/userService");
    return {
      ...service,
      getAdminUsersForFundingStream: jest.fn(() =>
        Promise.resolve({
          status: 200,
          data: [
            {
              username: "Admin User",
              hasConfirmedSkills: false,
            },
          ],
        })
      ),
    };
  });
};
const hasNoAdminUsers = () => {
  jest.mock("../../../services/userService", () => {
    const service = jest.requireActual("../../../services/userService");
    return {
      ...service,
      getAdminUsersForFundingStream: jest.fn(() =>
        Promise.resolve({
          status: 200,
          data: [],
        })
      ),
    };
  });
};

const renderPage = () => {
  const { FundingStreamPermissionsPage } = require("../../../pages/Permissions/FundingStreamPermissionsPage");
  return render(
    <MemoryRouter initialEntries={["/permissions/MyPermissions/DSG/admin"]}>
      <Switch>
        <Route
          path="/permissions/MyPermissions/DSG/admin"
          component={FundingStreamPermissionsPage}
        />
      </Switch>
    </MemoryRouter>
  );
};

describe("when permissions defined and user has one permission enabled", () => {
  beforeEach(() => {
    hasAdminUser();
    const permissions = [
      buildPermissions({
        fundingStreamId: "DSG",
        fundingStreamName: "Direct School Grant",
        userId: "mockUser",
        setAllPermsEnabled: false,
        actions: [(p) => (p.canCreateSpecification = true)],
      }),
    ];
    useSelectorSpy.mockReturnValue(permissions);
    renderPage();
  });

  afterAll(() => {
    useSelectorSpy.mockClear();
  });

  it("renders permission table", async () => {

  expect(
        screen.getByRole("heading", { name: /View your permissions/i })
      ).toBeInTheDocument();

  expect(
        screen.getByRole("heading", { name: /Calculations/i })
      ).toBeInTheDocument();

  });

  it("renders permission radio options", async () => {
      
    // Now we locate the row and check the permissions
    const rowHeader = screen.getByRole("rowheader", {
      name: /Approve any calculations at once/i,
    });

    const row = rowHeader.closest("tr") as HTMLTableRowElement;
    
    // Ensure the correct cell for "Yes" is present
    expect(within(row).getByRole("cell")).toBeInTheDocument();

    const cells = screen.queryAllByRole("cell");
    expect(cells).toHaveLength(23);  // Assert there are all 23 permission cells

  });

   it("renders Change funding strean button", async () => {
  expect(
        screen.getByRole("button", { name: /Change funding stream/i })
      ).toBeInTheDocument();
  });
});

const useSelectorSpy = jest.spyOn(redux, "useSelector");

export { renderPage, hasAdminUser, hasNoAdminUsers, useSelectorSpy };
