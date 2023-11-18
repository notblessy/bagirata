import { notifications } from "@mantine/notifications";
import { useCallback, useState } from "react";
import api from "../utils/api";
import useSWR, { mutate } from "swr";

export const useSplit = ({ id }) => {
  const [loading, setLoading] = useState();
  // eslint-disable-next-line no-unused-vars
  const pathKey = `v1/splits/${id}`;
  const { data, error, isValidating } = useSWR(pathKey);

  const onAdd = useCallback(
    async ({ owner_id }) => {
      setLoading(true);
      try {
        const { data: res } = await api.post(`/v1/splits/${owner_id}`);
        if (res.message === "success") {
          mutate(pathKey)
          notifications.show({
            title: "Success",
            message: "Split created!",
            color: "blue",
          });
        } else {
          notifications.show({
            title: "Error",
            message: "Something went wrong!",
            color: "red",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: error,
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    data: data,
    onAdd,
    error,
    loading: loading || isValidating
  };
}