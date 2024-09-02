import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
// imports for polyfilling :
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// activating hot module reloading :
if(module.hot)
  module.hot.accept();

///////////////////////////////////////

const controlRecipes = async function()
{
  try
  {
    const id = window.location.hash.slice(1);// hash contains the query/fragment of the url 
    console.log(id); 
    if(!id) return;

    // render loading spinner
    recipeView.renderSpinner();
    
    // update search results and bookmark
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // loading recipe data 
    await model.loadRecipe(id);

    // render recipe data 
    recipeView.render(model.state.recipe);
  }
  catch(err)
  {
    console.log(err);
    // render error 
    recipeView.renderError();
  };
};

const controlSearchResults = async function()
{
  try
  {
    // get search query 
    const query = searchView.getQuery();
    if(!query) return;
    resultsView.renderSpinner();

    // load search results 
    await model.loadSearchResults(query);

    // render results 
    resultsView.render(model.getSearchResultsPage());

    // render initial pagination buttons 
    paginationView.render(model.state.search);
  }
  catch(err)
  {
    console.log(err);
  };
};

const controlPagination = function(goToPage)
{
  console.log(goToPage);
  // render the updated results 
  resultsView.render(model.getSearchResultsPage(goToPage));

  // render new pagination buttons :
  paginationView.render(model.state.search);
};

const controlServings = function(newServings)
{
  // update recipe servings (in state)
  model.updateServings(newServings);
  
  // render the updated recipe
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function()
{
  // add/remove bookmark 
  if(!model.state.recipe.bookmarked)
    model.addBookmark(model.state.recipe);
  // if bookmarked is true
  else
    model.deleteBookmark(model.state.recipe.id);

  // update bookmark button 
  recipeView.update(model.state.recipe);
  // render bookmarks 
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function()
{
  // render bookmarks 
  bookmarksView.render(model.state.bookmarks);
};

// function to receive new recipe data 
const controlAddRecipe = async function(newRecipe)
{
  try
  {
    addRecipeView.renderSpinner();
    console.log(newRecipe);
    
    // upload the recipe data received 
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);

    // display succes message 
    addRecipeView.renderMessage();
    
    // render the bookmarks 
    bookmarksView.render(model.state.bookmarks);

    // change 'id' in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window 
    setTimeout(() => 
    {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  }
  catch(err)
  {
    console.error(err);
    addRecipeView.renderError(err.message);
  };
};

const init = function()
{
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerNavigateBtn(controlPagination);
};
init();