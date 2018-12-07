import React from 'react';
import { Redirect, withRouter } from 'react-router';
import {
  Breadcrumb,
  Container,
  Divider,
  Loader,
  Header,
  Icon
} from 'semantic-ui-react';
import Chart from '../components/StockChart';
import getStockChartData from '../utils/getStockChartData';
import getJsonData from '../utils/getJsonData';

class StockPage extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      chartData: [],
      latestStockData: {},
      isLoading: true
    };

    this.state = this.initialState;
  }

  async componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      document.title = this.props.match.params.symbol;
      this.setState(this.initialState);
      await this.fetchData();
    }
  }

  async componentDidMount() {
    document.title = this.props.match.params.symbol;
    await this.fetchData();
  }

  async fetchData() {
    const chartData = await getStockChartData(this.props.match.params.symbol);
    const latestStockData = await getJsonData(
      '/stock-data/' + this.props.match.params.symbol + '/latest'
    );

    this.setState({ chartData, latestStockData, isLoading: false });
  }

  render() {
    const { chartData, latestStockData, isLoading } = this.state;
    const prevPath =
      this.props.location.state !== undefined
        ? this.props.location.state.prevPath
        : '';

    if (isLoading) {
      return <Loader active />;
    } else if (chartData.length === 0 || latestStockData.length === 0) {
      return <Redirect to="/" />;
    }

    return (
      <React.Fragment>
        <Container className="main">
          {/* Breadcrumb */}
          <Breadcrumb>
            <Breadcrumb.Section href="/">Home</Breadcrumb.Section>
            <Breadcrumb.Divider />
            {prevPath.search('/prices') !== -1 ? (
              <Breadcrumb.Section href={'/prices'}>
                Latest Prices
              </Breadcrumb.Section>
            ) : (
              <Breadcrumb.Section href={'#'}>Search</Breadcrumb.Section>
            )}
            <Breadcrumb.Divider />
            <Breadcrumb.Section active>
              {this.props.match.params.symbol}
            </Breadcrumb.Section>
          </Breadcrumb>

          <Divider hidden />

          {/* Latest stock data */}
          <Container>
            {/* Name and symbol */}
            <Header as="h1" style={{ fontSize: '2.5em' }}>
              <strong>
                {latestStockData.name} ({this.props.match.params.symbol})
              </strong>
            </Header>

            <Divider />

            <p>
              {/* Last price */}
              <span style={{ fontSize: '2em' }}>
                <strong>{latestStockData.close}&nbsp;&nbsp;</strong>
              </span>

              {/* Change */}
              <span style={{ fontSize: '1.5em' }}>
                <font
                  color={
                    latestStockData.change < 0
                      ? 'red'
                      : latestStockData.change > 0
                      ? 'green'
                      : 'grey'
                  }
                >
                  {latestStockData.change.toFixed(2)}
                </font>
                &nbsp;
                {/* Percent change */}
                <font
                  color={
                    latestStockData.change < 0
                      ? 'red'
                      : latestStockData.change > 0
                      ? 'green'
                      : 'grey'
                  }
                >
                  ({latestStockData.percent_change.toFixed(2)}%)&nbsp;
                </font>
                {/* Arrow icon */}
                {latestStockData.change < 0 ? (
                  <Icon color="red" name="long arrow alternate down" />
                ) : latestStockData.change > 0 ? (
                  <Icon color="green" name="long arrow alternate up" />
                ) : (
                  ''
                )}
              </span>
            </p>
            <font color="grey">
              <Icon name="clock outline" />
              As of&nbsp;
              {new Date(
                /* 4:30 PM EST (9:30 PM UTC) */
                latestStockData.date + 'T21:30:00'
              ).toLocaleDateString()}
            </font>
          </Container>

          <Divider hidden />

          {/* Chart */}
          <Container>
            <Chart data={chartData} />
          </Container>
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(props => <StockPage {...props} />);
