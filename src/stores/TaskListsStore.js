import { EventEmitter } from 'events';

import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

const CHANGE_EVENT = 'change';

let _taskLists = [];
let _activeList = null;
let _error = null;

function formatTaskList(data) {
    return {
        id   : data.id,
        name : data.title
    };
}

const TaskListsStore = Object.assign({}, EventEmitter.prototype, {
    getTaskLists() {
        return _taskLists;
    },

    getActiveList() {
        return _activeList;
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
        case AppConstants.TASK_LISTS_LOAD_SUCCESS: {
            _taskLists = action.items.map(formatTaskList);

            TaskListsStore.emitChange();
            break;
        }

        case AppConstants.TASK_LISTS_LOAD_FAIL: {
            _taskLists = [];
            _error = action.error;

            TaskListsStore.emitChange();
            break;
        }

        case AppConstants.TASK_LIST_CREATE_SUCCESS: {
            const newTaskList = formatTaskList(action.taskList);
            _taskLists.push(newTaskList);

            TaskListsStore.emitChange();
            break;
        }

        case AppConstants.TASK_LIST_CREATE_FAIL: {
            _error = action.error;

            TaskListsStore.emitChange();
            break;
        }

        case AppConstants.TASK_LIST_DELETE_SUCCESS: {
            const deleteListIndex = _taskLists.findIndex(list => list.id === action.listId);
            _taskLists.splice(deleteListIndex, 1);

            TaskListsStore.emitChange();
            break;
        }

        case AppConstants.TASK_LIST_DELETE_FAIL: {
            _error = action.error;

            TaskListsStore.emitChange();
            break;
        }

        case AppConstants.TASK_LIST_UPDATE_SUCCESS: {
            const updatedListIndex = _taskLists.findIndex(list => list.id === action.list.id);
            _taskLists[updatedListIndex] = formatTaskList(action.list);

            _activeList = formatTaskList(action.list);

            TaskListsStore.emitChange();
            break;
        }

        case AppConstants.TASK_LIST_UPDATE_FAIL: {
            _error = action.error;

            TaskListsStore.emitChange();
            break;
        }

        case AppConstants.TASK_LIST_LOAD_SUCCESS: {
            _activeList = formatTaskList(action.list);

            TaskListsStore.emitChange();
            break;
        }

        default: {
        }
    }
});

export default TaskListsStore;