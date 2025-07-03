import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import https from 'https';

export async function scrapeData() {
  console.log( "Entrando a ScrapeData" );

  const url = 'https://www.bcv.org.ve/'; // Replace with the target URL to scrape

  // Create an https agent that disables SSL certificate verification
  const httpsAgent = new https.Agent( {
    rejectUnauthorized: false,
  } );

  const response = await fetch( url, {agent: httpsAgent} );
  const html = await response.text();
  const $ = cheerio.load( html );

  // Get the last element text from the selector
  const elements = $( 'div.col-sm-6.col-xs-6.centrado' );
  const lastText = elements.length > 0 ? $( elements[ elements.length - 1 ] ).text().replace( ',', '.' ) : '';
  const formattedNumber = lastText ? parseFloat( lastText ).toFixed( 2 ) : '';


  return {formattedNumber};
}
