class SearchView
{
    #parentElement = document.querySelector('.search');

    // get user input query
    getQuery()
    {
        const query =  this.#parentElement.querySelector('.search__field').value;
        this.#clearInput();
        return query;
    };

    // clear input query field
    #clearInput()
    {
        this.#parentElement.querySelector('.search__field').value = '';
    };

    addHandlerSearch(handler)
    {
        this.#parentElement.addEventListener('submit', (e) => 
        {
            e.preventDefault();
            handler();
        });
    };
};

export default new SearchView();