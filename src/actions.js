import fetch from 'cross-fetch'

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'

export function selectSubreddit(subreddit) {
	return {
		type: SELECT_SUBREDDIT,
		subreddit
	}
}

function receivePosts(subreddit, json) {
	return {
		type: RECEIVE_POSTS,
		subreddit,
		posts: json.data.children.map(child => child.data),
		receivedAt: Date.now()
	}
}

export function fetchPostsIfNeeded(subreddit) {
	return (dispatch, getState) => {
		// Check if there are posts for this subreddit.
		// Those will be located in the state.postsBySubredit['subreddit_name'].
		if (subreddit in getState().postsBySubreddit) {
			// Do nothing.
			return;
		}
		// Get new posts.
		return dispatch(post_dispatch => {
			// First dispatch the request for the post.
			return fetch(`https://www.reddit.com/r/${subreddit}.json`)
				.then(response => response.json())
				.then(json => post_dispatch(receivePosts(subreddit, json)))
		});
	}
}
