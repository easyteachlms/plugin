import { Component } from '@wordpress/element';
import 'mediaelement';

export default class MediaElement extends Component {
    state = {};

    success(media, node, instance) {
        // Your action when media was successfully loaded
    }

    error(media) {
        // Your action when media had an error loading
    }

    render() {
        const { props } = this;
        const sources = JSON.parse(props.sources);
        const tracks = JSON.parse(props.tracks);
        const sourceTags = [];
        const tracksTags = [];
        for (let i = 0, total = sources.length; i < total; i++) {
            const source = sources[i];
            sourceTags.push(
                `<source src="${source.src}" type="${source.type}">`,
            );
        }

        for (let i = 0, total = tracks.length; i < total; i++) {
            const track = tracks[i];
            tracksTags.push(
                `<track src="${track.src}" kind="${track.kind}" srclang="${
                    track.lang
                }"${track.label ? ` label=${track.label}` : ''}>`,
            );
        }

        const mediaBody = `${sourceTags.join('\n')}
				${tracksTags.join('\n')}`;
        const mediaHtml =
            'video' === props.mediaType
                ? `<video id="${props.id}" width="${props.width}" height="${
                      props.height
                  }"${props.poster ? ` poster=${props.poster}` : ''}
					${props.controls ? ' controls' : ''}${
                      props.preload ? ` preload="${props.preload}"` : ''
                  }>
					${mediaBody}
				</video>`
                : `<audio id="${props.id}" width="${props.width}" controls>
					${mediaBody}
				</audio>`;
        return <div dangerouslySetInnerHTML={{ __html: mediaHtml }} />;
    }

    componentDidMount() {
        const { MediaElementPlayer } = global;

        if (!MediaElementPlayer) {
            return;
        }

        const options = {
            ...JSON.parse(this.props.options), // Read the Notes below for more explanation about how to set up the path for shims
            pluginPath: './static/media/',
            success: (media, node, instance) =>
                this.success(media, node, instance),
            error: (media, node) => this.error(media, node),
        };

        this.setState({
            player: new MediaElementPlayer(this.props.id, options),
        });
    }

    componentWillUnmount() {
        if (this.state.player) {
            this.state.player.remove();
            this.setState({ player: null });
        }
    }
}
