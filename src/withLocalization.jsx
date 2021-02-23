import React from 'react';
import messages from './messages';

export const LocalizationContext = React.createContext();

export const withLocalization = (BaseApp) => {
  return class extends React.Component {
    render() {
      const { ...props } = this.props;
      return (
        <LocalizationContext.Provider value={messages}>
          <BaseApp {...props} />
        </LocalizationContext.Provider>
      );
    }
  }
}
