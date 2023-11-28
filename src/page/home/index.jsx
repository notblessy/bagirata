import React, { useEffect, useState } from "react";
import { ActionIcon, Avatar, Box, Button, CloseButton, Divider, Drawer, Grid, Group, Input, NumberInput, Text, Title } from "@mantine/core";
import { IconMinus, IconPencil, IconPlus, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { isEmail, useForm } from "@mantine/form";
import { v4 as uuidv4 } from 'uuid';
import { useBills } from "../../libs/hooks/bill";
import { useMates } from "../../libs/hooks/mate";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

function generateID() {
  return uuidv4()
}

export default function Home() {
  const navigate = useNavigate();

  const [opened, { open, close }] = useDisclosure(false);
  const [nameOpened, { open: nameOpen, close: nameClose }] = useDisclosure(false);
  const [editOpened, { open: editOpen, close: editClose }] = useDisclosure(false);
  const [bankOpened, { open: bankOpen, close: bankClose }] = useDisclosure(false);

  const { data: user, onRegister, onAddMate, onDelete: onDeleteMate, onAddBank, onDeleteBank, loading } = useMates();

  const { data: bills, onUpsert, onDelete } = useBills({ ownerID: user?.id })

  const [mate, setMate] = useState();
  const [billID, setBillID] = useState();

  useEffect(() => {
    if (!user?.mates) {
      nameOpen();
    } else {
      nameClose()
    }

  }, [nameClose, nameOpen, user?.mates])

  const mateItems = user?.mates?.map((m) => {
    const splitted = m?.user_detail?.name.split(" ")

    let acr = ''
    if (splitted.length == 1) {
      acr = splitted[0].length > 2 ?
        splitted[0].substring(0, 2).toUpperCase() :
        splitted[0].toUpperCase();
    } else {
      acr = splitted.map((word) => word[0]).
        join('').
        toUpperCase();
    }

    return (
      <Box key={m.id} style={{ position: 'relative' }}>
        {
          !m?.me ?
            <ActionIcon
              style={{ position: 'absolute', left: '30px' }}
              color="#F06418"
              radius="xl"
              size="xs"
              variant="filled"
              aria-label="remove-mate"
              onClick={() => {
                onDeleteMate(m?.id)
              }}
            >
              <IconX stroke={1.5} />
            </ActionIcon>
            : null
        }
        <Avatar size={45} src={null} color="#F06418">{acr}</Avatar>
      </Box>
    )
  })

  const bankForm = useForm({
    initialValues: {
      bank_name: '',
      bank_account: '',
      bank_number: '',
    },

    validate: {
      bank_name: (value) => value == "" ? "empty form" : null,
      bank_account: (value) => value == "" ? "empty form" : null,
      bank_number: (value) => value == "" ? "empty form" : null,
    },
  });

  const userForm = useForm({
    initialValues: {
      id: '',
      name: '',
      email: '',
    },

    validate: {
      name: (value) => value == "" ? "empty form" : null,
      email: isEmail('Invalid email'),
    },
  });

  const form = useForm({
    initialValues: {
      name: '',
      owner_id: '',
      qty: 0,
      price: 0,
    },

    validate: {
      name: (value) => value == "" ? "empty form" : null,
      qty: (value) => value < 1 ? "not a number" : null,
      price: (value) => value < 1 ? "not a number" : null,
    },
  });

  const editForm = useForm({
    initialValues: {
      id: '',
      owner_id: '',
      name: '',
      qty: 0,
      price: 0,
    },

    validate: {
      name: (value) => value == "" ? "empty form" : null,
      qty: (value) => value < 1 ? "not a number" : null,
      price: (value) => value < 1 ? "not a number" : null,
    },
  });

  const handleAddMate = () => {
    if (mate !== "") {
      onAddMate({
        id: generateID(),
        owner_id: user.id,
        name: mate,
      })

      setMate('')

      return
    }

    notifications.show({
      title: "Error",
      message: "Form cannot be empty",
      color: "red",
    });

    return
  }

  const handleRegister = (user) => {
    onRegister({ id: generateID(), name: user.name, email: user.email })
    nameClose()

    userForm.reset()
  }

  const handleAddBill = (bill) => {
    bill.id = generateID()

    onUpsert({ id: bill.id, owner_id: user.id, name: bill.name, qty: +bill.qty, price: +bill.price })
    close()
    form.reset()
  }

  const handleUpdate = (bill) => {
    if (bill.id != "") {
      onUpsert({ id: bill.id, owner_id: user.id, name: bill.name, qty: +bill.qty, price: +bill.price })
      editClose()
      editForm.reset()
    }
  }

  const handleCreateBank = (bank) => {
    onAddBank({ owner_id: user?.id, bank_name: bank.bank_name, bank_account: bank.bank_account, bank_number: bank.bank_number })
    bankClose()

    userForm.reset()
  }

  const handleContinue = () => {
    navigate(user?.id)
  }

  return (
    <Box mt={30} style={{ padding: '10px 20px' }}>
      <Text c="#F06418" fz={12} fw={600}>Bagi Rata</Text>
      <Title order={1} c="#161617">Create your bill</Title>
      <Box style={{ width: '100%' }}>
        <Grid>
          <Grid.Col span={10}>
            <Input
              py={10}
              radius={0}
              placeholder="Input your mates"
              value={mate}
              onChange={(event) => setMate(event.currentTarget.value)}
              rightSectionPointerEvents="all"
              rightSection={
                <CloseButton
                  aria-label="Clear input"
                  onClick={() => setMate('')}
                  style={{ display: mate ? undefined : 'none' }}
                />
              }
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <ActionIcon
              radius={0}
              style={{ margin: '10px 0', width: '100%', alignItems: 'center' }}
              color="#F06418"
              size="36px"
              variant="light"
              aria-label="add-mate"
              onClick={handleAddMate}
            >
              <IconPlus stroke={1.5} />
            </ActionIcon>
          </Grid.Col>
        </Grid>
      </Box>
      <Group mt={10} gap="xs" style={{ padding: '10px 0' }}>
        {
          mateItems?.length > 0 ?
            mateItems
            :
            null
        }
      </Group>
      <Box>
        <Box mt={bills.length > 0 ? 20 : 0} style={{ padding: '10px 0' }}>
          {
            bills?.length > 0 ?
              bills?.map((b) => {
                return (
                  <React.Fragment key={b.id}>
                    <Grid mb={20}>
                      <Grid.Col span={12} pb={0}>
                        <Text fz={18} fw={600} c="#161617">{b.name}</Text>
                      </Grid.Col>
                      <Grid.Col span={4} m="auto 0" pt={0}>
                        <Text fz={14} fw={400} c="dimmed">{`Rp ${b.price.toLocaleString()}`}</Text>
                      </Grid.Col>
                      <Grid.Col span={2} m="auto 0" pt={0}>
                        <Text fz={12} fw={600} c="#161617" >{`x${b.qty}`}</Text>
                      </Grid.Col>
                      <Grid.Col span={4} pt={0} align="right" m="auto 0">
                        <Text fz={14} fw={600} c="#161617">{`Rp ${(b.price * b.qty).toLocaleString()}`}</Text>
                      </Grid.Col>
                      <Grid.Col span={2} align="right" m="auto 0">
                        <ActionIcon
                          radius={0}
                          color="#F06418"
                          size="36px"
                          variant="light"
                          aria-label="add-mate"
                          onClick={() => {
                            editForm.setValues({ id: b.id, name: b.name, qty: b.qty, price: b.price })
                            setBillID(b.id)
                            editOpen()
                          }}
                        >
                          <IconPencil stroke={1.5} />
                        </ActionIcon>
                      </Grid.Col>
                    </Grid>
                    <Divider mb={15} />
                  </React.Fragment>
                )
              })
              :
              <>
                <Text mb={20} fw={600} ta='center' c='dimmed'>Please add bill to calculate</Text>
                <Divider mb={15} />
              </>
          }
          <Box>
            <Group>
              <Title order={5} c="#161617">Transfer to:</Title>
              <ActionIcon
                onClick={() => bankOpen()}
                radius={0}
                size="sm"
                color="#F06418"
                variant="light"
              >
                <IconPlus style={{ padding: '2px' }} />
              </ActionIcon>
            </Group>
            {
              user?.user_banks?.length > 0 ?
                user?.user_banks?.map((b) => {
                  return (
                    <Box
                      key={b?.id}
                      mt={10}
                      p={10}
                      style={{ width: '100%', border: '1px solid #eee' }}
                    >
                      <Group justify="space-between">
                        <Box>
                          <Text fz={12} fw={800}>{b.bank_account}</Text>
                          <Group gap={5}>
                            <Text fz={12}>{`${b.bank_name} - ${b.bank_number}`}</Text>
                          </Group>
                        </Box>
                        <ActionIcon onClick={() => onDeleteBank(b.id)} radius={0} color="#F06418" variant="light"><IconMinus style={{ padding: '4px' }} /></ActionIcon>
                      </Group>
                    </Box>
                  )
                })
                :
                <Box m={15}>
                  <Text ta='center' c='dimmed'>Please add bank to transfer</Text>
                </Box>
            }
          </Box>
          <Group grow>
            <Button onClick={open} radius={0} mt={15} size="sm" color="#F06418" variant="filled">Add Bill</Button>
            <Button onClick={handleContinue} disabled={!user?.id || user?.user_banks?.length < 1 ? true : false} radius={0} mt={15} size="sm" color="#F06418" variant="light">Continue</Button>
          </Group>
        </Box>
        <Drawer
          overlayProps={{ color: '#f2f2f2', backgroundOpacity: 0.5, blur: 4 }}
          opened={nameOpened}
          onClose={nameClose}
          position="bottom"
          withCloseButton={false}
        >
          <Box style={{ maxWidth: '480px', margin: '0 auto' }}>
            <Title order={3} mb={20}>What is your name?</Title>
            <form onSubmit={userForm.onSubmit(handleRegister)}>
              <Text>Name</Text>
              <Input
                pb={10}
                radius={0}
                placeholder="Your name"
                required
                {...userForm.getInputProps('name')}

              />
              <Text>Email</Text>
              <Input
                pb={10}
                radius={0}
                placeholder="Your email"
                required
                {...userForm.getInputProps('email')}
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
          overlayProps={{ color: '#f2f2f2', backgroundOpacity: 0.5, blur: 4 }}
          opened={opened}
          onClose={close}
          position="bottom"
          withCloseButton={false}
        >
          <Box style={{ maxWidth: '480px', margin: '0 auto' }}>
            <Title order={3} mb={20}>Add Bill</Title>
            <form onSubmit={form.onSubmit(handleAddBill)}>
              <Text>Item Name</Text>
              <Input
                pb={10}
                radius={0}
                placeholder="Item name"
                required
                {...form.getInputProps('name')}
              />
              <Group grow style={{ alignItems: 'flex-start' }}>
                <Box>
                  <Text>Quantity</Text>
                  <NumberInput
                    radius={0}
                    placeholder="Quantity"
                    required
                    {...form.getInputProps('qty')}
                  />
                </Box>
                <Box>
                  <Text>Price</Text>
                  <NumberInput
                    radius={0}
                    placeholder="Price"
                    required
                    {...form.getInputProps('price')}
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
          overlayProps={{ color: '#f2f2f2', backgroundOpacity: 0.5, blur: 4 }}
          opened={editOpened}
          onClose={editClose}
          position="bottom"
          withCloseButton={false}
        >
          <Box style={{ maxWidth: '480px', margin: '0 auto' }}>
            <Title order={3} mb={20}>Update Bill</Title>
            <form onSubmit={editForm.onSubmit(handleUpdate)}>
              <Text>Item Name</Text>
              <Input
                pb={10}
                radius={0}
                placeholder="Item name"
                required
                {...editForm.getInputProps('name')}
              />
              <Group grow style={{ alignItems: 'flex-start' }}>
                <Box>
                  <Text>Quantity</Text>
                  <NumberInput
                    radius={0}
                    placeholder="Quantity"
                    required
                    {...editForm.getInputProps('qty')}
                  />
                </Box>
                <Box>
                  <Text>Price</Text>
                  <NumberInput
                    radius={0}
                    placeholder="Price"
                    required
                    {...editForm.getInputProps('price')}
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
                    onDelete(billID)
                    editClose()
                    setBillID('')
                  }}
                >
                  Delete
                </Button>
              </Group>
            </form>
          </Box>
        </Drawer>
        <Drawer
          overlayProps={{ color: '#f2f2f2', backgroundOpacity: 0.5, blur: 4 }}
          opened={bankOpened}
          onClose={bankClose}
          position="bottom"
          withCloseButton={false}
        >
          <Box style={{ maxWidth: '480px', margin: '0 auto' }}>
            <Title order={3} mb={20}>Create Bank</Title>
            <form onSubmit={bankForm.onSubmit(handleCreateBank)}>
              <Text>Bank Name</Text>
              <Input
                pb={10}
                radius={0}
                placeholder="Bank name"
                required
                {...bankForm.getInputProps('bank_name')}

              />
              <Text>Bank Account</Text>
              <Input
                pb={10}
                radius={0}
                placeholder="Bank Account"
                required
                {...bankForm.getInputProps('bank_account')}
              />
              <Text>Bank Number</Text>
              <Input
                pb={10}
                radius={0}
                placeholder="Bank Number"
                required
                {...bankForm.getInputProps('bank_number')}
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
      </Box >
    </Box >
  )
}