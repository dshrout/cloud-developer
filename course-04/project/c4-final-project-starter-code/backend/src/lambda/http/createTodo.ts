import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos';
import { createLogger } from '../../utils/logger';
import { IsNullOrWhiteSpace } from '../../helpers/stringHelper';

const logger = createLogger('createTodo');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Create Todo: ', event);

  const userId = getUserId(event);
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  if (IsNullOrWhiteSpace(userId) || IsNullOrWhiteSpace(newTodo.dueDate) || IsNullOrWhiteSpace(newTodo.name)) {
    return {
      statusCode: 400,
      body: 'One or more items are empty.'
    }
  }

  const item = await createTodo(userId, newTodo);

  return {
    statusCode: 201,
    body: JSON.stringify({
      item
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
