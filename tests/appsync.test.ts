import { handler } from "../appsync"

describe("handler", () => {

  test("listEvents", async () => {
    const response = await handler({
      arguments: {},
      field: "listEvents",
    })

    expect(response).toEqual({})
  })
})
