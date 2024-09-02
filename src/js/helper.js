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