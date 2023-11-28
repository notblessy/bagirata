import React, { useEffect, useState } from "react";
import { ActionIcon, Avatar, Box, Button, Divider, Drawer, Grid, Group, Text, Title, UnstyledButton } from "@mantine/core";
import { IconMinus, IconPlus, IconReceiptOff } from "@tabler/icons-react";
import { useBills } from "../../libs/hooks/bill";
import { useMates } from "../../libs/hooks/mate";
import { useNavigate } from "react-router-dom";
import { useSplit } from "../../libs/hooks/split";
import { useDisclosure } from "@mantine/hooks";

export default function Assign() {
  const navigate = useNavigate();

  const { data: user } = useMates();

  const [mate, setMate] = useState();

  useEffect(() => {
    if (user) {
      setMate(user?.mates[0])
    }
  }, [user])


  const [continueOpened, { open: continueOpen, close: continueClose }] = useDisclosure(false);
  
  const mateID = mate?.user_detail?.id ? mate?.user_detail?.id : ''
  const { data: bills, onAddShare, onBulkAddShare } = useBills({ ownerID: user?.id, mateID: mateID })
  const {onAdd: onCalculate} = useSplit('')

  const mateItems = user?.mates?.map((m) => {
    const splitted = m?.user_detail.name.split(" ")

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
      <UnstyledButton
        key={m.id}
        onClick={() => {
          if (mate?.user_id === m?.user_id) {
            setMate(null)
            return
          }

          setMate({ ...m, me: false })
        }}
        style={{ position: 'relative' }}
      >
        <Avatar
          size={45}
          src={null}
          color="#F06418"
          variant={mate?.user_detail?.id === m?.user_detail?.id ? "filled" : "light"}
        >
          {acr}
        </Avatar>
      </UnstyledButton>
    )
  })

  const isAbleToComplete = bills?.some(b => (b.qty !== b.taken) && !b.split_payment)

  const handleSplit = () => {
    onCalculate({owner_id: user?.id})
  }

  return (
    <Box mt={30} style={{ padding: '10px 20px' }}>
      <Text c="#F06418" fz={12} fw={600}>Bagi Rata</Text>
      <Title order={1} c="#161617">Assign Mates</Title>
      <Group mt={10} gap="xs" style={{ padding: '10px 0' }}>
        {
          mateItems
        }
      </Group>
      <Box>
        <Box mt={bills.length > 0 ? 20 : 0} style={{ padding: '10px 0' }}>
          {
            mate?.id ?
              bills?.length > 0 ?
                bills?.map((b) => {
                  const takenQty = b?.shares ? b.shares?.reduce((acc, value) => {
                    acc += value.qty
                    return acc
                  }, 0) : 0

                  const disableSubButton = () => {
                    if (takenQty === 0 || b?.split_payment) {
                      return true
                    }
                  }

                  const disableAddButton = () => {
                    if (b.taken >= b.qty || b?.split_payment) {
                      return true
                    }

                    return false
                  }

                  const disableSplitButton = () => {
                    if (b.taken > 0) {
                      return true
                    }

                    return false
                  }

                  const actualPrice = b?.shares ? b.shares?.reduce((acc, value) => {
                    acc += value.price
                    return acc
                  }, 0) : 0

                  return (
                    <React.Fragment key={b.id}>
                      <Grid mb={20}>
                        <Grid.Col span={12} pb={0}>
                          <Text fz={18} fw={600} c="#161617">{b.name}</Text>
                        </Grid.Col>
                        <Grid.Col span={6} m="auto 0" pt={0}>
                          <Text fz={14} fw={400} c="dimmed">{`Rp ${actualPrice.toLocaleString()}`}</Text>
                        </Grid.Col>
                        <Grid.Col span={6} m="auto 0" pt={0}>
                          <Group justify="right">
                          <ActionIcon
                              disabled={disableSplitButton()}
                              radius={0}
                              color="#F06418"
                              size="25px"
                              variant={b?.split_payment ? "filled" : "light"}
                              aria-label="bulk-share"
                              onClick={() => {
                                const shares = {
                                  type: "BULK",
                                  owner_id: user?.id,
                                  bill_id: b.id,
                                  mates: user?.mates?.map((m) => {
                                    return {
                                      mate_id: m?.user_detail?.id,
                                      mate_name: m?.user_detail?.name,
                                    }
                                  }),
                                  split_payment: true
                                }

                                onBulkAddShare(shares)
                              }}
                            >
                              <IconReceiptOff style={{ padding: '4px' }} />
                            </ActionIcon>
                            <ActionIcon
                              disabled={disableSubButton()}
                              radius={0}
                              color="#F06418"
                              size="25px"
                              variant="light"
                              aria-label="add-mate"
                              onClick={() => {
                                const share = {
                                  type: "SUB",
                                  owner_id: user?.id,
                                  bill_id: b.id,
                                  mate_id: mate?.user_detail?.id,
                                  mate_name: mate?.user_detail?.name,
                                  qty: 1,
                                  price: +b.price,
                                  split_payment: false
                                }

                                onAddShare(share)
                              }}
                            >
                              <IconMinus style={{ padding: '4px' }} />
                            </ActionIcon>
                            <Text fz={12} fw={600} c="#161617">{b?.split_payment ? "split": `x${takenQty}`}</Text>
                            <ActionIcon
                              disabled={disableAddButton()}
                              radius={0}
                              color="#F06418"
                              size="25px"
                              variant="light"
                              aria-label="add-mate"
                              onClick={() => {
                                const share = {
                                  owner_id: user?.id,
                                  bill_id: b.id,
                                  mate_id: mate?.user_detail?.id,
                                  mate_name: mate?.user_detail?.name,
                                  qty: 1,
                                  price: +b.price,
                                  split_payment: false
                                }

                                onAddShare(share)
                              }}
                            >
                              <IconPlus style={{ padding: '4px' }} />
                            </ActionIcon>
                          </Group>
                        </Grid.Col>
                      </Grid>
                      <Divider mb={15} />
                    </React.Fragment>
                  )
                })
                :
                <>
                  <Text my={15} fz={16} fw={600} c="dimmed" ta="center">Empty Bill</Text>
                  <Divider />
                </>
              :
              <>
                <Text my={15} fz={16} fw={600} c="dimmed" ta="center">Mate not selected</Text>
                <Divider />
              </>
          }
          <Group grow>
            <Button onClick={() => navigate("/")} radius={0} mt={15} size="sm" color="#F06418" variant="filled">Back</Button>
            <Button onClick={() => continueOpen()} disabled={!user?.id || isAbleToComplete ? true : false} radius={0} mt={15} size="sm" color="#F06418" variant="light">Continue</Button>
          </Group>
        </Box>
        <Drawer
          overlayProps={{ color: '#f2f2f2', backgroundOpacity: 0.5, blur: 4 }}
          opened={continueOpened}
          onClose={continueClose}
          position="bottom"
          withCloseButton={false}
        >
          <Box style={{ maxWidth: '480px', margin: '0 auto' }}>
            <Title order={3} mb={5}>Update Bill</Title>
            <Text mb={10} fz={16} fw={400} c="dimmed">{"You won't be able to edit the data after finishing it"}</Text>
            <Group grow>
              <Button onClick={() => continueClose()} radius={0} mt={15} size="sm" color="#F06418" variant="filled">Cancel</Button>
              <Button onClick={handleSplit} disabled={!user?.id || isAbleToComplete ? true : false} radius={0} mt={15} size="sm" color="#F06418" variant="light">Okay</Button>
            </Group>
          </Box>
        </Drawer>
      </Box >
    </Box >
  )
}