import { EventEmitter } from 'events';

import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

const CHANGE_EVENT = 'change';

let _tasks = [];
let _isLoadingTasks = false;
let _error = null;

function formatTask(data) {
    return {
        id          : data.id,
        text        : data.title,
        notes       : data.notes,
        updated     : data.updated,
        due         : data.due || null,//data.due ? new Date(data.due) : '',
        isCompleted : data.status === 'completed',
        position    : data.position
    };
}

function getErrorMessageByCode(code) {
    const errorMessages = {
        400: 'Cannot load task list'
    };

    return errorMessages[code] || 'Something had happened';
}

const TasksStore = Object.assign({}, EventEmitter.prototype, {
    getTasks() {
        return _tasks;
    },

    getError() {
        return _error;
    },

    isLoadingTasks() {
        return _isLoadingTasks;
    },

    emitChange() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

AppDispatcher.register(function(action) {
    switch(action.type) {
        case AppConstants.TASKS_LOAD_REQUEST: {
            _tasks = [];
            _error = null;
            _isLoadingTasks = true;

            TasksStore.emitChange();
            break;
        }

        case AppConstants.TASKS_LOAD_SUCCESS: {
            _tasks = action.items.map(formatTask);
            _error = null;
            _isLoadingTasks = false;

            TasksStore.emitChange();
            break;
        }

        case AppConstants.TASKS_LOAD_FAIL: {
            _tasks = [];
            _error = getErrorMessageByCode(action.error.code);
            _isLoadingTasks = false;

            TasksStore.emitChange();
            break;
        }

        case AppConstants.TASK_UPDATE_REQUEST: {
            const updatedTaskIndex = _tasks.findIndex(task => task.id === action.taskId);

            if (action.isCompleted !== undefined) _tasks[updatedTaskIndex].isCompleted = action.isCompleted;
            if (action.title) _tasks[updatedTaskIndex].title = action.title;
            if (action.notes) _tasks[updatedTaskIndex].notes = action.notes;
            if (action.due) _tasks[updatedTaskIndex].due = action.due;

            TasksStore.emitChange();
            break;
        }

        case AppConstants.TASK_UPDATE_SUCCESS: {
            const updatedTaskIndex = _tasks.findIndex(task => task.id === action.task.id);
            _tasks[updatedTaskIndex] = formatTask(action.task);

            TasksStore.emitChange();
            break;
        }

        case AppConstants.TASK_CREATE_SUCCESS: {
            const newTask = formatTask(action.task);            
            _tasks.unshift(newTask);

            TasksStore.emitChange();
            break;
        }

        case AppConstants.TASK_DELETE_SUCCESS: {
            const deletedTaskIndex = _tasks.findIndex(task => task.id === action.taskId);
            _tasks.splice(deletedTaskIndex, 1);

            TasksStore.emitChange();
            break;
        }

        default: {
        }
    }
});

export default TasksStore;