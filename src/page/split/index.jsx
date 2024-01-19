import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { format } from "date-fns";
import { notifications } from "@mantine/notifications";
import { IconCopy } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useSplit } from "../../libs/hooks/split";

export default function Split() {
  // eslint-disable-next-line no-unused-vars
  const { id } = useParams();
  const url = window.location.href;

  const { data: user } = useSplit({ id });

  const [copied, setCopied] = useState();
  const [copiedBank, setCopiedBank] = useState();
  const [date, setDate] = useState();

  useEffect(() => {
    if (user?.createdAt) {
      const d = format(new Date(user?.createdAt), "dd MMM yyyy");
      setDate(d);
    }
  }, [user]);

  const friendItems = user?.friends?.map((f) => {
    const grandTotal = f?.items.reduce((prev, i) => {
      prev += i.subTotal;
      return prev;
    }, 0);

    return (
      <React.Fragment key={f.id}>
        <Grid pb={35}>
          <Grid.Col span={12} pb={0}>
            <Group grow>
              <Text fz={18} fw={600} c="#161617">
                {f.name}
              </Text>
              <Text
                fz={18}
                fw={600}
                c="#161617"
                ta="right"
              >{`Rp ${grandTotal.toLocaleString()}`}</Text>
            </Group>
          </Grid.Col>
          {f?.items?.map((i) => {
            return (
              <React.Fragment key={i.billID + f.id}>
                <Grid.Col span={6} m="auto 0" py={0}>
                  <Text fz={14} fw={400} c="dimmed">
                    {i.billName}
                  </Text>
                </Grid.Col>
                <Grid.Col span={1} m="auto 0" py={0}>
                  <Text fz={14} fw={400} c="dimmed">{`x${i.qty}`}</Text>
                </Grid.Col>
                <Grid.Col span={5} m="auto 0" py={0}>
                  <Text
                    fz={14}
                    fw={400}
                    c="dimmed"
                    ta="right"
                  >{`Rp ${i.subTotal.toLocaleString()}`}</Text>
                </Grid.Col>
              </React.Fragment>
            );
          })}
        </Grid>
        <Divider mb={15} />
      </React.Fragment>
    );
  });

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(url)
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
      .catch((err) => {
        console.error("Unable to copy to clipboard", err);
      });
  };

  return (
    <>
      <Box pt={30} pb={10} px={20} style={{ background: "#FFF4EB" }}>
        <Text c="#F06418" fz={12} fw={600}>
          Bagi Rata
        </Text>
        <Title order={1} c="#161617">
          Split Bills
        </Title>
        <Title order={5} c="#161617">{`${user?.name} - ${date}`}</Title>
      </Box>
      <Box style={{ padding: "10px 20px" }}>
        <Box style={{ padding: "10px 0" }}>{friendItems}</Box>
        <Box>
          <Title order={5} c="#161617">
            Transfer to:
          </Title>
          <UnstyledButton
            disabled={copiedBank}
            mt={10}
            p={10}
            style={{ width: "100%", border: "1px solid #eee" }}
            onClick={() => {
              navigator.clipboard
                .writeText(user?.bank.bankNumber)
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
                .catch((err) => {
                  console.error("Unable to copy to clipboard", err);
                });
            }}
          >
            <Text fz={12} fw={800}>
              {user?.bank?.bankAccountName}
            </Text>
            <Group gap={5}>
              <Text
                fz={12}
              >{`${user?.bank?.bank} - ${user?.bank?.bankNumber}`}</Text>
              <IconCopy size={15} />
            </Group>
          </UnstyledButton>
        </Box>
        <Box>
          <Button
            onClick={handleCopyLink}
            disabled={copied}
            radius={0}
            mt={25}
            size="sm"
            fullWidth
            color="#F06418"
            variant="filled"
          >
            Share
          </Button>
        </Box>
      </Box>
    </>
  );
}
