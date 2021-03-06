import { connect } from 'react-redux';
import { createMapper, createActions } from '../input-helpers';
import { updateStrategy } from '../../store/strategy/actions';

import AddStrategy from './add-strategy';

const ID = 'edit-strategy';

function getId(props) {
    return [ID, props.strategy.name];
}

// TODO: need to scope to the active strategy
// best is to emulate the "input-storage"?
const mapStateToProps = createMapper({
    id: getId,
    getDefault: (state, ownProps) => ownProps.strategy,
    prepare: props => {
        props.editmode = true;
        return props;
    },
});

const prepare = (methods, dispatch, ownProps) => {
    methods.onSubmit = input => e => {
        e.preventDefault();
        // clean
        const parameters = (input.parameters || [])
            .filter(name => !!name)
            .map(({ name, type = 'string', description = '', required = false }) => ({
                name,
                type,
                description,
                required,
            }));

        updateStrategy({
            name: input.name,
            description: input.description,
            parameters,
        })(dispatch)
            .then(() => methods.clear())
            .then(() => ownProps.history.push(`/strategies/view/${input.name}`));
    };

    methods.onCancel = e => {
        e.preventDefault();
        methods.clear();
        ownProps.history.push(`/strategies/view/${ownProps.strategy.name}`);
    };

    return methods;
};

const actions = createActions({
    id: getId,
    prepare,
});

export default connect(mapStateToProps, actions)(AddStrategy);
