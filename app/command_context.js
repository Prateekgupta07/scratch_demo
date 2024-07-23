import React, { createContext, useContext, useState } from 'react';

const CommandsContext = createContext();

export const CommandsProvider = ({ children }) => {
  const [commands, setCommands] = useState({});

  const updateCommands = (imageUri, newCommands) => {
    setCommands(prev => ({ ...prev, [imageUri]: newCommands }));
  };

  return (
    <CommandsContext.Provider value={{ commands, updateCommands }}>
      {children}
    </CommandsContext.Provider>
  );
};

export const useCommands = () => useContext(CommandsContext);
