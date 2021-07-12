import React from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  Container,
  Divider,
  Header,
  Grid,
  Image,
} from 'semantic-ui-react';

export default class HomePage extends React.Component {
  componentDidMount() {
    document.title = 'Stock Market Price Updater';
  }

  render() {
    return (
      <React.Fragment>
        {/* Masthead */}
        <Grid
          padded="horizontally"
          align="center"
          verticalAlign="middle"
          className="masthead"
          columns={1}
        >
          <Grid.Row color="teal">
            <Grid.Column color="teal">
              <Header as="h1" inverted>
                Evalulate daily stock performance
              </Header>
              <Header as="h2" inverted>
                Make informed investing decisions today with Stock Market Price
                Updater
              </Header>
              <Divider hidden />
              <Button
                as={Link}
                to={`${process.env.SUBDIRECTORY}/prices`}
                size="huge"
                inverted
              >
                Get started
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {/* Content */}
        <Container className="main">
          {/* Information panel #1 */}
          <Grid verticalAlign="middle" columns={2}>
            <Grid.Row>
              <Grid.Column align="center">
                <Image
                  src={`${process.env.SUBDIRECTORY}/static/img/chart-1.svg`}
                  size="large"
                />
              </Grid.Column>
              <Grid.Column>
                <Header as="h1" color="grey">
                  Stock market prices
                </Header>
                <Header as="h1" color="grey">
                  <Header.Subheader>
                    Prices for stocks in the Dow Jones Industrial Average are
                    updated each day after the New York Stock Exchange closes.
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Divider hidden />

          {/* Information panel #2 */}
          <Grid verticalAlign="middle" columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Header as="h1" color="grey">
                  Stock market history
                </Header>
                <Header as="h1" color="grey">
                  <Header.Subheader>
                    An interactive chart with two years of historical data can
                    be viewed for each stock. Technical indicators are also
                    available.
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column align="center">
                <Image
                  src={`${process.env.SUBDIRECTORY}/static/img/chart-2.svg`}
                  size="large"
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}
