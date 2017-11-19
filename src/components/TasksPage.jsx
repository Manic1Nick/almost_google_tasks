import React from 'react';

import IconButton from 'material-ui/lib/icon-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import EditorModeEdit from 'material-ui/lib/svg-icons/editor/mode-edit';
import ActionDelete from 'material-ui/lib/svg-icons/action/delete';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';

import Task from './Task.jsx';
import TaskCreateModal from './TaskCreateModal.jsx';
import TaskEditModal from './TaskEditModal.jsx';
import TasksPageHeader from './TasksPageHeader.jsx';

import './TasksPage.less';

const ENTER_KEY = 13;
const ESC_KEY = 27;

const TasksPage = React.createClass({
    getInitialState() {
        return {
            isCreatingTask      : false,
            taskEditableId      : ''
        };
    },

    handleTaskCreate(task) {
        this.props.onCreateTask(task);

        this.cancelCreatingTask();
    },

    handleTaskUpdate(task) {
        this.props.onUpdateTask(task);

        this.cancelUpdatingTask();
    },

    handleTaskEdit(taskId) {
        this.setState({ taskEditableId: taskId });
    },

    handleTaskDelete(taskId) {
        this.props.onDeleteTask(taskId);
    },

    handleAddTask() {
        this.setState({ isCreatingTask: true });
    },

    cancelCreatingTask() {
        this.setState({ isCreatingTask: false });
    },

    cancelUpdatingTask() {
        this.setState({ taskEditableId: '' });
    },

    cancelEditingListName() {
        this.setState({ 
            isEditingListName: false,
            listName: this.props.listName 
        });
    },
    
    saveListName({ name }) {
        this.props.onUpdateList({ name });
        
        this.cancelEditingListName();
    },

    handleDeleteList() {
        const isConfirmed = confirm(
            'Are you sure you want delete this task list? All tasks in it will be deleted too'
        );

        if (isConfirmed) this.props.onDeleteList();
    },

    handleStatusChange(taskId, { isCompleted }) {
        this.props.onChangeStatusTask({
            taskId      : taskId,
            isCompleted : isCompleted
        });
    },

    renderTasks() {
        return (
            <div className='TasksPage__tasks'>
                {
                    this.props.tasks.map(task =>
                        <Task
                            key={task.id}
                            text={task.text}
                            notes={task.notes}
                            due={task.due}
                            isCompleted={task.isCompleted}
                            updated={task.updated}
                            onStatusChange={this.handleStatusChange.bind(null, task.id)}
                            onDelete={this.handleTaskDelete.bind(null, task.id)}
                            onEdit={this.handleTaskEdit.bind(null, task.id)}
                        />
                    )
                }
            </div>
        );
    },

    render() {
        const { isCreatingTask, taskEditableId } = this.state;
        const { tasks, listName, isLoadingTasks, error } = this.props;

        const taskEditable = taskEditableId ? tasks.find(task => task.id === taskEditableId) : {} ;
        const isEditingTask = Object.keys(taskEditable).length > 0;

        if (error) {
        	return (
        		<div className='TasksPage'>
        			<div className='TasksPage__error'>
                        { error }
                    </div>
        		</div>
        	);
        }

        return (
            <div className='TasksPage'>
                <TasksPageHeader 
                    listName={listName}
                    onDeleteList={this.handleDeleteList}
                    onAddTask={this.handleAddTask}
                    onSaveListName={this.saveListName}
                />

                <TaskCreateModal
                    isOpen={ isCreatingTask }
                    onSubmit={this.handleTaskCreate}
                    onClose={this.cancelCreatingTask}
                />
                <TaskEditModal
                    isOpen={ isEditingTask }
                    taskEditable={ taskEditable }
                    onEdit={this.handleTaskUpdate}
                    onClose={this.cancelUpdatingTask}
                    onDelete={this.handleTaskDelete}
                />

                {
                    isLoadingTasks 
                ? 
                    <RefreshIndicator
                        size={50}
                        left={70}
                        top={0}
                        loadingColor={"#FF9800"}
                        status="loading"
                        style={{ display: 'inline-block', position: 'relative' }}
                    />
                : 
                    this.renderTasks()
                }
            </div>
        );
    }
});

export default TasksPage;