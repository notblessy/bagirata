import React, { useEffect, useState } from "react";
import { ActionIcon, Avatar, Box, Button, Divider, Grid, Group, Text, Title, UnstyledButton } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useBills } from "../../libs/hooks/bill";
import { useMates } from "../../libs/hooks/mate";
import { useNavigate } from "react-router-dom";

export default function Assign() {
  const navigate = useNavigate();

  const { data: user, acronym } = useMates();

  const [mate, setMate] = useState();

  useEffect(() => {
    if (user) {
      setMate({
        id: user?.id,
        name: user?.name,
        me: true,
      })
    }
  }, [user])


  const mateID = mate?.me ? mate?.id : mate?.user_detail?.id ? mate?.user_detail?.id : ''
  const { data: bills, onAddShare } = useBills({ ownerID: user?.id, mateID: mateID })

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
          if (mate?.user_detail?.id === m?.user_detail?.id) {
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

  const handleSplit = () => {
    // navigate(`${m.id}/split`)
  }

  return (
    <Box mt={30} style={{ padding: '10px 20px' }}>
      <Text c="#F06418" fz={12} fw={600}>Bagi Rata</Text>
      <Title order={1} c="#161617">Assign Mates</Title>
      <Group mt={10} gap="xs" style={{ padding: '10px 0' }}>
        <UnstyledButton
          onClick={() => {
            if (mate?.me) {
              setMate(null)
              return
            }

            setMate({ ...user, me: true })
          }}
          style={{ position: 'relative' }}
        >
          <Avatar
            size={45}
            src={null}
            color="#F06418"
            variant={mate?.me ? "filled" : "light"}
          >
            {acronym}
          </Avatar>
        </UnstyledButton>
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
                    if (takenQty > 0 && b.taken >= b.qty) {
                      return false
                    }

                    if (takenQty === 0 && b.taken >= b.qty) {
                      return true
                    }

                    return true
                  }

                  const disableAddButton = () => {
                    if (b.taken >= b.qty) {
                      return true
                    }

                    return false
                  }

                  return (
                    <React.Fragment key={b.id}>
                      <Grid mb={20}>
                        <Grid.Col span={12} pb={0}>
                          <Text fz={18} fw={600} c="#161617">{b.name}</Text>
                        </Grid.Col>
                        <Grid.Col span={8} m="auto 0" pt={0}>
                          <Text fz={14} fw={400} c="dimmed">{`Rp ${(b.price * takenQty).toLocaleString()}`}</Text>
                        </Grid.Col>
                        <Grid.Col span={4} m="auto 0" pt={0}>
                          <Group>
                            <ActionIcon
                              disabled={disableSubButton()}
                              radius={0}
                              color="#F06418"
                              size="36px"
                              variant="light"
                              aria-label="add-mate"
                              onClick={() => {
                                const share = {
                                  type: "SUB",
                                  owner_id: user?.id,
                                  bill_id: b.id,
                                  mate_id: mate.me ? mate?.id : mate?.user_detail?.id,
                                  mate_name: mate.me ? mate?.name : mate?.user_detail?.name,
                                  qty: 1,
                                  price: +b.price
                                }

                                onAddShare(share)
                              }}
                            >
                              <IconMinus stroke={1.5} />
                            </ActionIcon>
                            <Text fz={12} fw={600} c="#161617">{`x${takenQty}`}</Text>
                            <ActionIcon
                              disabled={disableAddButton()}
                              radius={0}
                              color="#F06418"
                              size="36px"
                              variant="light"
                              aria-label="add-mate"
                              onClick={() => {
                                const share = {
                                  owner_id: user?.id,
                                  bill_id: b.id,
                                  mate_id: mate.me ? mate?.id : mate?.user_detail?.id,
                                  mate_name: mate.me ? mate?.name : mate?.user_detail?.name,
                                  qty: 1,
                                  price: +b.price
                                }

                                onAddShare(share)
                              }}
                            >
                              <IconPlus stroke={1.5} />
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
            <Button onClick={handleSplit} disabled={!user?.id ?? true} radius={0} mt={15} size="sm" color="#F06418" variant="light">Continue</Button>
          </Group>
        </Box>
      </Box >
    </Box >
  )
}