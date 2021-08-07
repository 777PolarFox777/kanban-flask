import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { faKickstarter } from '@fortawesome/free-brands-svg-icons';

import './Header.css';

export const Header = () => (
  <header className="main-header bg-blue-500 p-md text-3xl text-white shadow-lg">
    <FontAwesomeIcon icon={faKickstarter} className="mr-sm" />
    Kanban Flask App
  </header>
);

Header.displayName = 'Header';
