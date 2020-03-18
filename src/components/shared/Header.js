import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { FormattedMessage } from 'react-intl';
import Link from '@tds/core-link';
import LangSwitcher from './LangSwitcher';

const Header = props => {
  const onLogoutClick = e => {
    e.preventDefault();
  };

  const renderAuthenticatedLink = () => {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <Link id="logoutBtn" href="#" onClick={onLogoutClick} invert>
        <span className="header-button">
          <FormattedMessage id="header.logout" />
        </span>
      </Link>
    );
  };

  const renderGuestLink = () => {
    return (
      <Link to="/login" invert>
        <span className="header-button">
          <FormattedMessage id="header.login" />
        </span>
      </Link>
    );
  };

  const { isAuthenticated } = props;
  return (
    <Grid fluid id="header">
      <Row id="header-row" middle="xs">
        <Col xs={12}>
          <Row center="xs">
            <Col className="wrapper-box" xs={12}>
              <Row end="xs">
                <Col id="header-control-box" xs={12}>
                  {isAuthenticated ? renderAuthenticatedLink() : renderGuestLink()}
                  <span className="header-button header-bordered-button">
                    <LangSwitcher />
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Grid>
  );
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool,
};

Header.defaultProps = {
  isAuthenticated: false,
};

export default Header;
