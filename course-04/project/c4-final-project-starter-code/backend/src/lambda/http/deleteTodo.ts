import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { getTodoById, deleteTodo } from '../../helpers/todos';
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('deleteTodo');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Delete Todo: ', event);

  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  const item = await getTodoById(userId, todoId);
  if (item.length === 0) {
    logger.info('HTTP 404 - todoId ' + todoId + ' not found for user ' + userId);
    return {
      statusCode: 404,
      body: 'Item not found.'
    }
  } else if (item.length > 1) {
    logger.info('HTTP 500 - todoId ' + todoId + ' returned multiple todos for user ' + userId);
    return {
      statusCode: 500,
      body: 'Internal server error.'
    }
  }

  await deleteTodo(userId, todoId);
  return {
    statusCode: 204,
    body: ''
  }
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
