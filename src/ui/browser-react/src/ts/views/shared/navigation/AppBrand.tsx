import React from 'react';

export function AppBrand(props: { title: string }) {
  return (
    <React.Fragment>
      {props.title}
    </React.Fragment>
  );
}