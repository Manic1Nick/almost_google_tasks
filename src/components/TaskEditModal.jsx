import React from 'react';

import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import DatePicker from 'material-ui/lib/date-picker/date-picker';

const TaskEditModal = React.createClass({
    getInitialState() {
        return {
            taskId: '',
            text : '',
            notes: '',
            due: null
        };
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.taskEditable !== nextProps.taskEditable) {
            const { id, text, notes, due } = nextProps.taskEditable;

            this.setState({ taskId: id, text, notes, due });
        }
    },

    handleDelete() {
        const { onClose, onDelete } = this.props;

        if (onDelete) onDelete(this.state.taskId);
        if (onClose) onClose();

        this.setState({ taskId: '', text: '', notes: '', due: null });
    },

    handleClose() {
        const { onClose } = this.props;

        this.setState({ taskId: '', text: '', notes: '', due: null });

        if (onClose) onClose();
    },

    handleEdit() {
        const { onEdit } = this.props;
        const { taskId, text, notes, due } = this.state;

        if (onEdit) onEdit({ taskId, text, notes, due });

        this.setState({ taskId: '', text: '', notes: '', due: null });
    },

    handleTextChange(e) {
        this.setState({ text: e.target.value });
    },

    handleNotesChange(e) {
        this.setState({ notes: e.target.value });
    },

    handleDueChange(e, date) {
        this.setState({ due: date });
    },

    render() {
        const { isOpen } = this.props;
        let { text, notes, due } = this.state;
        due = due != null ? new Date(due) : null;

        return (
            <Dialog
                className='TaskCreateModal'
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
                        disabled={!text}
                        onTouchTap={this.handleEdit}
                    />
                ]}
                open={isOpen}
                onRequestClose={this.handleClose}
            >
                <h3 className='TaskCreateModal__modal-title'>Edit task</h3>
                <TextField
                    fullWidth
                    ref={c => this.taskInput = c}
                    value={text}
                    onChange={this.handleTextChange}
                    floatingLabelText='Edit description'
                />
                <TextField
                    fullWidth
                    ref={c => this.taskInput = c}
                    value={notes}
                    onChange={this.handleNotesChange}
                    floatingLabelText='Edit notes'
                />
                <DatePicker
                    fullWidth
                    ref={c => this.taskInput = c}
                    value={due}
                    onChange={this.handleDueChange}
                    hintText="Enter due date"
                    autoOk={true}
                />
            </Dialog>
        );
    }
});

export default TaskEditModal;