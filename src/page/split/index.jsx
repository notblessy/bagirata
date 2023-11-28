import React, { useEffect, useState } from "react";
import { Box, Button, Divider, Grid, Group, Text, Title, UnstyledButton } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useSplit } from "../../libs/hooks/split";
import { format } from "date-fns";
import { notifications } from "@mantine/notifications";
import { IconCopy } from "@tabler/icons-react";
import { randomId } from "@mantine/hooks";

export default function Split() {
  const { splitID } = useParams()
  const currentURL = window.location.href;

  const [copied, setCopied] = useState()
  const [copiedBank, setCopiedBank] = useState()
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
      <React.Fragment key={m.id + randomId}>
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
                <React.Fragment key={i.id + randomId}>
                  <Grid.Col span={6} m="auto 0" py={0}>
                    <Text fz={14} fw={400} c="dimmed">{i.name}</Text>
                  </Grid.Col>
                  <Grid.Col span={1} m="auto 0" py={0}>
                    <Text fz={14} fw={400} c="dimmed">{`x${i.qty}`}</Text>
                  </Grid.Col>
                  <Grid.Col span={5} m="auto 0" py={0}>
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentURL)
      .then(() => {
        setCopied(true);
        notifications.show({
          title: "Success",
          message: "Link copied to clipboard",
          color: "cyan",
        });
        setTimeout(() => {
          setCopied(false);
        }, 1500);
      })
      .catch(err => {
        console.error('Unable to copy to clipboard', err);
      });
  };

  return (
    <>
      <Box pt={30} pb={10} px={20} style={{ background: '#FFF4EB' }}>
        <Text c="#F06418" fz={12} fw={600}>Bagi Rata</Text>
        <Title order={1} c="#161617">Split Bills</Title>
        <Title order={5} c="#161617">{`${split?.owner_detail?.name} - ${date}`}</Title>
      </Box>
      <Box style={{ padding: '10px 20px' }}>
        <Box style={{ padding: '10px 0' }}>
          {
            mateItems
          }
        </Box>
        <Box>
          <Title order={5} c="#161617">Transfer to:</Title>
          {
            split?.owner_detail?.user_banks?.map((b) => {
              return (
                <UnstyledButton
                  key={b?.id}
                  disabled={copiedBank}
                  mt={10}
                  p={10}
                  style={{ width: '100%', border: '1px solid #eee' }}
                  onClick={() => {
                    navigator.clipboard.writeText(b?.bank_number)
                      .then(() => {
                        setCopiedBank(true);
                        notifications.show({
                          title: "Success",
                          message: "Bank number copied to clipboard",
                          color: "cyan",
                        });
                        setTimeout(() => {
                          setCopiedBank(false);
                        }, 1500);
                      })
                      .catch(err => {
                        console.error('Unable to copy to clipboard', err);
                      });
                  }}
                >
                  <Text fz={12} fw={800}>{b.bank_account}</Text>
                  <Group gap={5}>
                    <Text fz={12}>{`${b.bank_name} - ${b.bank_number}`}</Text>
                    <IconCopy size={15} />
                  </Group>
                </UnstyledButton>
              )
            })
          }
        </Box>
        <Box>
          <Button onClick={handleCopyLink} disabled={copied} radius={0} mt={25} size="sm" fullWidth color="#F06418" variant="filled">Share</Button>
        </Box>
      </Box >
    </>
  )
}