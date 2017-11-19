import React from 'react';

import TasksActions from '../actions/TasksActions';
import TasksStore from '../stores/TasksStore';
import TaskListsStore from '../stores/TaskListsStore';
import TaskListsActions from '../actions/TaskListsActions';

import TasksPage from '../components/TasksPage.jsx';

function getStateFromFlux() {
    return {
        tasks           : TasksStore.getTasks(),
        error           : TasksStore.getError(),
        activeList      : TaskListsStore.getActiveList() || {},
        isLoadingTasks  : TasksStore.isLoadingTasks()
    };
}

const TasksPageContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired        
    },

    getInitialState() {
        return {
            ...getStateFromFlux()
        };
    },

    componentWillMount() {
        const { id } = this.props.params;
        TasksActions.loadTasks(id);
        TaskListsActions.loadList(id);
    },

    componentDidMount() {
        TasksStore.addChangeListener(this._onChange);
        TaskListsStore.addChangeListener(this._onChange);
    },

    componentWillReceiveProps(nextProps) {
        const { id: nextId } = nextProps.params;
        if (this.props.params.id !== nextId) {
            TasksActions.loadTasks(nextId);
            TaskListsActions.loadList(nextId);
        }
    },

    componentWillUnmount() {
        TasksStore.removeChangeListener(this._onChange);
        TaskListsStore.removeChangeListener(this._onChange);
    },

    handleTaskStatusChange(params) {
        TasksActions.updateTaskStatus({ 
            taskListId: this.props.params.id,
            ...params 
        });
    },

    handleTaskCreate(task) {
        TasksActions.createTask({ 
            taskListId: this.props.params.id, 
            ...task 
        });
    },

    handleTaskUpdate(task) {
        TasksActions.updateTask({ 
            taskListId: this.props.params.id, 
            ...task 
        });
    },

    handleTaskDelete(taskId) {
        TasksActions.deleteTask({ 
            taskListId: this.props.params.id, 
            taskId 
        });
    },

    handleTaskSubmit(task) {        
        TasksActions.createTask({ 
            taskListId: this.props.params.id, 
            ...task 
        });
    },

    handleListUpdate({ name }) {
        TaskListsActions.updateTaskList({ 
            taskListId: this.props.params.id, 
            name 
        });
    },

    handleListDelete() {
        TaskListsActions.deleteTaskList(this.props.params.id); 
        this.context.router.push(`/lists`);
    },

    render() {
        const { tasks, activeList, isLoadingTasks, error } = this.state;

        return (
            <TasksPage 
                tasks={tasks}
                listName={activeList.name}
                onCreateTask={this.handleTaskCreate}
                onUpdateTask={this.handleTaskUpdate}
                onDeleteTask={this.handleTaskDelete}
                onUpdateList={this.handleListUpdate}
                onDeleteList={this.handleListDelete}
                onChangeStatusTask={this.handleTaskStatusChange}
                isLoadingTasks={isLoadingTasks}
                error={error}
            />
        );
    },

    _onChange() {
        this.setState(getStateFromFlux());
    }
});

export default TasksPageContainer;