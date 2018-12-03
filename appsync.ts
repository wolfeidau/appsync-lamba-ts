import bunyan from "bunyan"

// const tableName = process.env.EVENT_TABLE_NAME || "";

const logger = bunyan.createLogger({
  name: "appsync",
})

export const handler = (event: any) => {

  logger.info(event)

  switch (event.field) {
    case "listEvents":
      return listEvents(event)
    case "createEvent":
      return createEvent(event)
    default:
      return Promise.reject(`unknown operation: ${event.field}`)
  }
}

async function listEvents(event: any): Promise<any> {
  logger.info({
    op: "dispatchListEvent",
    params: event.params,
  })

  // TODO: build actual list events

  return Promise.resolve({})
}

async function createEvent(event: any): Promise<any> {
  logger.info({
    op: "create",
    params: event.params,
  })

  // TODO: build actual create event

  return Promise.resolve({})
}
