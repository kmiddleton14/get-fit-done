import {createAction, handleActions } from 'redux-actions';
import { PropTypes } from 'react';

const initialState = {
  showBlock: false,
  gaveUp: false,
  hourlyBlock: false,
  timeStepsBlock: false,
  sleepBlock: false,
  sleepExtension: false,
  sleepExtensionMin: 5,
  disable: false
}

export const SET_BLOCK = 'SET_BLOCK';
export const setBlock = createAction(SET_BLOCK);

export const GIVE_UP = 'GIVE_UP';
export const giveup = createAction(GIVE_UP);

export const UNBLOCK = 'UNBLOCK';
export const unblock = createAction(UNBLOCK);

export const TOGGLE_HOURLY_BLOCK = 'TOGGLE_HOURLY_BLOCK';
export const toggleHourlyBlock = createAction(TOGGLE_HOURLY_BLOCK);

export const TOGGLE_TIME_STEPS_BLOCK = 'TOGGLE_TIME_STEPS_BLOCK';
export const toggleTimeStepsBlock = createAction(TOGGLE_TIME_STEPS_BLOCK);

export const TOGGLE_SLEEP_BLOCK = 'TOGGLE_SLEEP_BLOCK';
export const toggleSleepBlock = createAction(TOGGLE_SLEEP_BLOCK);

export const RESET_BLOCK = 'RESET_BLOCK';
export const resetBlock = createAction(RESET_BLOCK);

export const TOGGLE_SLEEP_EXT = 'TOGGLE_SLEEP_EXT';
export const toggleSleepExt = createAction(TOGGLE_SLEEP_EXT)

export const SET_SLEEP_EXT_TIME = 'SET_SLEEP_EXT_TIME';
export const setSleepExtTime= createAction(SET_SLEEP_EXT_TIME);

export const DECREMENT_SLEEP_EXT = 'DECREMENT_SLEEP_EXT';
export const decrementSleepExt = createAction(DECREMENT_SLEEP_EXT);

export const TOGGLE_GAVE_UP = 'TOGGLE_GAVE_UP';
export const toggleGaveUp = createAction(TOGGLE_GAVE_UP);

export const TOGGLE_STAY_UP = 'TOGGLE_STAY_UP';
export const toggleStayUp = createAction(TOGGLE_STAY_UP);

export const TOGGLE_DISABLE = 'TOGGLE_DISABLE';
export const toggleDisable = createAction(TOGGLE_DISABLE);

export default handleActions({
  SET_BLOCK: (state, { payload }) => {
    return {...state, showBlock: true};
  },
  GIVE_UP: (state, { payload }) => {
    return {
      showBlock: false,
      hourlyBlock: false,
      timeStepsBlock: false,
      gaveUp: true,
      sleepBlock: false,
      stayUp: false,
      sleepExtension: false,
      sleepExtensionMin: 5,
      disable: false
    }
  },
  UNBLOCK: (state, { payload }) => {
    return initialState;
  },
  TOGGLE_HOURLY_BLOCK: (state, { payload }) => {
    return {...state, hourlyBlock: !state.hourlyBlock};
  },
  TOGGLE_TIME_STEPS_BLOCK: (state, { payload }) => {
    return {...state, timeStepsBlock: !state.timeStepsBlock};
  },
  TOGGLE_SLEEP_BLOCK: (state, { payload }) => {
    return {...state, sleepBlock: !state.sleepBlock};
  },
  TOGGLE_GAVE_UP: (state, { payload }) => {
    return {...state, gaveUp: !state.gaveUp};
  },
  TOGGLE_STAY_UP: (state, { payload }) => {
    return {...state, stayUp: !state.stayUp};
  },
  TOGGLE_DISABLE: (state, { payload }) => {
    return {...state, disable: !state.disable};
  },
  RESET_BLOCK: (state, { payload }) => {
    return initialState;
  },
  TOGGLE_SLEEP_EXT: (state, { payload }) => {
    return {...state, sleepExtension: !state.sleepExtension}
  },
  SET_SLEEP_EXT_TIME: (state, { payload }) => {
    return {...state, sleepExtensionMin: 5}
  },
  DECREMENT_SLEEP_EXT: (state, { payload }) => {
    return {...state, sleepExtensionMin: state.sleepExtensionMin-1}
  }

}, initialState);
