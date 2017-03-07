import React, { PropTypes } from 'react';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import { List } from 'immutable';

const style = {
    width: '80%',
    margin: 'auto',
    marginTop: 10,
};

const UploadedImage = props => (
    props.files.size > 0 ? <div style={style}>
        {props.files.map((file, i) =>
            <Card key={i}>
                <CardMedia
                  overlay={
                      <CardTitle title="アップロードされた画像" />
                    }
                >
                    <img src={file.preview} alt="uploaded" />
                </CardMedia>
            </Card>
            ,
        )}
    </div> : null

);


UploadedImage.propTypes = {
    files: PropTypes.instanceOf(List).isRequired,
};

export default UploadedImage;
