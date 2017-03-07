import React, { PropTypes } from 'react';
import { List } from 'immutable';
import LinearProgress from 'material-ui/LinearProgress';
import GoogleAd from 'react-google-ad';

import ImageDropzone from './image-dropzone';
import DrawResult from './draw-result';
import UploadedImage from './uploaded-image';

const onDrop = (files, handleDropFiles, handleFetchPokemons) => {
    handleDropFiles(files);
    handleFetchPokemons(files[0]);
};

const createProgressBar = (requestState) => {
    if (requestState === 'waiting') {
        return <LinearProgress mode="indeterminate" />;
    } else if (requestState === 'failure') {
        return (
            <div>
                <p>エラーが発生しました。バグの報告先は @poke_odan です。</p>
                <LinearProgress mode="determinate" color="red" value={100} />
            </div>
        );
    }

    return null;
};

const style = {
    width: '90%',
    margin: 'auto',
    marginTop: 10,
    marginButtom: 10,
};

const TeamPreviewAnalyst = props => (
    <div>
        <ImageDropzone
          onDrop={files => onDrop(files, props.handleDropFiles, props.handleFetchPokemons)}
        />
        {createProgressBar(props.requestState)}
        <DrawResult pokemons={props.pokemons} />
        <div style={style}>
            スポンサードリンク
            <GoogleAd client="ca-pub-6698466829268788" slot="3466226753" format="auto" />
        </div>
        <UploadedImage files={props.files} />
    </div>
);

TeamPreviewAnalyst.propTypes = {
    handleDropFiles: PropTypes.func.isRequired,
    handleFetchPokemons: PropTypes.func.isRequired,
    files: PropTypes.instanceOf(List).isRequired,
    pokemons: PropTypes.instanceOf(List).isRequired,
    requestState: PropTypes.string.isRequired,
};

export default TeamPreviewAnalyst;
