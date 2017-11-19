import React from 'react';

import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import DatePicker from 'material-ui/lib/date-picker/date-picker';

const TaskCreateModal = React.createClass({
    getInitialState() {
        return {
            text : '',
            notes: '',
            due: null
        };
    },

    handleClose() {
        const { onClose } = this.props;

        this.setState({ text: '', notes: '', due: null });

        if (onClose) {
            onClose();
        }
    },

    handleSubmit() {
        const { onSubmit } = this.props;
        const { text, notes, due } = this.state;

        if (onSubmit) {
            onSubmit({ text, notes, due });
        }

        this.setState({ text: '', notes: '', due: null });
    },

    handleTextChange(e) {
        this.setState({
            text: e.target.value
        });
    },

    handleNotesChange(e) {
        this.setState({
            notes: e.target.value
        });
    },

    handleDueChange(e, date) {
        this.setState({
            due: date
        });
    },

    render() {
        let { text, notes, due } = this.state;
        const { isOpen } = this.props;

        return (
            <Dialog
                className='TaskCreateModal'
                contentStyle={{ maxWidth: 400 }}
                actions={[
                    <FlatButton
                        label='Cancel'
                        onTouchTap={this.handleClose}
                    />,
                    <FlatButton
                        primary
                        label='Submit'
                        disabled={!text}
                        onTouchTap={this.handleSubmit}
                    />
                ]}
                open={isOpen}
                onRequestClose={this.handleClose}
            >
                <h3 className='TaskCreateModal__modal-title'>Add task</h3>
                <TextField
                    fullWidth
                    ref={c => this.taskInput = c}
                    value={text}
                    onChange={this.handleTextChange}
                    hintText='e.g. buy a bottle of milk'
                    floatingLabelText='Enter task description'
                />
                <TextField
                    fullWidth
                    ref={c => this.taskInput = c}
                    value={notes}
                    onChange={this.handleNotesChange}
                    hintText='e.g. 1 liter'
                    floatingLabelText='Add notes...'
                />
                <DatePicker
                    ref={c => this.taskInput = c}
                    value={ due }
                    onChange={this.handleDueChange}
                    hintText="Enter due date" 
                    autoOk={true}
                />
            </Dialog>
        );
    }
});

export default TaskCreateModal;