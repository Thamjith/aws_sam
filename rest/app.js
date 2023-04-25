import AWS from '/var/task/node_modules/aws-sdk/clients/dynamodb.js';
import { v4 as uuidv4 } from '/var/task/node_modules/uuid/dist/index.js';

const {DocumentClient} = AWS;
const docClient = new DocumentClient()

export async function FetchAllUsers(event, context) {
    const data = await docClient.scan({
        TableName: 'usersDB'
    }).promise()
    return {
        'statusCode': 200,
        'body': JSON.stringify({
            users: data.Items,
        })
    }
}

export async function CreateUsers(event, context) {
    const {username, email, password} = JSON.parse(event.body)
    await docClient.put({
        TableName: 'usersDB',
        Item: {
            id: uuidv4(),
            username,
            email,
            password
        }
    }).promise()
    return {
        'statusCode': 200,
        'body': JSON.stringify({
            message: `User is created`,
        })
    }
}

export async function DeleteUser(event, context) {
    await docClient.delete({
        TableName: 'usersDB',
        Key: {
            id: event.pathParameters.id
        }
    }).promise()
    return {
        'statusCode': 200,
        'body': JSON.stringify({
            message: `User is Deleted`,
        })
    }
}

export async function UpdateUser(event, context) {
    const Item = JSON.parse(event.body)
    await docClient.update({
        TableName: 'usersDB',
        Key: {
            id: event.pathParameters.id
        },
        UpdateExpression: 'set username= :u, email= :e, password= :p',
        ExpressionAttributeValues: {
            ':u': Item.username,
            ':e': Item.email,
            ':p': Item.password
        },
        ReturnValues: 'UPDATED_NEW'
    }).promise()
    return {
        'statusCode': 200,
        'body': JSON.stringify({
            message: `User is Updated`,
        })
    }
}