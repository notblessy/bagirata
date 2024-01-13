import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  CloseButton,
  Divider,
  Drawer,
  Grid,
  Group,
  Input,
  Loader,
  LoadingOverlay,
  NumberInput,
  Text,
  Title,
} from "@mantine/core";
import { IconPencil, IconPlus, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { isEmail, useForm } from "@mantine/form";
import { v4 as uuidv4 } from "uuid";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import LandingPage from "./LandingPage";

function generateID() {
  return uuidv4();
}

export default function Home() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(["session"]);

  const [opened, { open, close }] = useDisclosure(false);
  const [nameOpened, { open: nameOpen, close: nameClose }] =
    useDisclosure(false);
  const [editOpened, { open: editOpen, close: editClose }] =
    useDisclosure(false);

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [friendName, setFriendName] = useState();
  const [billID, setBillID] = useState();

  useEffect(() => {
    const userID = cookies?.userID;
    if (!userID) {
      setUser(null);

      return;
    }

    const userData = localStorage.getItem(userID);
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [cookies, user, setUser]);

  const handleDeleteFriend = (id) => {
    user.friends = user?.friends?.filter((f) => f.id !== id);

    user?.friends?.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    setUser(user);
    const jsonData = JSON.stringify(user);
    localStorage.setItem(user?.id, jsonData);
  };

  const friendItems = user?.friends?.map((f) => {
    const splitted = f?.name?.split(" ");

    let acr = "";
    if (splitted?.length == 1) {
      acr =
        splitted[0].length > 2
          ? splitted[0].substring(0, 2).toUpperCase()
          : splitted[0].toUpperCase();
    } else {
      acr = splitted
        ?.map((word) => word[0])
        .join("")
        .toUpperCase();
    }

    return (
      <Box key={f.id} style={{ position: "relative" }}>
        {
          <Box>
            {!f?.me ? (
              <ActionIcon
                style={{ position: "absolute", left: "30px" }}
                color="#F06418"
                radius="xl"
                size="xs"
                variant="filled"
                aria-label="remove-mate"
                onClick={() => {
                  handleDeleteFriend(f?.id);
                }}
              >
                <IconX stroke={1.5} />
              </ActionIcon>
            ) : null}
            <Avatar size={45} src={null} color="#F06418">
              {acr}
            </Avatar>
          </Box>
        }
      </Box>
    );
  });

  const userForm = useForm({
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

  const form = useForm({
    initialValues: {
      name: "",
      ownerID: "",
      qty: 0,
      price: 0,
    },

    validate: {
      name: (value) => (value == "" ? "empty form" : null),
      qty: (value) => (value < 1 ? "not a number" : null),
      price: (value) => (value < 1 ? "not a number" : null),
    },
  });

  const editForm = useForm({
    initialValues: {
      id: "",
      ownerID: "",
      name: "",
      qty: 0,
      price: 0,
      createdAt: null,
    },

    validate: {
      name: (value) => (value == "" ? "empty form" : null),
      qty: (value) => (value < 1 ? "not a number" : null),
      price: (value) => (value < 1 ? "not a number" : null),
    },
  });

  const handleAddFriend = () => {
    if (!friendName) {
      notifications.show({
        title: "Error",
        message: "Please input your friend's name",
        color: "red",
      });

      return;
    }

    user?.friends?.splice(user?.friends?.length, 0, {
      id: generateID(),
      name: friendName,
      me: false,
      createdAt: new Date(),
    });

    const jsonData = JSON.stringify(user);
    localStorage.setItem(user.id, jsonData);

    user?.friends?.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    setFriendName("");
    return;
  };

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

    setUser(data);

    setCookie("userID", id, { path: "/" });

    const jsonData = JSON.stringify(data);
    localStorage.setItem(id, jsonData);

    nameClose();
    userForm.reset();
  };

  const handleAddBill = (bill) => {
    bill.id = generateID();

    user.bills = user?.bills || [];

    user?.bills.splice(user?.bills?.length, 0, {
      id: bill.id,
      ownerID: user.id,
      name: bill.name,
      qty: +bill.qty,
      price: +bill.price,
      createdAt: new Date(),
    });

    user?.bills?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const jsonData = JSON.stringify(user);
    localStorage.setItem(user?.id, jsonData);

    close();
    form.reset();
  };

  const handleUpdate = (payload) => {
    if (payload.id != "") {
      user.bills?.filter((b) => b.id !== payload.id);

      user?.bills.push({
        id: payload.id,
        ownerID: user.id,
        name: payload.name,
        qty: +payload.qty,
        price: +payload.price,
        createdAt: payload.createdAt,
      });

      user.bills = user?.bills?.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      const jsonData = JSON.stringify(user);
      localStorage.setItem(user?.id, jsonData);

      editClose();
      editForm.reset();
    }
  };

  const handleDeleteBill = (id) => {
    user.bills = user?.bills?.filter((b) => {
      return b.id !== id;
    });

    user?.bills?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const jsonData = JSON.stringify(user);
    localStorage.setItem(user?.id, jsonData);
  };

  const handleContinue = () => {
    navigate(user?.id);
  };

  return (
    <Box mt={30} style={{ padding: "10px 20px" }}>
      {!user ? (
        <LandingPage onGetStarted={() => nameOpen()} />
      ) : (
        <>
          <Text c="#F06418" fz={12} fw={600}>
            Bagi Rata
          </Text>
          <Title order={1} c="#161617">
            Create your bill
          </Title>
          {user?.bank ? (
            <Box>
              <Box
                mt={10}
                p={10}
                style={{ width: "100%", border: "1px solid #eee" }}
              >
                <Group justify="space-between">
                  <Box>
                    <Text fz={12} fw={800}>
                      {user?.bank.bankAccountName}
                    </Text>
                    <Group gap={5}>
                      <Text
                        fz={12}
                      >{`${user?.bank.bank} - ${user?.bank.bankNumber}`}</Text>
                    </Group>
                  </Box>
                </Group>
              </Box>
            </Box>
          ) : null}
          <Box mt={10} style={{ width: "100%" }}>
            <Grid>
              <Grid.Col span={10}>
                <Input
                  py={10}
                  radius={0}
                  placeholder="Input your mates"
                  value={friendName}
                  onChange={(event) => setFriendName(event.currentTarget.value)}
                  rightSectionPointerEvents="all"
                  rightSection={
                    <CloseButton
                      aria-label="Clear input"
                      onClick={() => setFriendName("")}
                      style={{ display: friendName ? undefined : "none" }}
                    />
                  }
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <ActionIcon
                  radius={0}
                  style={{
                    margin: "10px 0",
                    width: "100%",
                    alignItems: "center",
                  }}
                  color="#F06418"
                  size="36px"
                  variant="light"
                  aria-label="add-mate"
                  disabled={loading}
                  onClick={handleAddFriend}
                >
                  {loading ? (
                    <Loader size="xs" color="#F06418" />
                  ) : (
                    <IconPlus stroke={1.5} />
                  )}
                </ActionIcon>
              </Grid.Col>
            </Grid>
          </Box>
          <Group gap="xs" style={{ padding: "10px 0" }}>
            {friendItems?.length > 0 ? friendItems : null}
          </Group>
          <Box>
            <Box
              mt={user?.bills?.length > 0 ? 20 : 0}
              style={{ padding: "10px 0" }}
            >
              <Box pos="relative">
                <LoadingOverlay
                  visible={loading}
                  zIndex={1000}
                  loaderProps={{ size: "sm", color: "#F06418" }}
                  overlayProps={{ radius: "sm", blur: 2 }}
                />
                {user?.bills?.length > 0 ? (
                  user?.bills?.map((b) => {
                    return (
                      <React.Fragment key={b.id}>
                        <Grid mb={20}>
                          <Grid.Col span={12} pb={0}>
                            <Text fz={18} fw={600} c="#161617">
                              {b.name}
                            </Text>
                          </Grid.Col>
                          <Grid.Col span={4} m="auto 0" pt={0}>
                            <Text
                              fz={14}
                              fw={400}
                              c="dimmed"
                            >{`Rp ${b?.price?.toLocaleString()}`}</Text>
                          </Grid.Col>
                          <Grid.Col span={2} m="auto 0" pt={0}>
                            <Text
                              fz={12}
                              fw={600}
                              c="#161617"
                            >{`x${b.qty}`}</Text>
                          </Grid.Col>
                          <Grid.Col span={4} pt={0} align="right" m="auto 0">
                            <Text fz={14} fw={600} c="#161617">{`Rp ${(
                              b.price * b.qty
                            ).toLocaleString()}`}</Text>
                          </Grid.Col>
                          <Grid.Col span={2} align="right" m="auto 0">
                            <ActionIcon
                              radius={0}
                              color="#F06418"
                              size="36px"
                              variant="light"
                              aria-label="add-mate"
                              onClick={() => {
                                editForm.setValues({
                                  id: b.id,
                                  name: b.name,
                                  qty: b.qty,
                                  price: b.price,
                                  createdAt: b.createdAt,
                                });
                                setBillID(b.id);
                                editOpen();
                              }}
                            >
                              <IconPencil stroke={1.5} />
                            </ActionIcon>
                          </Grid.Col>
                        </Grid>
                        <Divider mb={15} />
                      </React.Fragment>
                    );
                  })
                ) : (
                  <Text fw={600} mb={40} mt={20} ta="center" c="dimmed">
                    Please add bill to calculate
                  </Text>
                )}
              </Box>
              <Group grow>
                <Button
                  onClick={open}
                  radius={0}
                  mt={15}
                  size="sm"
                  color="#F06418"
                  variant="filled"
                >
                  Add Bill
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={
                    !user?.id || user?.user_banks?.length < 1 ? true : false
                  }
                  radius={0}
                  mt={15}
                  size="sm"
                  color="#F06418"
                  variant="light"
                >
                  Continue
                </Button>
              </Group>
            </Box>
          </Box>
        </>
      )}
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
          <form onSubmit={userForm.onSubmit(handleRegister)}>
            <Text>Name</Text>
            <Input
              pb={10}
              radius={0}
              placeholder="Your name"
              required
              {...userForm.getInputProps("name")}
            />
            <Text>Email</Text>
            <Input
              pb={10}
              radius={0}
              placeholder="Your email"
              required
              {...userForm.getInputProps("email")}
            />
            <Text>Bank</Text>
            <Input
              pb={10}
              radius={0}
              placeholder="Bank"
              required
              {...userForm.getInputProps("bank")}
            />
            <Text>Bank Account Name</Text>
            <Input
              pb={10}
              radius={0}
              placeholder="Bank Account Name"
              required
              {...userForm.getInputProps("bankAccountName")}
            />
            <Text>Bank Number</Text>
            <Input
              pb={10}
              radius={0}
              placeholder="Bank Number"
              required
              {...userForm.getInputProps("bankNumber")}
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
      <Drawer
        overlayProps={{ color: "#f2f2f2", backgroundOpacity: 0.5, blur: 4 }}
        opened={opened}
        onClose={close}
        position="bottom"
        withCloseButton={false}
      >
        <Box style={{ maxWidth: "480px", margin: "0 auto" }}>
          <Title order={3} mb={20}>
            Add Bill
          </Title>
          <form onSubmit={form.onSubmit(handleAddBill)}>
            <Text>Item Name</Text>
            <Input
              pb={10}
              radius={0}
              placeholder="Item name"
              required
              {...form.getInputProps("name")}
            />
            <Group grow style={{ alignItems: "flex-start" }}>
              <Box>
                <Text>Quantity</Text>
                <NumberInput
                  radius={0}
                  placeholder="Quantity"
                  required
                  {...form.getInputProps("qty")}
                />
              </Box>
              <Box>
                <Text>Price</Text>
                <NumberInput
                  radius={0}
                  placeholder="Price"
                  required
                  {...form.getInputProps("price")}
                />
              </Box>
            </Group>
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
              Add
            </Button>
          </form>
        </Box>
      </Drawer>
      <Drawer
        overlayProps={{ color: "#f2f2f2", backgroundOpacity: 0.5, blur: 4 }}
        opened={editOpened}
        onClose={editClose}
        position="bottom"
        withCloseButton={false}
      >
        <Box style={{ maxWidth: "480px", margin: "0 auto" }}>
          <Title order={3} mb={20}>
            Update Bill
          </Title>
          <form onSubmit={editForm.onSubmit(handleUpdate)}>
            <Text>Item Name</Text>
            <Input
              pb={10}
              radius={0}
              placeholder="Item name"
              required
              {...editForm.getInputProps("name")}
            />
            <Group grow style={{ alignItems: "flex-start" }}>
              <Box>
                <Text>Quantity</Text>
                <NumberInput
                  radius={0}
                  placeholder="Quantity"
                  required
                  {...editForm.getInputProps("qty")}
                />
              </Box>
              <Box>
                <Text>Price</Text>
                <NumberInput
                  radius={0}
                  placeholder="Price"
                  required
                  {...editForm.getInputProps("price")}
                />
              </Box>
            </Group>
            <Group grow>
              <Button
                radius={0}
                mt={15}
                size="sm"
                color="#F06418"
                variant="filled"
                loading={loading}
                type="submit"
              >
                Update
              </Button>
              <Button
                radius={0}
                mt={15}
                size="sm"
                color="#F06418"
                variant="light"
                onClick={() => {
                  handleDeleteBill(billID);
                  editClose();
                  setBillID("");
                }}
              >
                Delete
              </Button>
            </Group>
          </form>
        </Box>
      </Drawer>
    </Box>
  );
}
