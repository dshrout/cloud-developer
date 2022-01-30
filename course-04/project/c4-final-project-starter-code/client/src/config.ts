// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '6hr4hd137l'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-5muo48qz.us.auth0.com',            // Auth0 domain
  clientId: '0NoVD4APQvdhdNw6L6jpRbdKZuaRubvl',   // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
