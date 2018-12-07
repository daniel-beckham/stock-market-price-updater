import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Divider,
  Header,
  Grid,
  Image
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
              <Button as={Link} to="/prices" size="huge" inverted>
                Get started
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {/* Content */}
        <Container className="main">
          <Grid verticalAlign="middle" columns={2}>
            <Grid.Row>
              <Grid.Column align="center">
                <Image src="/static/img/analytics.svg" size="large" />
              </Grid.Column>
              <Grid.Column>
                <Header as="h1" color="grey">
                  Stock market forecasts
                </Header>
                <Header as="h1" color="grey">
                  <Header.Subheader>
                    Stock prices are updated daily, and we have two years of
                    historical data along with an interactive chart for each
                    stock.
                  </Header.Subheader>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}
