import { Fragment } from '@wordpress/element';

const Certificate = ({backgroundColor, borderColor, uuid, className, display, children}) => {
    let height = '773px';
    let width = '1000px';
    return(
        <div
        className={className}
        style={{
            border: '4px solid',
            borderColor,
            backgroundColor,
            height: height,
            width: width,
            padding: '1em',
            marginTop: '1em'
        }}>
            {children}
        </div>
    );s
}

export default Certificate;