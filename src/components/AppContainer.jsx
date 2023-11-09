import { Box } from "@mantine/core";

// eslint-disable-next-line react/prop-types
const AppContainer = ({ children }) => {

  return (
    <Box style={{ maxWidth: '480px', margin: '0 auto' }}>
      {children}
    </Box>
  );
};

export default AppContainer;
