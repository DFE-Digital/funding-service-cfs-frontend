import { render, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router";

import { MergeMatch } from "../../../../pages/Datasets/MergeSummary/MergeMatch";

function renderMergeMatch(
  existingRows: number,
  additionalRows: number,
  dataSchemaName: string,
  dataSourceVersion: number,
  dataSourceName: string,
  hidden: boolean,
) {
  return render(
    <MemoryRouter>
      <MergeMatch
        existingRowsAmended={existingRows}
        additionalRowsCreated={additionalRows}
        dataSchemaName={dataSchemaName}
        dataSourceVersion={dataSourceVersion}
        dataSource={dataSourceName}
        hidden={hidden}
      />
    </MemoryRouter>
  );
}

describe("<MergeMatch />", () => {
  it(" displays the correct additional rows", async () => {
    renderMergeMatch(1, 1, "Test DataSchema Name", 1, "Test Data Source Name", false);
    await waitFor(() =>
      expect(document.querySelector("#match-additional-rows-created")?.textContent).toBe("1")
    );
  });

  it(" displays the correct existing rows amended", async () => {
    renderMergeMatch(1, 1, "Test DataSchema Name", 1, "Test Data Source Name", false);
    await waitFor(() =>
      expect(document.querySelector("#match-existing-rows-amended")?.textContent).toBe("1")
    );
  });

  it(" displays the correct data schema name", async () => {
    renderMergeMatch(1, 1, "Test DataSchema Name", 1, "Test Data Source Name", false);
    await waitFor(() =>
      expect(document.querySelector("#match-data-schema-name")?.textContent).toBe("Test DataSchema Name")
    );
  });

  it(" displays the correct data source version", async () => {
    renderMergeMatch(1, 1, "Test DataSchema Name", 1, "Test Data Source Name", false);
    await waitFor(() => expect(document.querySelector("#match-data-source-version")?.textContent).toBe("1"));
  });

  it(" displays the correct data source name", async () => {
    renderMergeMatch(1, 1, "Test DataSchema Name", 1, "Test Data Source Name", false);
    await waitFor(() =>
      expect(document.querySelector("#match-data-source-name")?.textContent).toBe("Test Data Source Name")
    );
  });
});
