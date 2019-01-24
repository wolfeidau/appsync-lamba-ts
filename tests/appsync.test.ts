import AWS from "aws-sdk"
import { handler } from "../appsync"

const ddbClient = new AWS.DynamoDB()

describe("handler", () => {

  beforeAll(async () => {

    jest.setTimeout(60000)

    const tableName = process.env.EVENT_TABLE_NAME || ""

    try {
      await ddbClient.deleteTable({TableName: tableName}).promise()
    } catch (err) {
      if (err && err.code !== "ResourceNotFoundException") {
        throw err
      }
    }

    await ddbClient.waitFor("tableNotExists", {
      TableName: tableName,
    }).promise()

    const createParams: AWS.DynamoDB.Types.CreateTableInput = {
      TableName: tableName,
      AttributeDefinitions: [
        {AttributeName: "eventId", AttributeType: "S"},
      ],
      KeySchema: [{
        AttributeName: "eventId", KeyType: "HASH",
      }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2,
      },
    }

    try {
      await ddbClient.createTable(createParams).promise()
    } catch (err) {
      if (err && err.code !== "ResourceInUseException") {
        throw err
      }
    }

    await ddbClient.waitFor("tableExists", {
      TableName: tableName,
    }).promise()

    const putParams: AWS.DynamoDB.Types.PutItemInput = {
      TableName: tableName,
      Item: {
        eventId: {S: "OF3PDHYOOROA9OU7cZNCKA"},
        created: {S: "2019-01-24T02:28:10.161Z"},
      },
    }

    await ddbClient.putItem(putParams).promise()
  })

  test("listEvents", async () => {
    const response = await handler({
      identity: {},
      arguments: {limit: 20},
      field: "listEvents",
    })

    expect(response).toEqual({items: [
      {
        created: "2019-01-24T02:28:10.161Z",
        eventId: "OF3PDHYOOROA9OU7cZNCKA",
      },
    ], nextToken: undefined})
  })
})
