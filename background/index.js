'use strict';

import { wrapStore, alias } from 'react-chrome-redux';
import rootReducer from './reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import chromeStorage, { loadFromStorage } from './redux/chromeStorage';
import { middleware } from 'redux-async-initial-state';

import { getDailyThunk, getWeeklyThunk, getHourlyThunk, resetLastSteps, resetRefresh } from './reducers/user';
import { toggleGaveUp, toggleStayUp } from './reducers/block';

import { decrementTime } from './reducers/time'
import checkAchievements from './achievements';
import { checkHourlyBlock, checkTimeSteps, checkSleepTime, checkDisable} from './utils/blockingUtils'


const keysToPersistInChrome = [
  'settings',
  'user',
  'time',
  'block'
];

// load values for keys to persist from storage into redux store
// perform any initial server requests that are independent
// from login state
const loadStore = (currentState) => {
  const chromeStoragePromise = loadFromStorage(keysToPersistInChrome);
  return Promise.all([
    chromeStoragePromise,
  ])
    .then(([
      loadedChromeStorage
    ]) => ({
      ...currentState,
      ...loadedChromeStorage,
    }));
};

const store = createStore(
  rootReducer,
  applyMiddleware(
    createLogger(),
    chromeStorage(keysToPersistInChrome),
    alias({
      'getSteps': getDailyThunk,
      'getChartSteps': getWeeklyThunk,
      'getTimeoutSteps': getHourlyThunk
    }),
    thunk,
    middleware(loadStore)
  )
);
// a normal Redux store

window.store = store;
wrapStore(store, { portName: 'GET_FIT_DONE' });

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg === 'get-tabId') {
        sendResponse(sender.tab.url);
    }
});

//keeping track of time
var pollInterval = 1000; // 1 second

function startRequest() {
  var state = store.getState();
  if (state.user.accessToken) {
    pollInterval = 1000 * 60;
    let t = new Date();
    let time = t.toString().slice(16, 21);

    let currTimeVal = Number(time.slice(0, 2) + time.slice(3));
    if (currTimeVal % 100 === 0){
      store.dispatch(resetRefresh());
    }

    store.dispatch({type: 'getSteps'})
      .then((response) => {
        var state = store.getState();
        if (state.user.steps < state.user.lastSteps) {
          store.dispatch(resetLastSteps());
        }
      })
      .then((response) => {
        store.dispatch(decrementTime());
      })
      .then((response) => {
        var state = store.getState();
        if (state.settings.disabledTimeMode) checkDisable(state, time);
        if (state.settings.hourlyMode) checkHourlyBlock(state);
        if (!state.block.gaveUp){
          if (state.settings.timeStepsMode) checkTimeSteps(state, time);
        }
        else {
          let totalStepsTime = state.settings.totalStepsTime
          if (time.slice(0, 2) < totalStepsTime.slice(0, 2)){
            store.dispatch(toggleGaveUp());
          }
        }
        if (!state.block.stayUp){
          if (state.settings.sleepMode) checkSleepTime(state, time);
        }
        else {
          let startSleep = state.settings.sleepTime[0];
          if (time.slice(0, 2) < startSleep.slice(0, 2)){
            store.dispatch(toggleStayUp());
          }
        }

      })
      // .then((response) => {
      //   checkBlockState(store.getState())
      // })
    checkAchievements();
  }
  window.setTimeout(startRequest, pollInterval);
}

startRequest();
