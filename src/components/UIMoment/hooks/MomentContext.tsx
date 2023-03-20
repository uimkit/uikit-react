import React, { PropsWithChildren, useContext } from 'react';
import { Moment, UnknownType } from '../../../types';
import { UIMomentContextProps } from '../UIMomentContext';

export type MomentContextValue = {
  moment: Moment;

  VideoElement?: React.ComponentType<UIMomentContextProps>;
};

export const MomentContext = React.createContext<MomentContextValue | undefined>(undefined);

export const MomentProvider = ({
  children,
  value,
}: PropsWithChildren<{
  value: MomentContextValue;
}>) => {
  return (
    <MomentContext.Provider value={value}>
      {children}
    </MomentContext.Provider>
  );
}

export const useMomentContext = (
  componentName?: string,
) => {
  const contextValue = useContext(MomentContext);

  if (!contextValue) {
    console.warn(
      `The useMomentContext hook was called outside of the MomentContext provider. Make sure this hook is called within the Moment's UI component. The errored call is located in the ${componentName} component.`,
    );

    return {} as MomentContextValue;
  }

  return contextValue;
};

export const withMomentContext = <
  P extends UnknownType,
>(
  Component: React.ComponentType<P>,
) => {
  const WithMomentContextComponent = (
    props: Omit<P, keyof MomentContextValue>,
  ) => {
    const momentContext = useMomentContext();
    return <Component {...(props as P)} {...momentContext} />;
  };

  WithMomentContextComponent.displayName = (
    Component.displayName ||
    Component.name ||
    'Component'
  ).replace('Base', '');

  return WithMomentContextComponent;
};