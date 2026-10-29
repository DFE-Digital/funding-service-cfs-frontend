import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import * as redux from "react-redux";
import { MemoryRouter, Route, Switch } from "react-router";

import { Permission } from "../../../types/Permission";
import { UserSearchResult, UserSearchResultItem } from "../../../types/Users/UserSearchResult";
import { FundingStream } from "../../../types/viewFundingTypes";
import { buildPermissions } from "../../fakes/testFactories";
import { QueryClientProviderTestWrapper } from "../../Hooks/QueryClientProviderTestWrapper";

describe("<IndividualPermissionsAdmin/>", () => {
  describe("given I am an admin user for a funding stream ", () => {
    beforeEach(() => {
      mockUserService();
      const permissions = [
        buildPermissions({
          fundingStreamId: mockFundingStream.id,
          fundingStreamName: mockFundingStream.name,
          setAllPermsEnabled: false,
          actions: [(p) => (p.canAdministerFundingStream = true)],
        }),
      ];
      useSelectorSpy.mockReturnValue(permissions);
      jest.unmock("../../../components/TopHeader");

      renderPage();
    });

    afterAll(() => {
      useSelectorSpy.mockClear();
    });

    it("does not render default warning", async () => {
      expect(screen.queryByText(/You don't have any admin permissions/)).not.toBeInTheDocument();
    });

    it("renders page title", async () => {
      const title = await screen.getByText("View and change a user’s permissions");
      expect(title).toBeInTheDocument();
    });

    describe("when I select a user", () => {
      beforeEach(() => {
        const userSearchbox = screen.getByTestId("input-auto-complete");

        userEvent.type(userSearchbox, mockUser.name);
        fireEvent.change(userSearchbox, { target: { value: mockUser.name } });
        fireEvent.click(screen.getByTestId(mockUser.name), { target: { innerText: mockUser.name } });
      });

      it("calls api to find users", async () => {
        const { findUsers } = require("../../../services/userService");
        expect(findUsers).toBeCalled();
      });

      describe("and when I select a funding stream and click Continue", () => {
        beforeEach(async () => {
          const combobox = screen.getByRole("heading");
          userEvent.selectOptions(combobox, mockFundingStream.name);
          const button = screen.getByRole("button", { name: /Go to permissions/ });
          expect(button).toBeEnabled();

          await waitFor(() => userEvent.click(button));
        });

        xit("calls api to find the selected user's permissions for selected funding stream", async () => {
          const { getOtherUsersPermissionsForFundingStream } = require("../../../services/userService");

          expect(getOtherUsersPermissionsForFundingStream).toBeCalled();
        });

        xit("renders different page title", async () => {
          expect(screen.queryByTestId("page-title")).not.toBeInTheDocument();
          expect(
            await screen.findByRole("heading", { name: /- funding stream/ })
          ).toBeInTheDocument();
        });

        xit("renders new description text", async () => {
          expect(
            await screen.findByText(/Administration/)
          ).toBeInTheDocument();
        });

        xit("renders the save button", async () => {
          const button = screen.getByRole("button", { name: /Save permissions/ });
          expect(button).toBeEnabled();
        });

        xit("renders the remove button", async () => {
          const button = screen.getByRole("button", { name: /Clear/ });
          expect(button).toBeEnabled();
        });

        xit("renders the user's permissions correctly", async () => {
          const allCheckboxes = screen.getAllByRole("checkbox");
          allCheckboxes.forEach((checkbox) => {
            if (checkbox.title === Permission.CanCreateTemplates.toString()) expect(checkbox).toBeChecked();
            else expect(checkbox).not.toBeChecked();
          });
        });

        describe("and when I change permissions and click to save it", () => {
          beforeEach(async () => {
            const checkbox1 = screen.getByRole("checkbox", {
              name: Permission.CanCreateTemplates.toString(),
            });
            expect(checkbox1).toBeInTheDocument();
            expect(checkbox1).toBeChecked();
            userEvent.click(checkbox1);
            expect(checkbox1).not.toBeChecked();

            const checkbox2 = screen.getByRole("checkbox", { name: Permission.CanMapDatasets.toString() });
            expect(checkbox2).toBeInTheDocument();
            expect(checkbox2).not.toBeChecked();
            userEvent.click(checkbox2);
            expect(checkbox2).toBeChecked();

            const button = screen.getByRole("button", { name: /Save permissions/ });
            expect(button).toBeEnabled();

            await waitFor(() => userEvent.click(button));
          });

          xit("calls the api correctly to save the updated permissions and displays notification", async () => {
            const { updateOtherUsersPermissionsForFundingStream } = require("../../../services/userService");

            const expectedUpdate = buildPermissions({
              fundingStreamId: mockFundingStream.id,
              fundingStreamName: mockFundingStream.name,
              userId: mockUser.id,
              setAllPermsEnabled: false,
              actions: [(p) => (p.canMapDatasets = true)],
            });
            expect(updateOtherUsersPermissionsForFundingStream).toBeCalledWith(expectedUpdate);

            const banner = await screen.findByTestId("notification-banner");
            expect(banner).toBeInTheDocument();
            expect(within(banner).getByText(/Success/)).toBeInTheDocument();
            expect(within(banner).getByText(/You have saved/)).toBeInTheDocument();
            expect(within(banner).getByText(/user 537/)).toBeInTheDocument();
            expect(within(banner).getByText(/for the Lalala funding stream/)).toBeInTheDocument();
          });
        });

        xdescribe("and when I change permissions, save and then navigate away", () => {
          beforeEach(async () => {
            const checkbox1 = screen.getByRole("checkbox", {
              name: Permission.CanEditCalculations.toString(),
            });
            expect(checkbox1).toBeInTheDocument();
            expect(checkbox1).not.toBeChecked();
            userEvent.click(checkbox1);
            expect(checkbox1).toBeChecked();

            const button = screen.getByRole("button", { name: /Save permissions/ });
            expect(button).toBeEnabled();

            await waitFor(() => userEvent.click(button));
          });

          it("does not display the confirm leave page modal", async () => {
            const link = screen.getByRole("link", { name: /Home/ });

            await waitFor(() => userEvent.click(link));

            expect(screen.queryByTestId("modal-confirmation-placeholder")).not.toBeInTheDocument();
          });
        });

        xdescribe("and when I click away to another page without making any changes", () => {
          it("does not display the confirm leave page modal", async () => {
            const link = screen.getByRole("link", { name: /Home/ });

            await waitFor(() => userEvent.click(link));

            expect(screen.queryByTestId("modal-confirmation-placeholder")).not.toBeInTheDocument();
          });
        });

      });
    });
  });
});

const mockFundingStream: FundingStream = {
  id: "1619",
  name: "16-19",
};
const mockUser: UserSearchResultItem = {
  id: "user-id-537",
  name: "user 537",
  username: "user-537",
};
const mockUserSearchResult: UserSearchResult = {
  users: [mockUser],
};
const mockUserPermissions = buildPermissions({
  userId: "user-id-537",
  fundingStreamId: mockFundingStream.id,
  fundingStreamName: mockFundingStream.name,
  setAllPermsEnabled: false,
  actions: [(p) => (p.canCreateTemplates = true)],
});

const mockUserService = () => {
  jest.mock("../../../services/userService", () => {
    const service = jest.requireActual("../../../services/userService");
    return {
      ...service,
      findUsers: jest.fn(() =>
        Promise.resolve({
          status: 200,
          data: mockUserSearchResult,
        })
      ),
      getOtherUsersPermissionsForFundingStream: jest.fn(() =>
        Promise.resolve({
          status: 200,
          data: mockUserPermissions,
        })
      ),
      updateOtherUsersPermissionsForFundingStream: jest.fn(() =>
        Promise.resolve({
          status: 200,
          data: mockUserPermissions,
        })
      ),
      removeOtherUserFromFundingStream: jest.fn(() =>
        Promise.resolve({
          status: 200,
        })
      ),
    };
  });
};

const renderPage = async () => {
  const { IndividualPermissionsAdmin } = require("../../../pages/Permissions/IndividualPermissionsAdmin");
  return render(
    <MemoryRouter initialEntries={["/Permissions/Individual"]}>
      <QueryClientProviderTestWrapper>
        <Switch>
          <Route path="/Permissions/Individual" component={IndividualPermissionsAdmin} />
        </Switch>
      </QueryClientProviderTestWrapper>
    </MemoryRouter>
  );
};

const useSelectorSpy = jest.spyOn(redux, "useSelector");
