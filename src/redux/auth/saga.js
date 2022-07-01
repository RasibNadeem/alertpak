
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import ApiCall from '../../config/network';
import Url from '../../config/api';
import {
    LOGIN_USER,
    LOGOUT_USER,
} from '../actions';

import {
    loginUserSuccess,
    loginUserError,
} from './actions';


export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

const loginWithEmailPasswordAsync = async (email, password) => {
    await ApiCall.post(Url.LOGIN_USER, {
        email, password
    })
        .then(authUser => authUser)
        .catch(error => error);
}




function* loginWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    const { history } = payload;
    try {
        const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
        if (!loginUser.message) {
            localStorage.setItem('userToken', loginUser.user.uid);
            yield put(loginUserSuccess(loginUser.user));
            history.push('/');
        } else {
            yield put(loginUserError(loginUser.message));
        }
    } catch (error) {
        yield put(loginUserError(error));

    }
}




export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
};

const logoutAsync = async (history) => {
    // await auth.signOut().then(authUser => authUser).catch(error => error);
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    history.push('/user/login')
};

function* logout({ payload }) {
    const { history } = payload
    try {
        yield call(logoutAsync, history);

    } catch (error) {
    }
};


export default function* rootSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser),
    ]);
}