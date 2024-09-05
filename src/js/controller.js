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
    const id = window.location.hash.slice(1); // hash contains the query/fragment of the url 
    console.log(id); 
    if(!id) return;

    // loading/buffering spinner
    recipeView.renderSpinner();
    
    // update search results and bookmark
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // load and render recipe data 
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  }
  catch(err)
  {
    console.log(err);
    recipeView.renderError();
  };
};

const controlSearchResults = async function()
{
  try
  {
    // get input search query 
    const query = searchView.getQuery();
    if(!query) return;
    resultsView.renderSpinner();

    // load search results 
    await model.loadSearchResults(query);

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

  // render new pagination buttons 
  paginationView.render(model.state.search);
};

const controlServings = function(newServings)
{
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function()
{
  
  // add/remove bookmark 
  if(!model.state.recipe.bookmarked)
    model.addBookmark(model.state.recipe);

  // if 'bookmarked' is true
  else
    model.deleteBookmark(model.state.recipe.id);

  // update bookmark button 
  recipeView.update(model.state.recipe);
  
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
    
    // upload input recipe data 
    await model.uploadRecipe(newRecipe);

    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);

    // display succes message 
    addRecipeView.renderMessage();
    
    bookmarksView.render(model.state.bookmarks);

    // change recipe 'id' in url
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