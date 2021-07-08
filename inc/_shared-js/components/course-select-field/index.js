/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { FormTokenField } from '@wordpress/components';
import { useEffect, useState, Fragment } from '@wordpress/element';

// Hook
function useDebounce(value, delay) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
      () => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        // Cancel the timeout if value changes (also on delay change or unmount)
        // This is how we prevent debounced value from updating if value is changed ...
        // .. within the delay period. Timeout gets cleared and restarted.
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay] // Only re-call effect if value or delay changes
    );
    return debouncedValue;
}

function doSearch(searchTerm, postType) {
    // Constants
    const RATE_LIMIT = 100;
    const { api } = window.wp;
    // Internal helper to capitalize a post type
    function capitalize(s) {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    // Run search
    return new Promise((resolve) => {
        setTimeout(() => {
            const collection = new api.collections[capitalize(postType)]();
            collection
                .fetch({ data: { search: searchTerm } })
                .then((matched) => {
                    const available = [];
                    matched.forEach((p) => {
                        available.push({
                            id: p.id,
                            value: p.title.rendered,
                            title: p.title.rendered,
                        });
                    });
                    resolve(available);
                });
        }, RATE_LIMIT);
    });
}

const WPTokenSearchField = ({ postType = 'post', value, onSaveValue }) => {
    const [searchTerm, setSearchTerm] = useState(false);
    const debouncedSearchTerm = useDebounce( searchTerm, 500 );

    const [ data, setData ] = useState(value);

    const [ suggestions, setSuggestions ] = useState();
    const [ selectedTokens, setSelectedTokens ] = useState([]);

    const findTokenInData = tokenValue => {
        if ( typeof tokenValue === 'object' ) {
            return tokenValue;
        }
        const tmp = data;
        return tmp.filter(e => {
            return e.title === tokenValue;
        }).pop();
    }
    
    /**
     * Handle search.
     */
    useEffect(()=>{
        if ( false === debouncedSearchTerm ) {
            return;
        }
        console.log('Run a search for: ', debouncedSearchTerm);
        doSearch(searchTerm, postType).then(s => {
            console.log("Found:", s);
            setData(s);
        });
    },[debouncedSearchTerm]);

    /**
     * Handle setting suggestions from search data.
     */
    useEffect(() => {
        console.log('Data Changed:', data);
        const newSuggestions = data.map(m => {
            console.log('...', m);
            return m.title;
        });
        console.log("newSuggestions ->", newSuggestions);
        if ( 0 !== newSuggestions.length ) {
            setSuggestions(newSuggestions);
        }
    }, [data]);

    /**
     * Handle saving value to inputField
     */
    useEffect(()=>{
        onSaveValue(selectedTokens);
    }, [selectedTokens]);

    return(
        <FormTokenField
            placeholder={__(`Search ${postType} posts`)}
            value={ selectedTokens }
            suggestions={ suggestions }
            onChange={ ( tokens ) => {
                console.log('onChange TOKENS->', tokens);
                const tmp = [];
                tokens.forEach(t => {
                    const matchedToken = findTokenInData(t);
                    console.log("matchedToken = ", matchedToken);
                    tmp.push(matchedToken);
                });
                console.log('onChange Matched->', tmp);
                setSelectedTokens([...tmp]);
            } }
            onInputChange={ token => setSearchTerm(token) }
        />
    );
};

export default WPTokenSearchField;
