import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

/* ------------------    ACTIONS    --------------------- */

const LOGIN_USER = 'LOGIN_USER';
const LOGOUT_USER = 'LOGOUT_USER';
const ADD_ACHIEVEMENT = 'ADD_ACHIEVEMENT';
const RESET_STREAK = 'RESET_STREAK';
const INCREMENT_STREAK = 'INCREMENT_STREAK';
const GET_DAILY_STEPS = 'GET_DAILY_STEPS';
const GET_WEEKLY_STEPS = 'GET_WEEKLY_STEPS';
const GET_HOURLY_STEPS = 'GET_HOURLY_STEPS';
const RESET_LAST_STEPS = 'RESET_LAST_STEPS';
const TOTAL_STEPS = 'TOTAL_STEPS';

/* --------------    ACTION CREATORS    ----------------- */

export const loginUser = createAction(LOGIN_USER);

export const logoutUser = createAction(LOGOUT_USER);

export const addNewAchievement = createAction(ADD_ACHIEVEMENT);

export const resetStreak = createAction(RESET_STREAK);

export const incrementStreak = createAction(INCREMENT_STREAK);

export const resetLastSteps = createAction(RESET_LAST_STEPS);

const getDailySteps = createAction(GET_DAILY_STEPS);

const getWeeklySteps = createAction(GET_WEEKLY_STEPS);

const getHourlySteps = createAction(GET_HOURLY_STEPS);

export const incrementTotalSteps = createAction(TOTAL_STEPS);

/* ------------------    REDUCER    --------------------- */

const initialState = {
  accessToken: '',
  badges: [],
  streak: 0,
  steps: 0,
  lastSteps: 0,
  weeklySteps: [],
  totalSteps: 0
};

export default handleActions({
  LOGIN_USER: (state, { payload }) => {
    return {...state, accessToken: payload };
  },
  LOGOUT_USER: (state) => {
    return {...state, accessToken: '' };
  },
  ADD_ACHIEVEMENT: (state, { payload }) => {
    return {...state, badges: [...state.badges, payload]};
  },
  RESET_STREAK: (state) => {
    return {...state, streak: 0 };
  },
  INCREMENT_STREAK: (state) => {
    return {...state, streak: ++state.streak }
  },
  GET_DAILY_STEPS: (state, { payload }) => {
    if (state.lastSteps) return {...state, steps: payload };
    else return {...state, lastSteps: payload, steps: payload };
  },
  GET_WEEKLY_STEPS: (state, { payload }) => {
    return {...state, weeklySteps: payload };
  },
  GET_HOURLY_STEPS: (state, { payload }) => {
    return {...state, hourlySteps: payload };
  },
  RESET_LAST_STEPS: (state) => {
    return {...state, lastSteps: state.steps };
  },
  TOTAL_STEPS: (state) => {
    return {...state, totalSteps: state.totalSteps + state.steps }
  }
}, initialState);

/* ------------------    THUNKS    --------------------- */

export const getDailyThunk = () =>
  (dispatch, getState) => {
    let { accessToken } = getState().user;
    let d = new Date();
    let date = d.toISOString().slice(0, 10);
    return axios.get(`https://api.fitbit.com/1/user/-/activities/date/${date}.json`,
      { headers: {'Authorization': 'Bearer ' + accessToken}})
    .then(response => {
      dispatch(getDailySteps(response.data.summary.steps));
    })
  };

export const getWeeklyThunk = () =>
  (dispatch, getState) => {
    let { accessToken } = getState().user;
    return axios.get(`https://api.fitbit.com/1/user/-/activities/steps/date/today/1w.json`,
      { headers: {'Authorization': 'Bearer ' + accessToken}})
    .then(response => {
      console.log(response.data);
      let steps = response.data[`activities-steps`].map(activity => {
        return activity.value;
      });
      console.log(steps);
      dispatch(getWeeklySteps(steps));
    })
  };


/**
** intraday actiity data. need permission from fitbit..
export const getHourlyThunk = () =>
  (dispatch, getState) => {
    let { accessToken } = getState().user;
    console.log('gethourly thunk access token', accessToken)
    return axios.get(`https://api.fitbit.com/1/user/-/activities/tracker/steps/date/today/1d/15min/time/10:30/10:45.json`,
      { headers: {'Authorization': 'Bearer ' + accessToken}})
    .then(response => {
      console.log(response.data);
      dispatch(getHourlySteps(response.data));
    })
  };
*/
