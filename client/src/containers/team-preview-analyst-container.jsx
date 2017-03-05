import { connect } from 'react-redux';
import TeamPreviewAnalyst from '../components/team-preview-analyst';

import { dropFiles } from '../redux/team-preview-analyst-reducer';
import { fetchPokemons } from '../redux/api-reducer';

const mapStateToProps = state => ({
    files: state.analyst.get('files'),
    pokemons: state.api.get('pokemons'),
    isRequesting: state.api.get('isRequesting'),
});

const mapDispatchToProps = dispatch => ({
    handleDropFiles: (files) => { dispatch(dropFiles(files)); },
    handleFetchPokemons: (file) => { dispatch(fetchPokemons(file)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamPreviewAnalyst);
