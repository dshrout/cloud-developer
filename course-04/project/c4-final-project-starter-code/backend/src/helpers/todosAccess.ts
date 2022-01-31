import * as aws from 'aws-sdk';
import * as awsxray from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';

const awsx = awsxray.captureAWS(aws);
const logger = createLogger('todosAccess');

export class TodosAccess {
    constructor (
        private readonly docClient: DocumentClient = new awsx.DynamoDB.DocumentClient(),
        private readonly todoTable: string = process.env.TODOS_TABLE
    ){}

    // createTodo
    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        logger.info(`Creating new Todo: ${todoItem}`);
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todoItem,
          }).promise();
          
        return todoItem;
    }

    // getTodos
    async getTodos(userId: string): Promise<TodoItem[]> {
        const result = await this.docClient.query({
            TableName: this.todoTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
          }).promise();
          
          const items = result.Items as TodoItem[];
          return items;
    }

    // getTodoById
    async getTodoById(userId: string, todoId: string): Promise<TodoItem[]> {
        const result = await this.docClient.query({
            TableName: this.todoTable,
            KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':todoId': todoId
            }
          }).promise();
          
          return result.Items as TodoItem[];
    }

    // updateTodo
    async updateTodo(userId: string, todoId: string, todoUpdate: TodoUpdate): Promise<TodoItem> {
        logger.info(`Updating Todo: ${todoUpdate}`);
        await this.docClient.update({
            TableName: this.todoTable,
            Key: { 
                userId: userId,
                todoId: todoId 
            },
            ExpressionAttributeNames: {"#n": "name"}, // avoid conflict with DynamoDB reserved word. (https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html)
            UpdateExpression: "set #n = :name, dueDate = :dueDate, done = :done",
            ExpressionAttributeValues: {
                ":name": todoUpdate.name,
                ":dueDate": todoUpdate.dueDate,
                ":done": todoUpdate.done,
            },
            ReturnValues: "UPDATED_NEW"
        }).promise();
          
        return todoUpdate as TodoItem;
    }

    // deleteTodo
    async deleteTodo(userId: string, todoId: string): Promise<void> {
        logger.info(`Deleting Todo ${todoId}`);
        const params = {
            TableName: this.todoTable,
            Key: {
              userId,
              todoId 
            }
        }

        await this.docClient.delete(params).promise()
    }

    // setAttachmentUrl
    async setAttachmentUrl(updatedTodo: any): Promise<TodoItem> {
        logger.info(`updatedTodo.attachmentUrl: ${updatedTodo.attachmentUrl}`);
        await this.docClient.update({
            TableName: this.todoTable,
            Key: { 
                todoId: updatedTodo.todoId, 
                userId: updatedTodo.userId },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": updatedTodo.attachmentUrl,
            },
            ReturnValues: "UPDATED_NEW"
        }).promise();
          
        return updatedTodo;
    }
}