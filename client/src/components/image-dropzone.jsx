import React, { PropTypes } from 'react';
import Dropzone from 'react-dropzone';

const style = {
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

const ImageGropzone = props => (
    <Dropzone
      onDrop={props.onDrop} accept="image/*"
      multiple={false} style={style}
    >
        <div style={{ textAlign: 'center' }}>
            タップして画像をアップロード
        </div>
        <div style={{ textAlign: 'center', fontSize: 7 }}>
            ※アップロードされた画像は今後の精度向上のために使用する場合があります
        </div>
    </Dropzone>
);


ImageGropzone.propTypes = {
    onDrop: PropTypes.func.isRequired,
};

export default ImageGropzone;
