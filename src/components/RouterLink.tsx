import React from 'react';
import { Link as ParentLink } from 'react-router-dom';

function RouterLink(props: { children: React.ReactNode; to: string }) {
  return (
    <ParentLink style={{ textDecoration: 'none' }} to={props.to}>
      {props.children}
    </ParentLink>
  );
}

export default RouterLink;
