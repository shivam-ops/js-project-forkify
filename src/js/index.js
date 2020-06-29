import Search from './models/Search';
import Recipe from './models/Recipe'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import {elements, renderLoader, clearLoader} from './views/base';

/* Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object 
 * - Liked recipes
 */
const state = {};

/*
 * SEARCH CONTROLLER
 */

const controlSearch = async () => {
    //1) Get query from the view
    const query = searchView.getInput(); //todo
    
    if(query) {
        // 2) New search object and add to the state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
             // 4) Search for recipes
            await state.search.getResults();

            // 5) render results on UI
            clearLoader();
            searchView.renderResults(state.search.results);
        } catch (error) {
            alert('Something wrong the search ...');
            clearLoader();
        }
       
    }
}

elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
        console.log(goToPage);
    }
})

/*
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    
    //Get Id from url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if(id) {
        //prepare uI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Hightlight selected search item
        if(state.search)searchView.highlightedSelected(id);

        //create new recipe object
        state.recipe = new Recipe(id);
        

        try {
            //get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //calculate serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            alert('Error processng recipe');
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));