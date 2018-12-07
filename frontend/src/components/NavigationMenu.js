import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

class NavigationMenu extends React.Component {
  componentDidMount() {
    $('.ui.search').search({
      apiSettings: {
        url: '/stock-info/filter?q={query}'
      },
      onSelect: (result, response) => {
        this.props.history.push('/stocks/' + result.title);
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <Menu.Item as={NavLink} exact to="/">
          Home
        </Menu.Item>
        <Menu.Item as={NavLink} exact to="/prices">
          Latest Prices
        </Menu.Item>
        <Menu.Item
          position="right"
          fitted={
            this.props.device === 'computer' ? 'vertically' : 'horizontally'
          }
        >
          <div className="ui search">
            <div className="ui icon input">
              <input className="prompt" type="text" placeholder="Search..." />
              <i className="search icon" />
            </div>
          </div>
        </Menu.Item>
      </React.Fragment>
    );
  }
}

export default withRouter(NavigationMenu);
