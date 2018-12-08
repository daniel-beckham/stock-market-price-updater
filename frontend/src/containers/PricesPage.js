import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  Container,
  Divider,
  Header,
  Icon,
  Loader,
  Table
} from 'semantic-ui-react';
import _ from 'lodash';
import getJsonData from '../utils/getJsonData';

export default class PricesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortColumn: 'symbol',
      sortDirection: 'ascending',
      stockData: [],
      isLoading: true
    };
  }

  async componentDidMount() {
    document.title = 'Latest Prices';
    await this.fetchData();
  }

  async fetchData() {
    const stockData = await getJsonData('/stock-data/all/latest');

    this.setState({
      stockData: _.sortBy(stockData, [this.state.sortColumn]),
      isLoading: false
    });
  }

  handleSort = clickedColumn => () => {
    const { sortColumn, sortDirection, stockData } = this.state;

    if (sortColumn !== clickedColumn) {
      this.setState({
        sortColumn: clickedColumn,
        stockData: _.sortBy(stockData, [clickedColumn]),
        sortDirection: 'ascending'
      });

      return;
    }

    this.setState({
      stockData: stockData.reverse(),
      sortDirection: sortDirection === 'ascending' ? 'descending' : 'ascending'
    });
  };

  render() {
    const { isLoading, sortColumn, sortDirection, stockData } = this.state;

    if (isLoading) {
      return <Loader active />;
    } else if (stockData.length === 0) {
      return (
        <Container className="main">
          <Header as="h2">Load Failed</Header>
          <p>The data could not be loaded.</p>
        </Container>
      );
    }

    return (
      <Container className="main" style={{ overflowX: 'auto' }}>
        {/* Breadcrumb */}
        <Breadcrumb>
          <Breadcrumb.Section as={Link} to="/">
            Home
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>Latest Prices</Breadcrumb.Section>
        </Breadcrumb>

        <Divider hidden />

        {/* Stock data table */}
        <Table sortable striped unstackable>
          {/* Header */}
          <Table.Header>
            <Table.Row>
              {/* Symbol */}
              <Table.HeaderCell
                sorted={sortColumn === 'symbol' ? sortDirection : null}
                onClick={this.handleSort('symbol')}
                width={2}
              >
                Symbol
              </Table.HeaderCell>

              {/* Name */}
              <Table.HeaderCell
                sorted={sortColumn === 'name' ? sortDirection : null}
                onClick={this.handleSort('name')}
                width={4}
              >
                Name
              </Table.HeaderCell>

              {/* Last price */}
              <Table.HeaderCell
                sorted={sortColumn === 'close' ? sortDirection : null}
                onClick={this.handleSort('close')}
                width={2}
                textAlign="right"
              >
                Last Price
              </Table.HeaderCell>

              {/* Change */}
              <Table.HeaderCell
                sorted={sortColumn === 'change' ? sortDirection : null}
                onClick={this.handleSort('change')}
                width={2}
                textAlign="right"
              >
                Change
              </Table.HeaderCell>

              {/* Percent change */}
              <Table.HeaderCell
                sorted={sortColumn === 'percent_change' ? sortDirection : null}
                onClick={this.handleSort('percent_change')}
                width={2}
                textAlign="right"
              >
                Percent Change
              </Table.HeaderCell>

              {/* Volume */}
              <Table.HeaderCell
                sorted={sortColumn === 'volume' ? sortDirection : null}
                onClick={this.handleSort('volume')}
                width={2}
                textAlign="right"
              >
                Volume
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {/* Body */}
          <Table.Body>
            {Object.values(stockData).map(data => (
              <Table.Row key={data.symbol}>
                {/* Symbol */}
                <Table.Cell key={data.symbol}>
                  <Link
                    to={{
                      pathname: '/stocks/' + data.symbol,
                      state: { prevPath: this.props.location.pathname }
                    }}
                  >
                    {data.symbol}
                  </Link>
                </Table.Cell>

                {/* Name */}
                <Table.Cell key={data.name}>{data.name}</Table.Cell>

                {/* Last price */}
                <Table.Cell
                  textAlign="right"
                  key={`${data.symbol}-${data.close}-close`}
                >
                  {data.close.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })}
                </Table.Cell>

                {/* Change */}
                <Table.Cell
                  textAlign="right"
                  key={`${data.symbol}-${data.change}-change`}
                >
                  <font
                    color={
                      data.change < 0
                        ? 'red'
                        : data.change > 0
                        ? 'green'
                        : 'grey'
                    }
                  >
                    {data.change.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2
                    })}
                  </font>

                  {/* Arrow icon */}
                  {data.change < 0 ? (
                    <Icon color="red" name="long arrow alternate down" />
                  ) : data.change > 0 ? (
                    <Icon color="green" name="long arrow alternate up" />
                  ) : (
                    ''
                  )}
                </Table.Cell>

                {/* Percent change */}
                <Table.Cell
                  textAlign="right"
                  key={`${data.symbol}-${data.percent_change}-percent-change`}
                >
                  <font
                    color={
                      data.percent_change < 0
                        ? 'red'
                        : data.percent_change > 0
                        ? 'green'
                        : 'grey'
                    }
                  >
                    {data.percent_change.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2
                    })}
                    %
                  </font>
                </Table.Cell>

                {/* Volume */}
                <Table.Cell
                  textAlign="right"
                  key={`${data.symbol}-${data.volume}-volume-`}
                >
                  {data.volume.toLocaleString()}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>
    );
  }
}
