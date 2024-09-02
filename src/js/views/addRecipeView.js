import view from './view.js';

class AddRecipeView extends view
{
    _parentElement = document.querySelector('.upload');
    // success message
    _message = 'Recipe was successfully uploaded :)';
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    
    // buttons to open and close the 'Add recipe' form 
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor()
    {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    };

    toggleWindow()
    {
        this._window.classList.toggle('hidden');
        this._overlay.classList.toggle('hidden');
    };

    _addHandlerShowWindow()
    {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    };

    // close the form
    _addHandlerHideWindow()
    {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    };

    // submit form 
    addHandlerUpload(handler)
    {
        this._parentElement.addEventListener('submit', function(e)
        {
            e.preventDefault();
            console.log(this);

            // using FormData API
            const dataArr = [...new FormData(this)];// takes form element
            console.log(dataArr);// [field label, input field value] 

            // converting to JSON 
            const data = Object.fromEntries(dataArr);
            handler(data);
        });
    };
};

export default new AddRecipeView();