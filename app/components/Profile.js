/**
 * @jsx React.DOM
 */

import React from "react"
import Repos from "./Github/Repos"
import UserProfile from "./Github/UserProfile"
import Notes from "./Notes/Notes"
import helpers from "../utils/helpers"
import Rebase from "re-base"

const base = Rebase.createClass("https://profile-notetaker.firebaseio.com/")

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [],
      bio: {},
      repos: [],
    }
  }

  componentWillMount() {
    this.router = this.context.router
  }

  componentDidMount() {
    this.init()
  }

  componentWillReceiveProps() {
    base.removeBinding(this.ref)
    this.init()
  }

  componentWillUnmount() {
    base.removeBinding(this.ref)
  }

  init() {
    const username = this.router.getCurrentParams().username
    this.ref = base.bindToState(username, {
      context: this,
      asArray: true,
      state: "notes",
    })

    helpers.getGithubInfo(username)
    .then((dataObj) => {
      this.setState({
        bio: dataObj.bio,
        repos: dataObj.repos,
      })
    })
  }

  handleAddNote(newNote) {
    base.post(this.router.getCurrentParams().username, {
      data: this.state.notes.concat([newNote]),
    })
  }

  render() {
    const username = this.router.getCurrentParams().username
    return (
      <div className="row">
        <div className="col-md-4">
          <UserProfile username={username} bio={this.state.bio} />
        </div>
        <div className="col-md-4">
          <Repos username={username} repos={this.state.repos} />
        </div>
        <div className="col-md-4">
          <Notes
            username={username}
            notes={this.state.notes}
            addNote={this.handleAddNote.bind(this)} />
        </div>
      </div>
    )
  }
}

Profile.contextTypes = {
  router: React.PropTypes.func.isRequired,
}

export default Profile
