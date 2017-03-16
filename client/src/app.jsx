import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';

import injectTapEventPlugin from 'react-tap-event-plugin';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from './components/header';
import TeamPreviewAnalyzer from './containers/team-preview-analyzer-container';
import { reducer as analyzerReducer } from './redux/team-preview-analyzer-reducer';
import { reducer as apiReducer } from './redux/api-reducer';

injectTapEventPlugin();

const reducers = combineReducers({
    analyzer: analyzerReducer,
    api: apiReducer,
});

const store = createStore(reducers, applyMiddleware(apiMiddleware));

const App = () => (
    <Provider store={store}>
        <MuiThemeProvider>
            <div>
                <Header />
                <TeamPreviewAnalyzer />
            </div>
        </MuiThemeProvider>
    </Provider>
);

ReactDOM.render(<App />, document.querySelector('.app'));
