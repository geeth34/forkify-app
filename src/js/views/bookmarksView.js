import view from './view.js';
import previewView from './previewView.js'

class BookmarksView extends view
{
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  // success message 
  _message = '';

  // render bookmarks when page loads 
  addHandlerRender(handler)
  {
    window.addEventListener('load', handler);
  };

  _generateMarkup()
  {
    console.log(this._data);
    return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
    // returns a string of bookmarks list
  };
};

export default new BookmarksView();