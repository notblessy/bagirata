import {
  Box,
  Button,
  Drawer,
  Image,
  Input,
  List,
  Text,
  ThemeIcon,
  Title,
  rem,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { Dots } from "../../components/PatternDots";
import { useDisclosure } from "@mantine/hooks";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { isEmail, useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

function generateID() {
  return uuidv4();
}

// eslint-disable-next-line react/prop-types
export default function LandingPage() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(["session"]);

  const [nameOpened, { open: nameOpen, close: nameClose }] =
    useDisclosure(false);

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userID = cookies?.userID;
    const userData = localStorage.getItem(userID);
    if (userData) {
      navigate("/create");
    }
  }, [cookies, navigate]);

  const form = useForm({
    initialValues: {
      id: "",
      name: "",
      email: "",
      bank: "",
      bankAccountName: "",
      bankNumber: null,
    },

    validate: {
      name: (value) => (value == "" ? "name required" : null),
      email: isEmail("Invalid email"),
      bankNumber: (value) => (value < 0 ? "bank number unsigned" : null),
    },
  });

  const handleRegister = (payload) => {
    const id = generateID();
    const data = {
      id: id,
      name: payload.name,
      email: payload.email,
      friends: [
        { id: id, name: payload.name, me: true, createdAt: new Date() },
      ],
      bank: {
        bank: payload.bank,
        bankAccountName: payload.bankAccountName,
        bankNumber: payload.bankNumber,
      },
      createdAt: new Date(),
    };

    setCookie("userID", id, { path: "/" });

    const jsonData = JSON.stringify(data);
    localStorage.setItem(id, jsonData);

    nameClose();
    form.reset();

    navigate("/create");
  };

  return (
    <>
      <Box mt={30} style={{ padding: "10px 20px" }}>
        <Dots
          style={{
            left: 0,
            top: 0,
            position: "absolute",
            zIndex: -1,
            padding: 20,
          }}
        />
        <Dots
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
                <b>Free to Use</b> – Ensuring you can manage and split your
                bills without any cost.
              </List.Item>
              <List.Item>
                <b>User-Friendly</b> – Designed for simplicity and efficiency.
              </List.Item>
              <List.Item>
                <b>Shareable</b> – Making it simple to collaborate and split
                bills effortlessly.
              </List.Item>
            </List>
            <Image
              radius="md"
              h={200}
              w="auto"
              fit="contain"
              src="./calc.png"
            />
          </Box>
          <Button
            onClick={() => nameOpen()}
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
      <Drawer
        overlayProps={{ color: "#f2f2f2", backgroundOpacity: 0.5, blur: 4 }}
        opened={nameOpened}
        onClose={nameClose}
        position="bottom"
        withCloseButton={false}
      >
        <Box style={{ maxWidth: "480px", margin: "0 auto" }}>
          <Title order={3} mb={20}>
            What is your name?
          </Title>
          <form onSubmit={form.onSubmit(handleRegister)}>
            <Text>Name</Text>
            <Input
              pb={10}
              radius={0}
              placeholder="Your name"
              required
              {...form.getInputProps("name")}
            />
            <Text>Email</Text>
            <Input
              pb={10}
              radius={0}
              placeholder="Your email"
              required
              {...form.getInputProps("email")}
            />
            <Text>Bank</Text>
            <Input
              pb={10}
              radius={0}
              placeholder="Bank"
              required
              {...form.getInputProps("bank")}
            />
            <Text>Bank Account Name</Text>
            <Input
              pb={10}
              radius={0}
              placeholder="Bank Account Name"
              required
              {...form.getInputProps("bankAccountName")}
            />
            <Text>Bank Number</Text>
            <Input
              pb={10}
              radius={0}
              placeholder="Bank Number"
              required
              {...form.getInputProps("bankNumber")}
            />
            <Button
              radius={0}
              mt={15}
              size="sm"
              fullWidth
              color="#F06418"
              variant="filled"
              loading={loading}
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Box>
      </Drawer>
    </>
  );
}
