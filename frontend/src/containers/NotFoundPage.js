import React from 'react';
import { Container, Header } from 'semantic-ui-react';

const NotFoundPage = () => (
  <Container className="main">
    <Header as="h2">Not Found</Header>
    <p>The requested page could not be found.</p>
  </Container>
);

export default NotFoundPage;
