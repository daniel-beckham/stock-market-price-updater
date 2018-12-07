import React from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  Button,
  Container,
  Icon,
  Grid,
  Menu
} from 'semantic-ui-react';
import NavigationMenu from './NavigationMenu';

export default class SiteHeader extends React.Component {
  componentDidMount() {
    $('.ui.accordion').accordion();
    $('#accordion-menu-button').click(() => {
      $('#accordion-menu').toggle('250', 'linear');
    });
  }

  render() {
    return (
      <Grid padded="horizontally" columns={1}>
        <Grid.Column color="teal" className="menu">
          <Menu
            color="teal"
            size="huge"
            borderless
            inverted
            secondary
            className="main"
          >
            <Grid container columns={1}>
              {/* Desktop section */}
              <Grid.Row only="computer">
                <Menu.Item header>Stock Market Price Updater</Menu.Item>

                <NavigationMenu device="computer" />
              </Grid.Row>

              {/* Mobile section */}
              <Grid.Row only="tablet mobile">
                <Menu.Item>
                  <Button icon inverted id="accordion-menu-button">
                    <Icon name="content" />
                  </Button>
                </Menu.Item>

                <Menu.Item header as={Link} to="/">
                  Stock Market Price Updater
                </Menu.Item>

                <Grid.Column>
                  <Accordion
                    fluid
                    id="accordion-menu"
                    style={{ display: 'none' }}
                  >
                    <NavigationMenu device="tablet mobile" />
                  </Accordion>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Menu>
        </Grid.Column>
      </Grid>
    );
  }
}
