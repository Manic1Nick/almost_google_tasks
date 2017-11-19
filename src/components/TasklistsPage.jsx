import React from 'react';

import TaskListsStore from '../stores/TaskListsStore';
import TaskListsActions from '../actions/TaskListsActions';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import ListIcon from 'material-ui/lib/svg-icons/action/view-list';
import HomeIcon from 'material-ui/lib/svg-icons/action/home';
import ExitIcon from 'material-ui/lib/svg-icons/action/exit-to-app';
import FolderIcon from 'material-ui/lib/svg-icons/file/folder';
import AddIcon from 'material-ui/lib/svg-icons/content/add';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

import './TasklistsPage.less';

const TasklistsPage = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired        
    },

    renderTaskLists() {
        const { taskLists, activeListId } = this.props;
        return (
            taskLists.map(list =>
                <ListItem
                    key={list.id}
                    leftIcon={<FolderIcon />}
                    //leftIcon={<FolderIcon color={ activeListId == list.id ? 'blue' : '' }/>}
                    primaryText={list.name}
                    style={ activeListId === list.id ? { backgroundColor: 'rgba(0,0,0,0.1)' } : null }
                    //style={{ fontWeight: activeListId == list.id ? 'bold' : '' }}
                    onClick={this.context.router.push.bind(null, `/lists/${list.id}`)}
                />
            )
        );
    },

    render() {
        const { router } = this.context;
        const { onCreateNewList, onLogOut, page } = this.props;
        return (
            <div className='TasklistsPage'>
                <div className='TasklistsPage__menu'>
                    <List className='TasklistsPage__list'>
                        <h3 className='TasklistsPage__title'>Almost Google Tasks</h3>

                        <Divider />
                        <List className='TasklistsPage__list'>
                            <ListItem
                                leftIcon={<HomeIcon />}
                                primaryText="Home"
                                onClick={router.push.bind(null, `/lists`)}
                            />
                            <ListItem
                                leftIcon={<ListIcon />}
                                primaryText="About"
                                onClick={router.push.bind(null, `/about`)}
                            />
                        </List>

                        <Divider />
                        <List className='TasklistsPage__list' subheader="Task Lists">
                            {
                                this.renderTaskLists()
                            }
                            <ListItem
                                leftIcon={<AddIcon />}
                                primaryText="Create new list"
                                onClick={onCreateNewList}
                            />
                        </List>

                        <Divider />
                        <List className='TasklistsPage__list'>
                            <ListItem
                                leftIcon={<ExitIcon />}
                                primaryText="Log out"
                                onClick={onLogOut}
                            />
                        </List>
                    </List>
                </div>
                <div className='TasklistsPage__tasks'>
                    {page}
                </div>
            </div>
        );
    }
});

export default TasklistsPage;