import { useCallback, useState } from "react";
import useSWR, { mutate } from "swr";

import api from "../utils/api";
import { notifications } from "@mantine/notifications";

export const useBills = ({ ownerID, mateID }) => {
  const [loading, setLoading] = useState(false);

  const pathKey = `v1/bills?owner_id=${ownerID}&mate_id=${mateID}`;
  const { data, error, isValidating } = useSWR(pathKey);

  const onUpsert = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const { data: res } = await api.post("v1/bills", data);

        if (res.message === "success") {
          mutate(pathKey);
          notifications.show({
            title: "Success",
            message: "Success create bill",
            color: "blue",
          });
        } else {
          notifications.show({
            title: "Error",
            message: res.message,
            color: "red",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Something went wrong",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    },
    [pathKey]
  );

  const onDelete = useCallback(
    async (id) => {
      try {
        setLoading(true);

        const { data: res } = await api.delete(`/v1/bills/${id}`);

        if (res.message === "success") {
          mutate(pathKey);
          notifications.show({
            title: "Success",
            message: "Bill has deleted",
            color: "blue",
          });
        } else {
          notifications.show({
            title: "Error",
            message: res.message,
            color: "red",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Something went wrong",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    },
    [pathKey]
  );

  const onAddShare = useCallback(
    async (data) => {
      try {
        setLoading(true);

        const { data: res } = await api.post(`/v1/shares?type=${data.type ? data.type : "ADD"}`, data);

        if (res.message === "success") {
          mutate(pathKey);
        } else {
          notifications.show({
            title: "Error",
            message: res.message,
            color: "red",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Something went wrong",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    },
    [pathKey]
  );

  return {
    data: data ? data : [],
    onUpsert,
    onDelete,
    onAddShare,
    loading: loading || (!error && !data) || isValidating,
  };
};

export const useCart = (productID) => {
  const { data, error, isValidating } = useSWR(`v1/carts/${productID}`);

  return {
    data: data ? data : {},
    loading: (!error && !data) || isValidating,
  };
};
