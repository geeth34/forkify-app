import view from './view.js';
import icons from '../../img/icons.svg';

class PaginationView extends view
{
    _parentElement = document.querySelector('.pagination');

    addHandlerNavigateBtn(handler)
    {
        this._parentElement.addEventListener('click', (e) =>
        {
            console.log(e.target);
            const btn = e.target.closest('.btn--inline');
            console.log(btn);
            if(!btn) return;
            
            // page to be navigated to
            const goToPage = +btn.dataset.goto;
            console.log(goToPage);
            handler(goToPage);
        });
    };
    
    _generateMarkup()
    {
        console.log(this);
        const curPage = this._data.page;

        // computing number of pages
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        console.log(numPages);
        
        const num = `
            <div class="total btn--inline pagination__btn--prev" style="background-color:white">
                ${numPages === 0 ? '' : `Page ${curPage} of ${numPages}`}  
            </div>`;

        // display current page number
        const curPageNum = document.querySelector('.curPage-num');
        curPageNum.innerHTML = '';
        curPageNum.insertAdjacentHTML('afterbegin', num);
        
        // if query has no results 
        if(this._data.results.length === 0) return;

        // first page followed by more
        if(curPage === 1 && numPages > 1)// value of 'page' will depend on the current page  
            return this._generateMarkupNextBtn(curPage);

        // one page ONLY
        if(curPage === 1 && numPages === 1) return '';

        // page other than first and last
        if(curPage !== 1 && curPage < numPages)
            return [this._generateMarkupPrevBtn(curPage), this._generateMarkupNextBtn(curPage)];

        // last page 
        if(curPage === numPages && numPages > 1)
            return this._generateMarkupPrevBtn(curPage);
    };

    // navigate to previous page
    _generateMarkupPrevBtn(curPage)
    {
        return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>`
    };

    // navigate to next page
    _generateMarkupNextBtn(curPage)
    {
        return `
            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${curPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`
    };
};

export default new PaginationView();