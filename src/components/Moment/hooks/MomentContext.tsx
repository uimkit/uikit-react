import React, { PropsWithChildren, useContext } from 'react';
import { Moment, UnknownType } from '../../../types';

export type MomentContextValue = {
  moment: Moment;
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
      `The useMessageContext hook was called outside of the MessageContext provider. Make sure this hook is called within the Message's UI component. The errored call is located in the ${componentName} component.`,
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
    const messageContext = useMomentContext();
    return <Component {...(props as P)} {...messageContext} />;
  };

  WithMomentContextComponent.displayName = (
    Component.displayName ||
    Component.name ||
    'Component'
  ).replace('Base', '');

  return WithMomentContextComponent;
};