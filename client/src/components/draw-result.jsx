import React, { PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { List } from 'immutable';

const createATag = (id, ja) => (
    <a href={`http://yakkun.com/sm/zukan/n${id}`} target="_blank" rel="noreferrer noopener">{ja}</a>
);

const DrawResult = props =>
    (
        <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    <TableHeaderColumn>図鑑番号</TableHeaderColumn>
                    <TableHeaderColumn>名前</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
                {props.pokemons.map((pokemon, i) =>
                    <TableRow key={i}>
                        <TableRowColumn>{pokemon.get('id')}</TableRowColumn>
                        <TableRowColumn>{createATag(pokemon.get('id'), pokemon.get('ja'))}</TableRowColumn>
                    </TableRow>,
                )}
            </TableBody>
        </Table>
    );


DrawResult.propTypes = {
    pokemons: PropTypes.instanceOf(List).isRequired,
};

export default DrawResult;
