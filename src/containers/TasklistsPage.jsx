import React from 'react';

import TaskListsStore from '../stores/TaskListsStore';
import TaskListsActions from '../actions/TaskListsActions';

import TasklistsPage from '../components/TasklistsPage.jsx';
import TaskListCreateModal from '../components/TaskListCreateModal.jsx';
import TaskListEditModal from '../components/TaskListEditModal.jsx';

function getStateFromFlux() {
    return {
        taskLists: TaskListsStore.getTaskLists()
    };
}

const TasklistsPageContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired        
    },

    getInitialState() {
        return {
            ...getStateFromFlux(),
            isCreatingTaskList: false
        };
    },

    componentWillMount() {
        TaskListsActions.loadTaskLists();
    },

    componentDidMount() {
        TaskListsStore.addChangeListener(this._onChange);
    },

    componentWillUnmount() {
        TaskListsStore.removeChangeListener(this._onChange);
    },

    handleAddTaskList() {
        this.setState({ isCreatingTaskList : true });
    },


    handleTaskListSubmit(taskList) {
        TaskListsActions.createTaskList(taskList);

        this.setState({ isCreatingTaskList : false });
    },

    handleOpenTaskList(listId) {
        this.context.router.push(`/lists/${listId}`);
    },

    cancelCreatingTaskList() {
        this.setState({ isCreatingTaskList: false });
    },

    render() {
        const { taskLists, isCreatingTaskList } = this.state;

        return (
            <div>
                <TasklistsPage 
                    onCreateNewList={this.handleAddTaskList}
                    onEditList={this.handleOpenEditListModal}
                    onLogOut={this.handleLogOut}
                    page={this.props.children}
                    taskLists={taskLists}
                    activeListId={this.props.params.id}
                />
                <TaskListCreateModal
                    isOpen={isCreatingTaskList}
                    onSubmit={this.handleTaskListSubmit}
                    onClose={this.cancelCreatingTaskList}
                />
            </div>
        );
    },

    _onChange() {
        this.setState(getStateFromFlux());
    }
});

export default TasklistsPageContainer;