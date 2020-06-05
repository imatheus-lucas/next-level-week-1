import React from 'react';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

interface HeaderProps{
  title:string
}
const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header>
      <h1>{props.title}</h1>
    </header>
  )
}

export default Header;