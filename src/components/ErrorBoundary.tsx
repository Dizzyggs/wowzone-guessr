import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // If we hit the dynamic import error, reload the page
    if (error.message.includes('Failed to fetch dynamically imported module')) {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box textAlign="center" py={10}>
          <Text mb={4}>Something went wrong. Reloading...</Text>
          <Button onClick={() => window.location.reload()}>
            Reload manually
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 