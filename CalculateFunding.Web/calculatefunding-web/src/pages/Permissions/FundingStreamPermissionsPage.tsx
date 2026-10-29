import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Main } from "../../components/Main";
import { IStoreState } from "../../reducers/rootReducer";
import { Permission, PermissionsCategories } from "../../types/Permission";
import { useFundingStreamPermissions } from "../../hooks/Permissions/useFundingStreamPermissions";
import { FundingStreamPermissions } from "../../types/FundingStreamPermissions";
import { Section } from "../../types/Sections";
import { getAdminUsersForFundingStream } from "services/userService";
import { BackLink } from "components/BackLink";

export function FundingStreamPermissionsPage(): JSX.Element {
  const { fundingStreamId } = useParams<{ fundingStreamId: string }>();
  const [adminUsers, setAdminUsers] = useState<string[]>([]);
  const history = useHistory();

  const permissions = useSelector(
    (state: IStoreState) => state.userState.fundingStreamPermissions
  );

  const selectedFundingStream: FundingStreamPermissions | undefined =
    permissions.find((p) => p.fundingStreamId === fundingStreamId);

  const permitted: Permission[] =
    useFundingStreamPermissions(selectedFundingStream);

function goBack() {
  history.push(`/permissions/ViewMyPermissions`);
}

useEffect(() => {
  if (!selectedFundingStream) return;

  getAdminUsersForFundingStream(selectedFundingStream.fundingStreamId)
    .then((result) =>
      setAdminUsers(
        (result.data ?? [])
          .map((u) => u.username?.trim())
          .filter(Boolean)
      )
    )
}, [selectedFundingStream]);

  return (
    <Main location={Section.Home}>
      <BackLink />
      <h1 className="govuk-heading-l govuk-!-margin-bottom-3 govuk-!-margin-top-5">
        {selectedFundingStream?.fundingStreamName}
      </h1>
      <section id="permissions">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">
            <div className="govuk-grid-row govuk-!-margin-top-3">
                    <div className="govuk-grid-column-full">
                      <div className="form-group">  
                        
                        { adminUsers.length == 0 ? 
                          <>
                            <p className="govuk-body">
                              To get a new permission for this funding stream, 
                              <br/>
                              <a className="govuk-link govuk-link--no-visited-state" target="”_blank”" href="https://dfe.service-now.com/ithelpcentre?id=sc_cat_item&sys_id=f67e66541bf79dd0b192ec69b04bcb70&referrer=recent_items">
                                make a CFS work request (opens in new tab)
                              </a>{" "}
                              at the IT Help Centre. An administrator will 
                              <br/>
                              be allocated to this funding stream soon.
                            </p>
                          </>: 
                            <p className="govuk-body">
                              To get a new permission for this funding stream,
                              send an email to an administrator:
                            </p>
                          }
                        
                        {adminUsers.length > 0 &&
                        <>
                          <ul className="govuk-list govuk-list--bullet">
                            {adminUsers.map((user) => (
                                <li key={user}>
                                    <a className="govuk-link govuk-link--no-visited-state"
                                     target="”_blank”"  href={`mailto:${user}`}>{user}</a>
                                </li>
                            ))}
                        </ul>

                        <p className="govuk-body">
                          If no administrator is available{" "}
                          <a className="govuk-link govuk-link--no-visited-state" target="”_blank”" href="https://dfe.service-now.com/ithelpcentre?id=sc_cat_item&sys_id=f67e66541bf79dd0b192ec69b04bcb70&referrer=recent_items">
                            make a CFS work request (opens in new tab)
                          </a>{" "}
                          at the IT Help Centre.
                        </p>
                        </>
                        }  

                        <p className="govuk-body">
                          CFS users cannot update their own permissions.
                        </p>
                      </div>
                    </div>
                  </div>
                  <br/>
                  <h2 className="govuk-heading-m">View your permissions</h2>

            {Object.keys(PermissionsCategories).map((categoryName) => {
              const categoryPermissions = PermissionsCategories[categoryName];

              return (
                  <table key={categoryName} className="govuk-table govuk-!-margin-top-1">
                    <caption className="govuk-table__caption">
                      <h2>{categoryName}</h2>
                    </caption>

                    <thead className="govuk-table__head">
                      <tr className="govuk-table__row">
                        <th
                          scope="col"
                          className="govuk-table__header"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className={
                            categoryName === "Funding permissions"
                              ? "govuk-table__header w-15"
                              : "govuk-table__header"
                          }
                        >
                          Permission given
                        </th>
                      </tr>
                    </thead>

                    <tbody className="govuk-table__body">
                      {categoryPermissions.map((permission) => {
                        const permissionTitle =
                          permission.toString();
                          const words = permissionTitle.split(" ");

                          let boldCount = 1;

                          if (permissionTitle === Permission.CanUploadDataSourceFiles || permissionTitle === Permission.CanAdministerFundingStream) boldCount = 3;

                          const boldWords = words.slice(0, boldCount).join(" ");
                          const restWords = words.slice(boldCount).join(" ");

                        return (
                          <tr
                            key={permission.toString()}
                            className="govuk-table__row"
                          >

                            <td className="govuk-table__cell govuk-!-width-three-quarters">
                              <strong>{boldWords}</strong>{" "}
                              {restWords}
                            </td>

                            <td className="govuk-table__cell">
                              <span className={`govuk-tag-text-original govuk-tag ${permitted.includes(permission) ? "govuk-tag--green" : "govuk-tag--grey"}`}>
                                {permitted.includes(permission) ? "Yes" : "No"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
              );
            })}


             <button
                type="button"
                className="govuk-button govuk-!-margin-right-1"
                onClick={goBack}
              >
                Change funding stream
              </button>
          </div>
        </div>
      </section>
    </Main>
  );
}