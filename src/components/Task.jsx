import React from 'react';

import Checkbox from 'material-ui/lib/checkbox';
import ListItem from 'material-ui/lib/lists/list-item';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import DatePicker from 'material-ui/lib/date-picker/date-picker';

import DeleteIcon from 'material-ui/lib/svg-icons/action/delete';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

import './Task.less';

const ENTER_KEY = 13;
const ESC_KEY = 27;

const Task = React.createClass({
    handleCheck() {
        this.props.onStatusChange({
            isCompleted: !this.props.isCompleted
        });
    },

    render() {
        const { text, notes, due, isCompleted, updated, onDelete, onEdit } = this.props;
        let styleText = { textDecoration: isCompleted ? 'line-through' : '' };

        let task_due = this._leftDays(isCompleted, updated, due);

        return (
            <div className='Task'>
                <Checkbox
                    className='Task__checkbox'
                    checked={ isCompleted }
                    onCheck={this.handleCheck}
                />
                <div className='Task__text' onClick={ onEdit }>
                    <div className='Task__title' style={styleText}>{text}</div>
                    <div className='Task__notes'>{ notes }</div>
                    <div className='Task__due' style={task_due.style}>{task_due.message}</div>
                </div>
                <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
                    <MenuItem onClick={ onEdit }>Edit</MenuItem>
                    <MenuItem onClick={ onDelete }>Delete</MenuItem>
                </IconMenu>
            </div>
        );
    },

    _leftDays(isCompleted, updated, due) {
        let response = { 
            style: {}, 
            message: 'due is not set'
        }

        if (isCompleted) {
            response.style = {color: 'green'};
            response.message = 'task completed';
        
        } else if (!isCompleted && due != null) {
            let days = Math.round((new Date(due).getTime() - new Date(updated).getTime())/1000/60/60/24);
            response.style = days >= 0 ? {color: 'orange'} : {color: 'red'} ;            
            response.message = days >= 0 ? `${days} days left...` : 'overdue task' ;
        }
        return response;
    }
});

export default Task;