import React, { useEffect, useState } from "react";
import { Box, Divider, Grid, Group, Text, Title, UnstyledButton } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useSplit } from "../../libs/hooks/split";
import { format } from "date-fns";

export default function Split() {
  const { splitID } = useParams()

  const [date, setDate] = useState()

  const { data: split } = useSplit({ id: splitID });

  useEffect(() => {
    if (split?.created_at) {
      const d = format(new Date(split?.created_at), 'dd MMM yyyy')
      setDate(d)
    }

  }, [split])

  const mateItems = split?.split_mates?.map((m) => {
    return (
      <React.Fragment key={m.id}>
        <Grid pb={35}>
          <Grid.Col span={12} pb={0}>
            <Group grow>
              <Text fz={18} fw={600} c="#161617">{m.name}</Text>
              <Text fz={18} fw={600} c="#161617" ta="right">{`Rp ${m.grand_total.toLocaleString()}`}</Text>
            </Group>
          </Grid.Col>
          {
            m?.split_items?.map((i) => {
              return (
                <React.Fragment key={i.id + i.qty}>
                  <Grid.Col span={6} m="auto 0" py={0}>
                    <Text fz={14} fw={400} c="dimmed">{i.name}</Text>
                  </Grid.Col>
                  <Grid.Col key={i.id} span={1} m="auto 0" py={0}>
                    <Text fz={14} fw={400} c="dimmed">{`x${i.qty}`}</Text>
                  </Grid.Col>
                  <Grid.Col key={i.id} span={5} m="auto 0" py={0}>
                    <Text fz={14} fw={400} c="dimmed" ta="right">{`Rp ${i.total.toLocaleString()}`}</Text>
                  </Grid.Col>
                </React.Fragment>
              )
            })
          }
        </Grid>
        <Divider mb={15} />
      </React.Fragment>
    )
  })

  return (
    <Box mt={30} style={{ padding: '10px 20px' }}>
      <Text c="#F06418" fz={12} fw={600}>Bagi Rata</Text>
      <Title order={1} c="#161617">Split Bills</Title>
      <Title order={5} c="#161617">{date}</Title>
      <Box mt={20} style={{ padding: '10px 0' }}>
        {
          mateItems
        }
      </Box>
      <Box>
        <Title order={5} c="#161617">Transfer to:</Title>
        <UnstyledButton mt={10} p={10} style={{ width: '100%', background: "#FFF0E4" }}>
          {
            split?.owner_detail?.user_banks?.map((b) => {
              return (
                <>
                  <Text fz={12} fw={800}>{b.bank_account}</Text>
                  <Group>
                    <Text fz={12}>{b.bank_name}</Text>
                    <Text fz={12}>{b.bank_number}</Text>
                  </Group>
                </>
              )
            })
          }
        </UnstyledButton>
      </Box>
    </Box >
  )
}