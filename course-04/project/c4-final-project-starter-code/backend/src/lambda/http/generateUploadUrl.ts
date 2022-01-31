import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { setAttachmentUrl } from '../../helpers/todos';
import { getUserId } from '../utils';
import { getAttachmentUrl } from '../../helpers/attachmentUtils';
import { IsNullOrWhiteSpace } from '../../helpers/stringHelper';

const bucketName = process.env.ATTACHMENT_S3_BUCKET;

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  const todoId = event.pathParameters.todoId;
  if (IsNullOrWhiteSpace(userId) || IsNullOrWhiteSpace(todoId)) {
    return {
      statusCode: 400,
      body: 'One or more items are empty.'
    }
  }
  
  const uploadUrl = getAttachmentUrl(todoId);
  const attachmentUrl: string = `https://${bucketName}.s3.amazonaws.com/${todoId}`

  await setAttachmentUrl(userId, todoId, attachmentUrl);

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl
    })
  }
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
