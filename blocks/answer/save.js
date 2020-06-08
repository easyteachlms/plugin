import { __ } from '@wordpress/i18n';

const save = ({ attributes, className, clientId, setAttributes }) => {
    const { answer } = attributes;

	return <div className={className}>{answer}</div>
}

export default save;