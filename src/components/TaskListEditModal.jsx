import React from 'react';

import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import DatePicker from 'material-ui/lib/date-picker/date-picker';

const TaskListEditModal = React.createClass({
    getInitialState() {
        return {
            listId: '',
            listName : ''
        };
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.listId !== nextProps.listId) {
            const { listId, listName } = nextProps;

            this.setState({ listId, listName });
        }
    },

    handleDelete() {
        const { onClose, onDelete } = this.props;

        if (onDelete) onDelete();
        if (onClose) onClose();

        this.setState({ listId: '', listName : '' });
    },

    handleClose() {
        const { onClose } = this.props;
        if (onClose) onClose();

        this.setState({ listId: '', listName : '' });
    },

    handleEdit() {
        const { onEdit } = this.props;
        const { listId, listName } = this.state;

        if (onEdit) onEdit({ listId, listName });

        this.setState({ listId: '', listName : '' });
    },

    handleListNameChange(e) {
        this.setState({ listName: e.target.value });
    },

    render() {
        const { isOpen } = this.props;
        let { listName } = this.state;

        return (
            <Dialog
                className='TaskListEditModal'
                contentStyle={{ maxWidth: 400 }}
                actions={[
                    <FlatButton
                        label='Delete'
                        onTouchTap={this.handleDelete}
                    />,
                    <FlatButton
                        label='Cancel'
                        onTouchTap={this.handleClose}
                    />,
                    <FlatButton
                        primary
                        label='Edit'
                        disabled={!listName}
                        onTouchTap={this.handleEdit}
                    />
                ]}
                open={ isOpen }
                onRequestClose={this.handleClose}
            >
                <h3 className='TaskListEditModal__modal-title'>Edit tasks list</h3>
                <TextField
                    fullWidth
                    ref={c => this.taskInput = c}
                    value={ listName }
                    onChange={this.handleListNameChange}
                    floatingLabelText='Edit list name'
                />
            </Dialog>
        );
    }
});

export default TaskListEditModal;