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

import './TasksPageHeader.less';

const ENTER_KEY = 13;
const ESC_KEY = 27;

const TasksPageHeader = React.createClass({
    getInitialState() {
        return {
            isEditingListName: false,
            isDisabledSave: false
        };
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.listName !== nextProps.listName) {
            this.cancelEditingListName();
        }
    },

    handleAddTask() {
        this.props.onAddTask();
    },

    handleEditListName() {
        this.setState({ isEditingListName: true }, this.focusInput);
    },

    cancelEditingListName() {
        this.setState({ 
            isEditingListName: false, 
            isDisabledSave: false 
        });
    },

    handleListNameEditKeyDown(e) {
        if (e.keyCode === ENTER_KEY && this.state.isDisabledSave) { 
            alert('Please enter valid list name');

        } else if (e.keyCode === ENTER_KEY) { 
            this.handleSaveListName();
            
        } else if (e.keyCode === ESC_KEY) { 
            this.cancelEditingListName();
        }
    },

    handleUpdateListName(e) {
        this.setState({ isDisabledSave: !this.listName.value });
    },
    
    handleSaveListName() {
        this.props.onSaveListName({ name: this.listName.value });
        
        this.cancelEditingListName();
    },

    focusInput() {
        this.listName.focus();
    },

    handleDeleteList() {
        const isConfirmed = confirm(
            'Are you sure you want delete this task list? All tasks in it will be deleted too'
        );

        if (isConfirmed) this.props.onDeleteList();
    },

    render() {
        const { isDisabledSave, isEditingListName } = this.state;
        const { listName, onDeleteList, onAddTask } = this.props;

        return (
            <div className='TasksPage'>
                <div className='TasksPage__header'>
                    {
                        isEditingListName
                    ?
                        <div className='ListName editing'>
                            <input
                                className='ListName__text-input'
                                type='text'
                                defaultValue={listName}
                                onKeyDown={this.handleListNameEditKeyDown}
                                ref={c => this.listName = c}
                                //onBlur={this.cancelEditingListName}
                                onChange={this.handleUpdateListName}
                            />
                            <div className='ListName__toolbar'>
                                <RaisedButton 
                                    primary 
                                    onClick={this.handleSaveListName} 
                                    label='Save' 
                                    disabled={isDisabledSave} 
                                />
                                <FlatButton 
                                    onClick={this.cancelEditingListName} 
                                    label='Cancel' 
                                />
                            </div>
                        </div>
                    :
                        <h2
                            className='TasksPage__title'
                            onClick={this.handleEditListName}
                        >
                            {listName}
                        </h2>
                    }
                    <div className='TasksPage__tools'>
                        <IconButton onClick={this.handleEditListName}>
                            <EditorModeEdit />
                        </IconButton>
                        <IconButton onClick={this.handleDeleteList}>
                            <ActionDelete />
                        </IconButton>
                        <IconButton onClick={this.handleAddTask}>
                            <ContentAdd />
                        </IconButton>
                    </div>
                </div>
            </div>
        );
    }
});

export default TasksPageHeader;