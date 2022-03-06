import React from 'react';
import { render, screen } from '@testing-library/react';
import RouteViewContainer from './ViewContainer';

test('renders learn react link', () => {
  render(<RouteViewContainer />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
