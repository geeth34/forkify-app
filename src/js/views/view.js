import icons from 'url:../../img/icons.svg';

export default class View 
{
    _data;
    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered (eg : a recipe)
     * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
     * @returns {undefined | string} A markup string is returned if render=false
     * @this {Object} 'View' instance
     */

    render(data, render = true)
    {
        console.log(data);
        // if no data or the data is an array of length 
        if(!data || (Array.isArray(data) && data.length === 0))
            return this.renderError();
        
        this._data = data;
        const markup = this._generateMarkup();
        if(!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    // update only changed part of elements
    update(data)
    {
        this._data = data;
        const newMarkup = this._generateMarkup();

        // converting newMarkup string to DOM object 
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        console.log(newDOM);

        // converting the DOM objects to array
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const currentElements = Array.from(this._parentElement.querySelectorAll('*'));
        console.log(newElements);
        console.log(currentElements);

        // comparing the new elements with the current 
        newElements.forEach((newEl, i) =>
        {
            const currentEl = currentElements[i];
            console.log(currentEl, newEl, newEl.isEqualNode(currentEl));
            // isEqualNode compares content inside the nodes

            // 1) update changed texts
            if(!newEl.isEqualNode(currentEl) && newEl.firstChild?.nodeValue.trim() !== '')
            {
                console.log('❗❗', newEl.firstChild?.nodeValue.trim());
                // replacing the current element text
                currentEl.textContent = newEl.textContent;
            };

            // 2) update changed attributes 
            if(!newEl.isEqualNode(currentEl))
            {
                console.log(newEl.attributes);// object containing attributes of all changed elements 
                // replacing current attributes with the new ones
                Array.from(newEl.attributes).forEach(attr => currentEl.setAttribute(attr.name, attr.value));
            };
        });
    };

    // clear respective parent element 
    _clear()
    {
        console.log(this);
        this._parentElement.innerHTML = '';
    };
    
    // create buffering/loading spinner
    renderSpinner()
    {
        const markup = `
        <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
        </div>`;

        this._clear();
        // attaching the markup string to the parent 
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    // display the respective error message 
    renderError(message = this._errorMessage)
    {
        const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>`;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    // display success message :
    renderMessage(message = this._message)
    {
        const markup = `
        <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>`;
        
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };
};