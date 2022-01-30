import { TodosAccess } from './todosAccess'
//import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate'
//import * as createError from 'http-errors'

const todoAccess = new TodosAccess();

// createTodo
export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem>{
    const createdAt = new Date().toISOString()
    const todoId = uuid.v4()
    return await todoAccess.createTodo({
        userId,
        todoId,
        createdAt,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
    })
}

// getTodos
export async function getTodos(userId: string): Promise<TodoItem[]>{
    return todoAccess.getTodos(userId)
}

// getTodoById
export async function getTodoById(userId: string, todoId: string): Promise<TodoItem[]>{
    return todoAccess.getTodoById(userId, todoId)
}

// updateTodo
export async function updateTodo(userId: string, todoId: string, todoUpdate: TodoUpdate): Promise<TodoItem>{
    return await todoAccess.updateTodo(
        userId, 
        todoId, {
        name: todoUpdate.name,
        dueDate: todoUpdate.dueDate,
        done: todoUpdate.done
    })
}

// deleteTodo
export async function deleteTodo(userId: string, todoId: string){
    return await todoAccess.deleteTodo(userId, todoId)
}

// setAttachmentUrl
export async function setAttachmentUrl(userId: string, todoId: string, attachmentUrl: string): Promise<TodoItem>{
    const updatedTodo: any = {
        userId,
        todoId,
        attachmentUrl
    }

    return await todoAccess.setAttachmentUrl(updatedTodo);
}
