import React from 'react';
import Dropzone from 'react-dropzone';

import UploadedImage from './uploaded-image';

const dropzoneStyle = {
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'dashed',
    borderRadius: 4,
    padding: 30,
    width: '70%',
    transition: 'all 0.5s',
    margin: 'auto',
    marginTop: 15,
    marginBottom: 15,
};

/*  eslint-disable react/prefer-es6-class */
const DropzoneDemo = React.createClass({
    getInitialState() {
        return {
            files: [],
        };
    },

    onDrop(acceptedFiles) {
        this.setState({
            files: acceptedFiles,
        });
    },


    render() {
        return (
            <div>
                <Dropzone
                  onDrop={this.onDrop} accept="image/*" multiple={false}
                  style={dropzoneStyle}
                >
                    <div style={{ 'text-align': 'center' }}>
                        タップして画像をアップロード
                    </div>
                </Dropzone>

                <UploadedImage files={this.state.files} />
            </div>
        );
    },
});

export default DropzoneDemo;
