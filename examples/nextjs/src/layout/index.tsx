import { useUser } from '@authok/nextjs-authok/client';
import { Box, Grid, HStack } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../components/ColorModeSwitcher';

export function Layout({ children }) {
  const { user, error, isLoading } = useUser();

  return children;
  
  return (
    <Box>
      <Grid p={3}>
        <HStack justifySelf="flex-end">
          {user ? (
            <a href="/api/auth/logout">注销</a>
          ): (
            <a href="/api/auth/login">登录</a>
          )}
          <ColorModeSwitcher />
        </HStack>
      </Grid>
      <main>
        {children}
      </main>
    </Box>
  );
}