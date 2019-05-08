import dataIdHandler from "@src/helpers/dataIdHandler";

const testEvent = {
  currentTarget: {
    dataset: { id: 42 },
  },
};

describe("dataIdHandler", () => {
  it("sends the element 'data-id' attribute to the wrapped function", () => {
    let handledId: number;
    const innerHandler = (id: number) => {
      handledId = id;
    };

    const wrappedHandler = dataIdHandler(innerHandler);
    wrappedHandler.call(undefined, testEvent);
    expect(handledId).toBe(42);
  });
  it("memoizes the function creation so that it is memory-safe to call 'dataIdHandler(handler)' from React component", () => {
    const innerHandler = (id: number) => true;

    const wrappedHandler1 = dataIdHandler(innerHandler);
    const wrappedHandler2 = dataIdHandler(innerHandler);

    expect(wrappedHandler1).toBe(wrappedHandler2);
  });
});