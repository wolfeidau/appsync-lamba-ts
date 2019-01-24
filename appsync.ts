import AWS from "aws-sdk"
import bunyan from "bunyan"

const tableName = process.env.EVENT_TABLE_NAME || ""

const docClient = new AWS.DynamoDB.DocumentClient()

const logger = bunyan.createLogger({
  name: "appsync",
})

interface HandlerEvent {
  identity: any
  arguments: any
  field: string
}

export const handler = (event: HandlerEvent) => {

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

function listEvents(event: HandlerEvent): Promise<any> {
  logger.info({
    op: "dispatchListEvent",
    arguments: event.arguments,
  })

  const params: AWS.DynamoDB.DocumentClient.ScanInput = {
    TableName: tableName,
    Limit: event.arguments.limit,
    ExclusiveStartKey: event.arguments.nextToken,
  }

  return docClient.scan(params).promise().then((res: AWS.DynamoDB.DocumentClient.ScanOutput) => {
    return {
      items: res.Items,
      nextToken: res.LastEvaluatedKey,
    }
  })
}

function createEvent(event: HandlerEvent): Promise<any> {
  logger.info({
    op: "create",
    params: event.arguments,
  })

  // TODO: build actual create event
  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: tableName,
    Item: event.arguments,
    ReturnValues: "ALL_NEW",
  }

  return docClient.put(params).promise().then((res) => {
    return res.Attributes
  })
}
