import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: "projects",
        // 'Key' defines the partition key and sort key of the item to be updated指定被修改的Item的主键
        // - 'projectName': Name of the project
        // - 'projectId': path parameter
        Key: {
          projectId: event.pathParameters.id
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: "SET requirements = :requirements, pstatus = :pstatus, projectName = :projectName",                            
        //
        ExpressionAttributeValues: {
            ":requirements": data.requirements || null,
            ":pstatus": data.pstatus || null,
            ":projectName": data.projectName || null
        },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update; you
        // can inspect 'result' below to see how it works with different settings
        ReturnValues: "ALL_NEW"
    };

    try {
        const result = await dynamoDbLib.call("update", params);
        return success({ status: true });
    } catch (e) {
        return failure({ status: false });
    }
}