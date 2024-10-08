# forkify App

Application that allows users to search for recipes based on ingredients, view detailed recipe information, and save their favorite ones. <br>
The application is designed to provide a user-friendly interface for discovering and making custom recipe uploads.

You can visit the website here : [forkify](https://forkify-recipessearch.netlify.app/)

https://github.com/user-attachments/assets/8bd35970-9f9b-4206-9803-612d167dd2d8

## Installation 

1. Clone the repository 

```bash
git clone https://github.com/geeth34/forkify-app.git
```
2. Navigate to the project directory and install all the dependencies.

```bash
npm install
```

## Usage

1. Generate an API key at [Forkify API key](https://forkify-api.herokuapp.com/v2) and enter it in your `config.js` file

```bash
const KEY = 'YOUR_API_KEY';
```
2. To run the application in devlopment mode

```bash
npm start
```
Open http://localhost:3000 to view it in the browser.

3. Build the application for production to the `dist` folder

```bash
npm run build
```
  Parcel bundles the HTML, SASS and Javascript files in production mode and optimizes the build for the best performance.

## Features

- **Search recipes** : allows to search recipes based on the item or ingredients.
- **Recipe details** : displays detailed information about each recipe, including ingredients and cooking instructions.
- **Servings** : users can select the number of servings and the ingredient quantities will be displayed accordingly.
- **Bookmark** : users can save recipes their favorite recipes for easy access later.
- **Add recipe** : to make custom recipe uploads.

## Built with

- HTML
- SASS
- Javascript
- NPM
- Parcel
- Forkify API
  
## References

Check out [Forkify API v2 Documentation](https://forkify-api.herokuapp.com/v2) for details regarding API endpoints.

## Acknowledgements

- [Jonas Schmedtmann](https://github.com/jonasschmedtmann)

