import React, { PropTypes } from 'react';
import { List } from 'immutable';
import LinearProgress from 'material-ui/LinearProgress';

import ImageDropzone from './image-dropzone';
import DrawResult from './draw-result';
import UploadedImage from './uploaded-image';

const onDrop = (files, handleDropFiles, handleFetchPokemons) => {
    handleDropFiles(files);
    handleFetchPokemons(files[0]);
};

const TeamPreviewAnalyst = props => (
    <div>
        <ImageDropzone
          onDrop={files =>
                onDrop(files, props.handleDropFiles, props.handleFetchPokemons)}
        />
        {props.isRequesting ? <LinearProgress mode="indeterminate" /> : null}
        <DrawResult pokemons={props.pokemons} />
        <UploadedImage files={props.files} />
    </div>
);

TeamPreviewAnalyst.propTypes = {
    handleDropFiles: PropTypes.func.isRequired,
    handleFetchPokemons: PropTypes.func.isRequired,
    files: PropTypes.instanceOf(List).isRequired,
    pokemons: PropTypes.instanceOf(List).isRequired,
    isRequesting: PropTypes.bool.isRequired,
};

export default TeamPreviewAnalyst;
