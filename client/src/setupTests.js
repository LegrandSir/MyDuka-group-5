import "@testing-library/jest-dom";
import 'whatwg-fetch';

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      headers: {
        get: (header) => {
          if (header.toLowerCase() === "content-type") {
            return "application/json";
          }
          return null;
        },
      },
      json: () => Promise.resolve([]), 
    })
  );
});

afterEach(() => {
  fetch.mockClear();
});