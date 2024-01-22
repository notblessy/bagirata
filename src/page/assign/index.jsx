import React, { useEffect, useState } from "react";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Group,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { IconMinus, IconPlus, IconReceiptOff } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { useCookies } from "react-cookie";
import { notifications } from "@mantine/notifications";
import { useSplit } from "../../libs/hooks/split";

export default function Assign() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(["session"]);

  const userID = cookies?.userID;

  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null);

  const [friend, setFriend] = useState();

  const { onAdd, loading } = useSplit({ id: "" });

  useEffect(() => {
    const userData = localStorage.getItem(userID);
    if (!userData) {
      navigate("/");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
  }, [userID, user, navigate]);

  const [continueOpened, { open: continueOpen, close: continueClose }] =
    useDisclosure(false);

  const friendItems = user?.friends?.map((f) => {
    const splitted = f?.name.split(" ");

    let acr = "";
    if (splitted.length == 1) {
      acr =
        splitted[0].length > 2
          ? splitted[0].substring(0, 2).toUpperCase()
          : splitted[0].toUpperCase();
    } else {
      acr = splitted
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    }

    return (
      <UnstyledButton
        key={f.id}
        onClick={() => {
          if (friend?.id === f?.id) {
            setFriend(null);
            return;
          }

          setFriend(f);
        }}
        style={{ position: "relative" }}
      >
        <Avatar
          size={45}
          src={null}
          color="#F06418"
          variant={friend?.id === f?.id ? "filled" : "light"}
        >
          {acr}
        </Avatar>
      </UnstyledButton>
    );
  });

  const isAbleToComplete = user?.bills?.some(
    (b) => b.qty !== b.taken && !b.splitPayment
  );

  const handleOkay = () => {
    onAdd(user);

    const friends = user?.friends?.map((f) => {
      return {
        ...f,
        items: [],
      };
    });

    user.friends = friends;
    user.bills = [];

    localStorage.setItem(user.id, JSON.stringify(user));
  };

  return (
    <Box pos="relative">
      <Box mt={30} style={{ padding: "10px 20px" }}>
        <Text c="#F06418" fz={12} fw={600}>
          Bagi Rata
        </Text>
        <Title order={1} c="#161617">
          Assign Friend
        </Title>
        <Group mt={10} gap="xs" style={{ padding: "10px 0" }}>
          {friendItems}
        </Group>
        <Box>
          <Box
            mt={user?.bills?.length > 0 ? 20 : 0}
            style={{ padding: "10px 0" }}
          >
            {friend?.id ? (
              user?.bills?.map((b) => {
                const totalTakenQty = b?.shares
                  ? b.shares?.reduce((acc, value) => {
                      acc += value.qty;

                      return acc;
                    }, 0)
                  : 0;

                const takenQty = b?.shares
                  ? b.shares?.reduce((acc, value) => {
                      if (value.ownerID === friend.id) {
                        acc += value.qty;
                      }

                      return acc;
                    }, 0)
                  : 0;

                const disableSubButton = () => {
                  if (takenQty === 0 || b?.splitPayment) {
                    return true;
                  }
                };

                const disableAddButton = () => {
                  if ((b.taken && b.taken >= b.qty) || b?.splitPayment) {
                    return true;
                  }

                  return false;
                };

                const disableSplitButton = () => {
                  if (b.taken && b.taken > 0) {
                    return true;
                  }

                  return false;
                };

                const actualPrice = b?.shares
                  ? b.shares?.reduce((acc, value) => {
                      if (friend.id === value.ownerID) {
                        acc += value.price;
                      }

                      return acc;
                    }, 0)
                  : 0;

                return (
                  <React.Fragment key={b.id}>
                    <Grid mb={20}>
                      <Grid.Col span={12} pb={0}>
                        <Text fz={18} fw={600} c="#161617">
                          {b.name}
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={6} m="auto 0" pt={0}>
                        <Text fz={14} fw={400} c="dimmed">{`Rp ${
                          b?.splitPayment
                            ? (b.price / user?.friends?.length).toLocaleString()
                            : actualPrice.toLocaleString()
                        }`}</Text>
                      </Grid.Col>
                      <Grid.Col span={6} m="auto 0" pt={0}>
                        <Group justify="right">
                          <ActionIcon
                            disabled={disableSplitButton()}
                            radius={0}
                            color="#F06418"
                            size="25px"
                            variant={b?.splitPayment ? "filled" : "light"}
                            aria-label="split-share"
                            onClick={() => {
                              if (b?.taken > 0) {
                                notifications.show({
                                  title: "Error",
                                  message:
                                    "Cannot split payment when there is a taken item",
                                  color: "red",
                                });
                              }

                              if (b.splitPayment) {
                                const updatedFriends = user?.friends?.map(
                                  (u) => {
                                    u.items = u?.items || [];
                                    u.items = u.items.filter(
                                      (i) => i.billID !== b.id
                                    );

                                    return {
                                      ...u,
                                      items: u.items,
                                    };
                                  }
                                );

                                user.friends = updatedFriends;
                              } else {
                                const item = {
                                  billID: b.id,
                                  billName: b.name,
                                  price: +b.price,
                                  qty: 1,
                                  subTotal:
                                    (+b.price * +b.qty) / user?.friends?.length,
                                  createdAt: new Date(),
                                };

                                const updatedFriends = user?.friends?.map(
                                  (u) => {
                                    u.items = u?.items ? u?.items : [];
                                    u.items = u?.items?.filter(
                                      (i) => i.billID !== b.id
                                    );

                                    u.items.push(item);

                                    return {
                                      ...u,
                                      items: u.items,
                                    };
                                  }
                                );

                                user.friends = updatedFriends;
                              }

                              b.splitPayment = b.splitPayment ? false : true;

                              user.bills = user?.bills
                                ? user?.bills.filter((bill) => bill.id !== b.id)
                                : [];
                              user.bills.push(b);
                              user?.bills?.sort(
                                (a, b) =>
                                  new Date(a.createdAt) - new Date(b.createdAt)
                              );

                              setUser(user);
                              const jsonData = JSON.stringify(user);
                              localStorage.setItem(user.id, jsonData);
                            }}
                          >
                            <IconReceiptOff style={{ padding: "4px" }} />
                          </ActionIcon>
                          <ActionIcon
                            disabled={disableSubButton()}
                            radius={0}
                            color="#F06418"
                            size="25px"
                            variant="light"
                            aria-label="add-mate"
                            onClick={() => {
                              const payload = {
                                ownerID: friend.id,
                                billID: b.id,
                                friendName: friend.name,
                                price: +b.price,
                                qty: takenQty < 0 ? takenQty - 1 : 0,
                                splitPayment: false,
                                createdAt: new Date(),
                              };

                              b.taken =
                                totalTakenQty > 0 ? totalTakenQty - 1 : 0;

                              b.shares = b.shares ? b.shares : [];
                              b.shares = b.shares
                                ? b.shares.filter(
                                    (s) => s.ownerID !== friend.id
                                  )
                                : [];
                              if (payload.qty > 0) {
                                b?.shares?.push(payload);
                              }

                              user.bills = user?.bills
                                ? user?.bills.filter((bill) => bill.id !== b.id)
                                : [];
                              user?.bills?.push(b);
                              user?.bills?.sort(
                                (a, b) =>
                                  new Date(a.createdAt) - new Date(b.createdAt)
                              );

                              const item = {
                                billID: b.id,
                                billName: b.name,
                                price: +b.price,
                                qty: +payload.qty,
                                subTotal: +payload.qty * +b.price,
                                createdAt: new Date(),
                              };

                              friend.items = friend?.items ? friend?.items : [];
                              friend.items = friend?.items
                                ? friend?.items.filter((i) => i.billID !== b.id)
                                : [];
                              if (item.qty > 0) {
                                friend.items.push(item);
                              }

                              user.friends = user?.friends
                                ? user.friends.filter((f) => f.id !== friend.id)
                                : [];
                              user.friends.push(friend);
                              user.friends.sort((a, b) => {
                                if (b.me - a.me !== 0) {
                                  return b.me - a.me;
                                }

                                return (
                                  new Date(a.createdAt) - new Date(b.createdAt)
                                );
                              });

                              setUser(user);
                              const jsonData = JSON.stringify(user);
                              localStorage.setItem(user.id, jsonData);
                            }}
                          >
                            <IconMinus style={{ padding: "4px" }} />
                          </ActionIcon>
                          <Text fz={12} fw={600} c="#161617">
                            {b?.splitPayment ? "split" : `x${takenQty}`}
                          </Text>
                          <ActionIcon
                            disabled={disableAddButton()}
                            radius={0}
                            color="#F06418"
                            size="25px"
                            variant="light"
                            aria-label="add-mate"
                            onClick={() => {
                              const payload = {
                                ownerID: friend.id,
                                billID: b.id,
                                friendName: friend.name,
                                price: +b.price,
                                qty: takenQty < b.qty ? takenQty + 1 : 0,
                                splitPayment: false,
                                createdAt: new Date(),
                              };

                              b.taken =
                                totalTakenQty < b.qty
                                  ? totalTakenQty + 1
                                  : totalTakenQty;

                              b.shares = b?.shares
                                ? b?.shares.filter(
                                    (s) => s.ownerID !== friend.id
                                  )
                                : [];
                              if (payload.qty > 0) {
                                b?.shares?.push(payload);
                              }

                              user.bills = user?.bills
                                ? user?.bills.filter((bill) => bill.id !== b.id)
                                : [];
                              user?.bills?.push(b);
                              user?.bills?.sort(
                                (a, b) =>
                                  new Date(a.createdAt) - new Date(b.createdAt)
                              );

                              const item = {
                                billID: b.id,
                                billName: b.name,
                                price: +b.price,
                                qty: +payload.qty,
                                subTotal: +payload.qty * +b.price,
                                createdAt: new Date(),
                              };

                              friend.items = friend?.items ? friend?.items : [];
                              friend.items = friend?.items
                                ? friend?.items.filter((i) => i.billID !== b.id)
                                : [];
                              if (item.qty > 0) {
                                friend.items.push(item);
                              }

                              user.friends = user?.friends
                                ? user?.friends.filter(
                                    (f) => f.id !== friend.id
                                  )
                                : [];
                              user.friends.push(friend);
                              user.friends.sort((a, b) => {
                                if (b.me - a.me !== 0) {
                                  return b.me - a.me;
                                }

                                return (
                                  new Date(a.createdAt) - new Date(b.createdAt)
                                );
                              });

                              setUser(user);
                              const jsonData = JSON.stringify(user);
                              localStorage.setItem(user.id, jsonData);
                            }}
                          >
                            <IconPlus style={{ padding: "4px" }} />
                          </ActionIcon>
                        </Group>
                      </Grid.Col>
                    </Grid>
                    <Divider mb={15} />
                  </React.Fragment>
                );
              })
            ) : (
              <>
                <Text my={15} fz={16} fw={600} c="dimmed" ta="center">
                  Friend not selected
                </Text>
                <Divider />
              </>
            )}
            <Group grow>
              <Button
                onClick={() => navigate("/")}
                radius={0}
                mt={15}
                size="sm"
                color="#F06418"
                variant="filled"
              >
                Back
              </Button>
              <Button
                onClick={() => continueOpen()}
                disabled={!user?.id || isAbleToComplete ? true : false}
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
          <Drawer
            overlayProps={{ color: "#f2f2f2", backgroundOpacity: 0.5, blur: 4 }}
            opened={continueOpened}
            onClose={continueClose}
            position="bottom"
            withCloseButton={false}
          >
            <Box style={{ maxWidth: "480px", margin: "0 auto" }}>
              <Title order={3} mb={5}>
                Are you sure?
              </Title>
              <Text mb={10} fz={16} fw={400} c="dimmed">
                {"You won't be able to edit the data after finishing it"}
              </Text>
              <Group grow>
                <Button
                  onClick={() => continueClose()}
                  radius={0}
                  mt={15}
                  size="sm"
                  color="#F06418"
                  variant="filled"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleOkay}
                  loading={loading}
                  disabled={
                    !user?.id || isAbleToComplete || loading ? true : false
                  }
                  radius={0}
                  mt={15}
                  size="sm"
                  color="#F06418"
                  variant="light"
                >
                  Okay
                </Button>
              </Group>
            </Box>
          </Drawer>
        </Box>
      </Box>
    </Box>
  );
}
