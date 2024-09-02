import view from './view.js';
import previewView from './previewView.js'

class ResultsView extends view
{
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please try another one!';
  // success message :
  _message = '';

  _generateMarkup()
  {
    console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
    // returns a string of search results
  };
};

export default new ResultsView();