import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import urlExists from 'url-exists-deep';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image - https://wallpaperaccess.com/full/454132.jpg
  //    3. send the resulting file in the response
  //    4. delete any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filtered-image?image_url={{}}")
  });
  
  app.get( "/filtered-image/", async ( req, res ) => {
    const urlOfImageToBeFiltered:string = req.query.image_url;

  //    1. validate the image_url query
    const isValidUrl = await urlExists(urlOfImageToBeFiltered);
    if (!isValidUrl) {
      res.status(400).send("Invalid Request. Please check the request and try again.");
    }

  //    2. call filterImageFromURL(image_url) to filter the image
    const filteredImage:string = await filterImageFromURL(urlOfImageToBeFiltered);
  
  //    3. send the resulting file in the response
    res.status(200).send(filteredImage);

  //    4. delete any files on the server on finish of the response
  res.on('finish', function(){
    deleteLocalFiles([filteredImage]);
  });
});

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  });
})();