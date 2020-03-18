import React, { Fragment } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import MuliplyResultContainer from 'components/multiply/MuliplyResultContainer';
import MultiplyContainer from 'components/multiply/MultiplyContainer';
import Header from './Header';

const App = () => (
  <Fragment>
    <Header isAuthenticated />
    <Grid>
      <Row>
        <Col xs={6}>
          <MultiplyContainer />
          <MuliplyResultContainer />
        </Col>
      </Row>
    </Grid>
  </Fragment>
);

export default App;
