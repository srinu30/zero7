import React from 'react';
import { Outlet } from 'react-router-dom';

const Services = () => {
  return (
    <div className="page">
      <Outlet />
    </div>
  );
};

export default Services;
