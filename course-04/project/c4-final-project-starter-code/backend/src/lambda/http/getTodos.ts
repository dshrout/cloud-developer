import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getTodos as getTodos } from '../../helpers/todos';
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';
import { IsNullOrWhiteSpace } from '../../helpers/stringHelper';

const logger = createLogger('getTodos');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Get Todos: ', event);

  const userId = getUserId(event);
  if (IsNullOrWhiteSpace(userId)) {
    return {
      statusCode: 400,
      body: 'User ID cannot be empty.'
    }
  }

  const items = await getTodos(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      items
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
