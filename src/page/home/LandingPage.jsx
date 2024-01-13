import {
  Box,
  Button,
  Image,
  List,
  Text,
  ThemeIcon,
  Title,
  rem,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { Dots } from "../../components/PatternDots";

import classes from "./classes.css";

// eslint-disable-next-line react/prop-types
export default function LandingPage({ onGetStarted }) {
  return (
    <Box mt={30} style={{ padding: "10px 20px" }}>
      <Dots
        className={classes.dots}
        style={{
          left: 0,
          top: 0,
          position: "absolute",
          zIndex: -1,
          padding: 20,
        }}
      />
      <Dots
        className={classes.dots}
        style={{
          right: 0,
          bottom: 0,
          position: "absolute",
          padding: 20,
          zIndex: -1,
        }}
      />

      <Box style={{ zIndex: 99999 }}>
        <Text ta="center" c="#F06418" fz={12} fw={600}>
          Bagirata
        </Text>
        <Title ta="center" order={2} c="#161617">
          Welcome to Bagirata
        </Title>
        <Box>
          <Text ta="center" c="dimmed" fz={14}>
            Your solution for hassle-free bill splitting.
          </Text>
          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon color="#F06418" size={20} radius="xl">
                <IconCheck
                  style={{ width: rem(12), height: rem(12) }}
                  stroke={1.5}
                />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Free to Use</b> – Ensuring you can manage and split your bills
              without any cost.
            </List.Item>
            <List.Item>
              <b>User-Friendly</b> – Designed for simplicity and efficiency.
            </List.Item>
            <List.Item>
              <b>Shareable</b> – Making it simple to collaborate and split bills
              effortlessly.
            </List.Item>
          </List>
          <Image radius="md" h={200} w="auto" fit="contain" src="./calc.png" />
        </Box>
        <Button
          onClick={onGetStarted}
          fullWidth
          radius={0}
          mt={15}
          size="sm"
          color="#F06418"
          variant="filled"
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
}
