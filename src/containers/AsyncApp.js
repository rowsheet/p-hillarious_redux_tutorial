import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
	selectSubreddit,
	fetchPostsIfNeeded,
} from '../actions'

class AsyncApp extends Component {

	/*----------------------------------------------------------------------
	Lifecycle:
	----------------------------------------------------------------------*/

	constructor(props) {
		super(props)
		this.handleChange = this.handleChange.bind(this)
		this.handleRefreshClick = this.handleRefreshClick.bind(this)
	}

	componentDidMount() {
		this.props.dispatch(
			fetchPostsIfNeeded(this.props.selectedSubreddit)
		)
	}

	componentDidUpdate(prevProps) {
		if (this.props.selectedSubreddit !== prevProps.selectedSubreddit) {
			var data = fetchPostsIfNeeded(this.props.selectedSubreddit)
			console.log("DATA:");
			console.log(data);
			this.props.dispatch(
				data
			)
		}
	}
	
	/*----------------------------------------------------------------------
	Event handlers:
	----------------------------------------------------------------------*/

	handleChange(nextSubreddit) {
		this.props.dispatch(selectSubreddit(nextSubreddit))
		this.props.dispatch(fetchPostsIfNeeded(nextSubreddit))
	}

	handleRefreshClick(e) {
		e.preventDefault()

		this.props.dispatch(fetchPostsIfNeeded(this.props.selectedSubreddit))
	}

	handleFoo(value) {
		console.log(value);
        }

	/*----------------------------------------------------------------------
	Render:
	----------------------------------------------------------------------*/

	render() {
		const { selectedSubreddit, posts, isFetching, lastUpdated } = this.props
		return (
			<div>
				<span>
					<h1>Subreddit: {selectedSubreddit}</h1>
					<select onChange={e => this.handleChange(e.target.value)}>
						{['reactjs', 'frontend'].map(subOption => (
							<option value={subOption} key={subOption}>
								{subOption}
							</option>
						))}
					</select>
					<input type="text" onChange={e => this.handleFoo(e.target.value)} />
				</span>
				<p>
					{lastUpdated && (
						<span>
							Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{' '}
						</span>
					)}
					{!isFetching && (
						<button onClick={this.handleRefreshClick}>Refresh</button>
					)}
				</p>
				{isFetching && posts.length === 0 && <h2>Loading...</h2>}
				{!isFetching && posts.length === 0 && <h2>Empty.</h2>}
				{posts.length > 0 && (
					<div style={{ opacity: isFetching ? 0.5 : 1 }}>
						<ul>
							{posts.map((post, i) => (
								<li key={i}>{post.title}</li>
							))}
						</ul>
					</div>
				)}
			</div>
		)
	}
}

AsyncApp.propTypes = {
	// These could be named anything.
	selectedSubreddit: PropTypes.string.isRequired,
	posts: PropTypes.array.isRequired,
	isFetching: PropTypes.bool.isRequired,
	lastUpdated: PropTypes.number,
	// You're always gonna get dispatch and subscribe.
	dispatch: PropTypes.func.isRequired,
//	subscribe: PropTypes.func.isRequired
}

function mapStateToProps(state) {
	const { selectedSubreddit, postsBySubreddit } = state
	const { isFetching, lastUpdated, items: posts } = postsBySubreddit[
		selectedSubreddit
	] || {
		isFetching: true,
		items: []
	}

	return {
		selectedSubreddit,
		posts,
		isFetching,
		lastUpdated
	}
}

export default connect(mapStateToProps)(AsyncApp)
