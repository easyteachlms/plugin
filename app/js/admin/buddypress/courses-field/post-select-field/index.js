import { useEffect, useState } from '@wordpress/element';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const { api } = window.wp;

const arrayMove = (array, from, to) => {
    array = array.slice();
    array.splice(0 > to ? array.length + to : to, 0, array.splice(from, 1)[0]);
    return array;
};

const SortableMultiValue = SortableElement((props) => {
    // this prevents the menu from being opened/closed when the user clicks
    // on a value to begin dragging it. ideally, detecting a click (instead of
    // a drag) would still focus the control and toggle the menu, but that
    // requires some magic with refs that are out of scope for this example
    const onMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const innerProps = { onMouseDown };
    return <components.MultiValue {...props} innerProps={innerProps} />;
});
const SortableSelect = SortableContainer(AsyncSelect);

const PostsMultiSelectField = ({ postType, horizontal = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedTokens, setSelectedTokens] = useState([]);

    const promiseOptions = (searchTerm) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const collection = new api.collections[postType]();
                collection
                    .fetch({ data: { search: searchTerm } })
                    .then((matched) => {
                        console.log('matched?', searchTerm, matched);

                        const available = [];
                        matched.forEach((p) => {
                            available.push({
                                value: p.id,
                                label: p.title.rendered,
                            });
                        });
                        console.log('available?', available);

                        resolve(available);
                    });
            }, 1000);
        });
    };

    const onChange = (selectedOptions) => setSelectedTokens(selectedOptions);

    const onInputChange = (newValue) => {
        console.log('onInputChange?', newValue);
        const inputVal = newValue.replace(/\W/g, '');
        setInputValue(inputVal);
        return inputVal;
    };

    const onSortEnd = ({ oldIndex, newIndex }) => {
        const newValue = arrayMove(selectedTokens, oldIndex, newIndex);
        setSelectedTokens(newValue);
        console.log(
            'Values sorted:',
            newValue.map((i) => i.value),
        );
    };

    return (
        <SortableSelect
            // react-sortable-hoc props:
            axis={true === horizontal ? 'x' : 'y'}
            onSortEnd={onSortEnd}
            distance={4}
            // small fix for https://github.com/clauderic/react-sortable-hoc/pull/352:
            getHelperDimensions={({ node }) => node.getBoundingClientRect()}
            // react-select props:
            isMulti
            // value={selectedTokens}
            onChange={onChange}
            inputValue={inputValue}
            onInputChange={onInputChange}
            components={{
                MultiValue: SortableMultiValue,
            }}
            loadOptions={promiseOptions}
            closeMenuOnSelect={false}
        />
    );
};

export default PostsMultiSelectField;
