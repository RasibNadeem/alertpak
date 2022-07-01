import { combineReducers } from 'redux';
import settings from './settings/reducer';
import menu from './menu/reducer';
import authUser from './auth/reducer';
import chatApp from './chat/reducer';
import surveyListApp from './surveyList/reducer';
import surveyDetailApp from './surveyDetail/reducer';

const reducers = combineReducers({
  menu,
  settings,
  authUser,
  chatApp,
  surveyListApp,
  surveyDetailApp
});

export default reducers;