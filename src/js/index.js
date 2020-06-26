import Search from './models/Search';

/* Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object 
 * - Liked recipes
 */
const state = {};

const controlSearch = async () => {
    //1) Get query from the view
    const query = 'pizza'; //todo

    if(query) {
        // 2) New search object and add to the state
        state.search = new Search(query);

        // 3) Prepare UI for results

        // 4) Search for recipes
        await state.search.getResults();

        // 5) render results on UI
        console.log(state.search.results);
    }
}

document.querySelector('.search'),addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
})

