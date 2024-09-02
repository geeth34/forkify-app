// import { async } from regenerator-runtime;
import { TIMEOUT_SEC } from './config.js';

const timeout = function(s)
{
    return new Promise(function(_, reject) 
    {
        setTimeout(function() 
        {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

// fetch data 
export const AJAX = async function(url, uploadData = undefined)
// uploadData is relevant only while sending/uploading data to the API 
{
    try
    {
        const request = fetch(url,
        {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(uploadData),
        });// object for 'POST' method 
        
        const response = await Promise.race([uploadData ? request : fetch(url), timeout(TIMEOUT_SEC)]);
        console.log(response);

        // converting the response to json 
        const data = await response.json();

        // error handling 
        if(!response.ok)
            throw new Error(`${data.message} (${response.status})`);
        console.log(data);
        return data;
    }
    catch(err)
    {
        throw err;
    }
};

// to convert decimal values to fractional
export const getFraction = function(amount) 
{
    if (parseFloat(amount) === parseInt(amount)) 
        return amount;
    const gcd = function (a, b) 
    {
        if (b < 0.0000001) 
          return a;
        return gcd(b, Math.floor(a % b));
    };
    
    const len = amount.toString().length - 2;
    let denominator = Math.pow(10, len);
    let numerator = amount * denominator;
    let divisor = gcd(numerator, denominator);
    numerator /= divisor;
    denominator /= divisor;
    let base = 0;
    
    // converting to mixed fraction 
    if (numerator > denominator) 
    {
        base = Math.floor(numerator / denominator);
        numerator -= base * denominator;
        // pulling out the base number and reducing the numerator
    }
    amount = Math.floor(numerator) + '/' + Math.floor(denominator);
    if (base) 
        amount = base + ' ' + amount;
    return amount;
};