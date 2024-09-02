import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helper.js';

export const state = 
{
    recipe : {}, 
    search : 
    {
        query : '',
        results : [],
        resultsPerPage : RES_PER_PAGE,
        page : 1,
    },
    bookmarks : [],
};

const createRecipe = function(data)
{
    console.log(data);
    const {recipe} = data.data;
    return(
    {
        cookingTime : recipe.cooking_time,
        id : recipe.id,
        image : recipe.image_url,
        ingredients : recipe.ingredients,
        publisher : recipe.publisher,
        servings : recipe.servings,
        source : recipe.source_url,
        title : recipe.title,
    });
};

// fetching recipe data 
export const loadRecipe = async function(id)
{
    try
    {
        const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
        console.log(data);
        state.recipe = createRecipe(data);
        console.log(state.recipe);

        if(state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else    
            state.recipe.bookmarked = false;
    }
    catch(err)
    {
        console.error(err);
        throw err;
    };
};

// loading search results 
export const loadSearchResults = async function(query)
{
    try
    {
        console.log(query);
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        console.log(data.data.recipes);

        state.search.results = data.data.recipes.map(rec => 
        ({ 
            id : rec.id, 
            image : rec.image_url, 
            publisher : rec.publisher, 
            title : rec.title,
        }));
        console.log(state.search.results);

        state.search.page = 1;
    }
    catch(err)
    {
        console.error(err);
        throw err;
    };
};

// implement pagination 
export const getSearchResultsPage = function(page = state.search.page)
{
    state.search.page = page;
    console.log(page);

    const start = (page - 1) * state.search.resultsPerPage;// 0, 10, 20, ...
    const end = page * state.search.resultsPerPage;// 10, 20, 30, ...
    console.log(start, end);

    return state.search.results.slice(start, end);// (0, 9), (10, 19), (20, 29), ...
};

export const updateServings = function(newServings)
{
    console.log(state.recipe.ingredients);
    state.recipe.ingredients.forEach(ing => 
    {
        // new qty = old qty * new servings / old servings 
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
    });

    state.recipe.servings = newServings;// updating the new servings value
};

// function called while adding/deleting a bookmark
const persistBookmarks = function()
{
    // store a bookmark
    localStorage.setItem('bookmks', JSON.stringify(state.bookmarks));
};

// bookmark a recipe
export const addBookmark = function(recipe)
{
    state.bookmarks.push(recipe);
    console.log(recipe, state.recipe);

    // mark current recipe as bookmarked
    if(recipe.id === state.recipe.id)
        state.recipe.bookmarked = true;

    // upadting local storage :
    persistBookmarks();
};

// delete a bookmark 
export const deleteBookmark = function(id)// recipe id is passed
{
    const index = state.bookmarks.findIndex(rec => rec.id === id);
    console.log(index);
    state.bookmarks.splice(index, 1);
    console.log(state.bookmarks);

    // mark the current recipe as NOT bookmarked
    if(id === state.recipe.id)
        state.recipe.bookmarked = false;
    persistBookmarks();
};

const init = function()
{
    // retrieve a bookmark from local storage
    const storage = localStorage.getItem('bookmks');
    console.log(storage);

    if(storage)
        state.bookmarks = JSON.parse(storage);
};
init();

// function for debugging
const clearBookmarks = function()
{
    localStorage.clear('bookmarks');
};
//clearBookmarks();

// upload recipe to API 
export const uploadRecipe = async function(newRecipe)
{
    try
    {
        console.log(Object.entries(newRecipe));
        const ingredients = Object.entries(newRecipe)
        .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '') 
        // filtered out ingredients excluding those with 'empty' values 
        .map(ing => // ing : [ingredient, value]
        {
            const ingArr = ing[1].replaceAll(' ', '').split(',');
            console.log(ingArr);
            if(ingArr.length !== 3)
                throw new Error('Wrong ingredient format! Please use the correct format :)');
            const [quantity, unit, description] = ingArr;
            return( 
            {
                quantity : quantity ? +quantity : null, 
                unit, 
                description
            });
        });
        console.log(ingredients);

        const recipe = 
        {
            title : newRecipe.title,
            source_url : newRecipe.sourceUrl,
            image_url : newRecipe.image,
            publisher : newRecipe.publisher,
            cooking_time : +newRecipe.cookingTime,
            servings : +newRecipe.servings,
            ingredients,
        };

        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipe(data);

        // add key to recipe and search results, if there exists one
        data.data.recipe.key ? state.recipe.key = data.data.recipe.key : '';
        data.data.recipe.key ? state.search.results = data.data.recipe.key : '';
        console.log(state.recipe);
        
        // bookmark user created recipe
        addBookmark(state.recipe);
    }
    catch(err)
    {
        throw err;
    };
};