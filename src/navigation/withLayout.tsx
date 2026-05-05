import React from 'react';
import {AppLayout} from '../layout/AppLayout';

export const withLayout = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <AppLayout>
      <Component {...props} />
    </AppLayout>
  );
};
