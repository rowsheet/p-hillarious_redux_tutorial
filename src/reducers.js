import { combineReducers } from 'redux'
import {
	SELECT_SUBREDDIT,
	RECEIVE_POSTS
} from './actions'

function selectedSubreddit(state = 'reactjs', action) {
	switch (action.type) {
		case SELECT_SUBREDDIT:
			return action.subreddit
		default:
			return state
	}
}

function posts(
	state = {
		isFetching: false,
		didInvalidate: false,
		items: []
	},
	action
) {
	switch (action.type) {
		case RECEIVE_POSTS:
			return Object.assign({}, state, {
				isFetching: false,
				didInvalidate: false,
				items: action.posts,
				lastUpdated: action.receivedAt
			})
		default:
			return state
	}
}

function postsBySubreddit(state = {}, action) {
	switch (action.type) {
		case RECEIVE_POSTS:
			return Object.assign({}, state, {
				[action.subreddit]: posts(state[action.subreddit], action)
			})
		default:
			return state
	}
}

const rootReducer = combineReducers({
	postsBySubreddit,
	selectedSubreddit
})

export default rootReducer
