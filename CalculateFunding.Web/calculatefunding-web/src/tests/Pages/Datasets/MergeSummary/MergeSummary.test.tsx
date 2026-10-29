import { render, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router";

import { MergeSummary } from "../../../../pages/Datasets/MergeSummary/MergeSummary";

function renderMergeSummary(
  existingRows: number,
  additionalRows: number,
  dataSchemaName: string,
  dataSourceVersion: number,
  dataSourceName: string,
  hidden: boolean
) {
  return render(
    <MemoryRouter>
      <MergeSummary
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

describe("<MergeSummary />", () => {
  it(" displays the correct additional rows", async () => {
    renderMergeSummary(1, 1, "Test DataSchema Name", 1, "Test Data Source Name", false);
    await waitFor(() => expect(document.querySelector("#additional-rows-created")?.textContent).toBe("1"));
  });

  it(" displays the correct existing rows amended", async () => {
    renderMergeSummary(1, 1, "Test DataSchema Name", 1, "Test Data Source Name", false);
    await waitFor(() => expect(document.querySelector("#existing-rows-amended")?.textContent).toBe("1"));
  });

  it(" displays the correct data schema name", async () => {
    renderMergeSummary(1, 1, "Test DataSchema Name", 1, "Test Data Source Name", false);
    await waitFor(() =>
      expect(document.querySelector("#data-schema")?.textContent).toBe("Test DataSchema Name")
    );
  });

  it(" displays the correct data source version", async () => {
    renderMergeSummary(1, 1, "Test DataSchema Name", 1, "Test Data Source Name", false);
    await waitFor(() => expect(document.querySelector("#data-source-version")?.textContent).toBe("1"));
  });

  it(" displays the correct data source name", async () => {
    renderMergeSummary(1, 1, "Test DataSchema Name", 1, "Test Data Source Name", false);
    await waitFor(() =>
      expect(document.querySelector("#data-source")?.textContent).toBe("Test Data Source Name")
    );
  });
});
