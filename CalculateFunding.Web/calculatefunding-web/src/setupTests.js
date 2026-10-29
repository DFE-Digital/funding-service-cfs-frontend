/* eslint-disable no-undef, no-alert, no-console, @typescript-eslint/no-empty-function */
import '@testing-library/jest-dom';
import { configure } from "@testing-library/react";
import { format } from "util";

const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
let mock = new MockAdapter(axios);

// this should throw an error on any unmocked axios call
mock.onAny().reply((x) => {
  throw new Error(
    `Failed to mock service call for ${x.method} ${x.url} ${x.data ? JSON.stringify(x.data) : ""} `
  );
});

if (window) {
  window.scrollTo = jest.fn();
  window.MutationObserver = window.MutationObserver || require("@sheerun/mutationobserver-shim");
  window.HTMLElement.prototype.scrollIntoView = function () {};
}

const error = global.console.error;

global.console.error = function (...args) {
  const testPath = global.jasmine?.testPath ? ` ${global.jasmine.testPath} \n` : "";
  const message = format(testPath, ...args);
  error(message);
  throw new Error(message);
};


// mock these by default to avoid having to mock the redux provider in every page test
jest.mock("./components/TopHeader");
jest.mock("./components/AdminNav");
