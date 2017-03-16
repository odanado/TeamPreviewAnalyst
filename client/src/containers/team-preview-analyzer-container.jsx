import { connect } from 'react-redux';
import TeamPreviewAnalyzer from '../components/team-preview-analyzer';

import { dropFiles } from '../redux/team-preview-analyzer-reducer';
import { fetchPokemons } from '../redux/api-reducer';

const mapStateToProps = state => ({
    files: state.analyzer.get('files'),
    pokemons: state.api.get('pokemons'),
    requestState: state.api.get('requestState'),
});

const mapDispatchToProps = dispatch => ({
    handleDropFiles: (files) => { dispatch(dropFiles(files)); },
    handleFetchPokemons: (file) => { dispatch(fetchPokemons(file)); },
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamPreviewAnalyzer);
